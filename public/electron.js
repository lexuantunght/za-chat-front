/* eslint-disable */
const { BrowserWindow, app, ipcMain, Menu, Tray, session } = require('electron');
const path = require('path');
const url = require('url');

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
let isQuiting;
let tray;

function createBaseWindow() {
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
            partition: 'persist:app',
        },
        maximizable: false,
        resizable: false,
        show: false,
    });
    if (!isDev) {
        appWindow.removeMenu();
    }
}

function createLoginWindow() {
    appWindow.setSize(360, 540);
    appWindow.loadURL(getWindowUrl('login'));
    appWindow.setMaximizable(false);
    appWindow.setResizable(false);
    appWindow.on('ready-to-show', () => appWindow.show());
}

function createMainWindow() {
    appWindow.loadURL(getWindowUrl());
    appWindow.setSize(960, 640);
    appWindow.setMaximizable(true);
    appWindow.setResizable(true);
    appWindow.maximize();
    appWindow.setMinimumSize(360, 480);
    appWindow.on('close', (event) => {
        if (!isQuiting) {
            event.preventDefault();
            appWindow.hide();
            event.returnValue = false;
        }
    });
}

app.disableHardwareAcceleration();
app.on('ready', () => {
    if (process.platform === 'win32') {
        app.setAppUserModelId('ZaChat');
    }
    createBaseWindow();
    createLoginWindow();
    tray = new Tray(__dirname + './favicon.ico');
    tray.setContextMenu(
        Menu.buildFromTemplate([
            {
                label: 'Mở ZaChat',
                click: () => {
                    appWindow.show();
                },
            },
            {
                label: 'Thoát',
                click: () => {
                    isQuiting = true;
                    app.quit();
                },
            },
        ])
    );
    tray.setToolTip('ZaChat');
});

app.on('activate', function () {
    if (appWindow === null) {
        createLoginWindow();
    }
});

app.on('before-quit', function () {
    isQuiting = true;
});

ipcMain.on('navigation', (events, windowName) => {
    appWindow.loadURL(getWindowUrl(windowName));
});

ipcMain.on('logout', () => {
    session
        .fromPartition('persist:app')
        .clearStorageData({ storages: ['cookies'] })
        .then(() => {
            if (appWindow.isMaximized()) {
                appWindow.unmaximize();
            }
            createLoginWindow();
        });
});

ipcMain.on('openApp', () => {
    createMainWindow();
});

ipcMain.once('quit', () => {
    app.quit();
});
