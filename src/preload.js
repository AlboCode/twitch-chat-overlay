// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('chat', {
    onUpdateChat: (callback) => ipcRenderer.on('update-chat', (_event, value) => callback(value)),

})