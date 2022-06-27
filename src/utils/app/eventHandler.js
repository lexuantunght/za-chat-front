import { ipcRenderer } from 'electron';

export const navigate = (windowName) => {
    ipcRenderer.send('navigation', windowName);
};

export const quitApp = () => {
    ipcRenderer.send('quit');
};

export const logout = () => {
    ipcRenderer.send('logout');
};

export const openMainApp = () => {
    ipcRenderer.send('openApp');
};

export const openFileViewer = (data) => {
    ipcRenderer.send('openFileViewer', data);
};

export const openSaveDialog = (file) => {
    ipcRenderer.send('openSaveDialog', file);
};

export const addListener = (key, callback) => {
    ipcRenderer.on(key, callback);
};

export const removeAllListeners = (key) => {
    ipcRenderer.removeAllListeners(key);
};
