const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
let mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 960, 
        height: 640, 
        minWidth: 480,
        minHeight: 480,
        title: "Za Chat",
        icon: __dirname + '/../public/favicon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
        }
    });

    //mainWindow.removeMenu();

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}
app.disableHardwareAcceleration();
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});