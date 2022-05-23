const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const ipcMain = electron.ipcMain;

function getWindowUrl(windowName = 'index') {
    return url.format({
        pathname: path.join(__dirname, `/../build/${windowName}.html`),
        protocol: 'file:',
        slashes: true
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
            devTools: false,
            webSecurity: false
        },
        maximizable: false,
        resizable: false
    });
    authWindow.removeMenu();
    authWindow.loadURL(getWindowUrl('login'));
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
            devTools: false,
            webSecurity: false
        },
        show: true
    });
    appWindow.removeMenu();
    appWindow.maximize();
    appWindow.loadURL(getWindowUrl());
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
