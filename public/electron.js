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

function createAuthWindows() {
    appWindow = new BrowserWindow({
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
    appWindow.loadURL(getWindowUrl('authLoader'));
    appWindow.on('ready-to-show', () => appWindow.show());
}

function createMainWindow() {
    appWindow.setMinimumSize(480, 480);
    appWindow.setSize(960, 640);
    appWindow.setMaximizable(true);
    appWindow.setResizable(true);
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
    appWindow.loadURL(getWindowUrl(windowName));
});

ipcMain.on('openApp', () => {
    createMainWindow();
});
