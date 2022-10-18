const { contextBridge, ipcMain, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
    'electronAPI', {
        connectSSH: async (hostAddress, hostUserName, hostUserPassword) => await ipcRenderer.invoke('connect-ssh', hostAddress, hostUserName, hostUserPassword),
        execCmdBySSH: async (cmd, passwd) => await ipcRenderer.invoke('exec-cmd-by-ssh', cmd, passwd),
        disConnectSSH: async () => await ipcRenderer.invoke('disconnect-ssh'),
        getFilePath: async () => await ipcRenderer.invoke('get-file-path'),
        fileOpenAsJSON: async (target) => await ipcRenderer.invoke('file-open-as-json', target),
        webApiWindowOpen: async (number, templateIndex, cmtsNumber) => await ipcRenderer.invoke('web-api-window-open', number, templateIndex, cmtsNumber),
        closeWindow: async () => await ipcRenderer.invoke('close-window'),
    }
)