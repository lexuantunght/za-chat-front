/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer } from 'electron';

export const navigate = (windowName: string) => {
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

export const openFileViewer = (data: any) => {
    ipcRenderer.send('openFileViewer', data);
};

export const openSaveDialog = (file: any) => {
    ipcRenderer.send('openSaveDialog', file);
};

export const addListener = (
    key: string,
    callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void
) => {
    ipcRenderer.on(key, callback);
};

export const removeAllListeners = (key: string) => {
    ipcRenderer.removeAllListeners(key);
};
