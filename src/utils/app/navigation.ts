import { ipcRenderer } from 'electron';
export const navigate = (windowName: string) => {
    ipcRenderer.send('navigation', windowName);
};
