const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const ipcMain = electron.ipcMain;

let mainWindow;
let authWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 960,
        height: 640,
        minWidth: 480,
        minHeight: 480,
        title: 'ZaChat',
        icon: __dirname + './favicon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        },
        show: false
    });

    //mainWindow.removeMenu();

    const startUrl =
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '/../build/index.html'),
            protocol: 'file:',
            slashes: true
        });
    mainWindow.loadURL(startUrl);
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // auth window
    authWindow = new BrowserWindow({
        width: 360,
        height: 540,
        title: 'Login to ZaChat',
        icon: __dirname + './favicon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: false
        },
        maximizable: false,
        resizable: false
    });
    authWindow.removeMenu();
    const loginUrl =
        process.env.ELECTRON_LOGIN_URL ||
        url.format({
            pathname: path.join(__dirname, '/../build/login.html'),
            protocol: 'file:',
            slashes: true
        });
    authWindow.loadURL(loginUrl);
    authWindow.on('closed', function () {
        authWindow = null;
    });
}
app.disableHardwareAcceleration();
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('navigation', (events, windowName) => {
    authWindow.loadURL(`http://localhost:3000/${windowName}.html`);
});
