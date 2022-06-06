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
