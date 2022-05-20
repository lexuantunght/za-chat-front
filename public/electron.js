const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

let mainWindow;
let loginWindow;

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

    const startUrl = url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // child window
    loginWindow = new BrowserWindow({
        width: 400,
        height: 540,
        title: 'Login to ZaChat',
        icon: __dirname + './favicon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        },
        maximizable: false
    });
    const loginUrl = url.format({
        pathname: path.join(__dirname, '/../build/login.html'),
        protocol: 'file:',
        slashes: true
    });
    loginWindow.loadURL(loginUrl);
    loginWindow.on('closed', function () {
        loginWindow = null;
        mainWindow.show();
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
