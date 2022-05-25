/* eslint-disable */
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const ipcMain = electron.ipcMain;

const isDev = process.env.NODE_ENV === 'development';

function getWindowUrl(windowName = 'index') {
    if (isDev) {
        return `${process.env.ELECTRON_START_URL}/${windowName}.html`;
    }
    return url.format({
        pathname: path.join(__dirname, `/../build/${windowName}.html`),
        protocol: 'file:',
        slashes: true,
    });
}

let appWindow;
let authWindow;

function createAuthWindows() {
    authWindow = new BrowserWindow({
        width: 360,
        height: 540,
        title: 'ZaChat',
        icon: __dirname + './favicon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: isDev,
            webSecurity: false,
        },
        maximizable: false,
        resizable: false,
        show: false,
    });
    authWindow.removeMenu();
    authWindow.loadURL(getWindowUrl('authLoader'));
    authWindow.on('ready-to-show', () => authWindow.show());
}

function createMainWindow() {
    appWindow = new BrowserWindow({
        width: 960,
        height: 640,
        minWidth: 480,
        minHeight: 480,
        title: 'ZaChat',
        icon: __dirname + './favicon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: isDev,
            webSecurity: false,
        },
        show: false,
        hasShadow: true,
    });
    //appWindow.removeMenu();
    appWindow.maximize();
    appWindow.loadURL(getWindowUrl());
    appWindow.on('ready-to-show', () => appWindow.show());
}

app.disableHardwareAcceleration();
app.on('ready', createAuthWindows);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (appWindow === null) {
        //createMainWindow();
    }
});

ipcMain.on('navigation', (events, windowName) => {
    authWindow.loadURL(getWindowUrl(windowName));
});

ipcMain.on('openApp', () => {
    authWindow.close();
    createMainWindow();
});
