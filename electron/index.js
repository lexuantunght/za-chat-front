const {
    BrowserWindow,
    app,
    ipcMain,
    Menu,
    Tray,
    session,
    dialog,
    nativeTheme,
} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const client = require('https');

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

const iconPath = isDev
    ? path.join(__dirname, '/../public/favicon.ico')
    : path.join(__dirname, `/../build/favicon.ico`);

let appWindow;
let fileViewerWindow;
let isQuiting;
let tray;

function createBaseWindow() {
    appWindow = new BrowserWindow({
        width: 360,
        height: 540,
        title: 'ZaChat',
        icon: iconPath,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            height: 25,
            color: '#eeeeee',
            symbolColor: '#555555',
        },
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: isDev,
            webSecurity: false,
            webgl: true,
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

function createFileViewerWindow(data) {
    fileViewerWindow = new BrowserWindow({
        minWidth: 540,
        minHeight: 540,
        title: 'ZaChat',
        icon: iconPath,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: isDev,
            webSecurity: false,
            partition: 'persist:app',
        },
        maximizable: true,
        resizable: true,
        show: true,
    });
    fileViewerWindow
        .loadURL(getWindowUrl('file-viewer'))
        .then(() => fileViewerWindow.webContents.send('fileView', data));
    fileViewerWindow.maximize();
    fileViewerWindow.on('close', () => {
        fileViewerWindow = null;
    });
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
    tray = new Tray(iconPath);
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

ipcMain.on('openFileViewer', (event, data) => {
    if (!fileViewerWindow) {
        createFileViewerWindow(data);
    } else {
        fileViewerWindow.webContents.send('fileView', data);
        if (fileViewerWindow.isMinimized()) {
            fileViewerWindow.restore();
        }
        fileViewerWindow.moveTop();
    }
});

ipcMain.on('openSaveDialog', (event, file) => {
    dialog
        .showSaveDialog(fileViewerWindow, {
            title: 'ZaChat - Save file',
            defaultPath: path.join(app.getPath('downloads'), file.name),
            filters: [{ name: `${file.type?.toUpperCase()} Files`, extensions: [file.type] }],
        })
        .then((result) => {
            if (result.canceled) return;
            client.get(file.url, (response) => {
                response.pipe(fs.createWriteStream(result.filePath));
            });
        });
});

ipcMain.handle('dark-mode:toggle', (e, isDarkMode) => {
    if (!isDarkMode) {
        nativeTheme.themeSource = 'light';
        appWindow.setTitleBarOverlay({ color: '#eeeeee', symbolColor: '#555555' });
    } else {
        nativeTheme.themeSource = 'dark';
        appWindow.setTitleBarOverlay({ color: '#071426', symbolColor: '#eeeeee' });
    }
    return nativeTheme.shouldUseDarkColors;
});

ipcMain.once('quit', () => {
    app.quit();
});
