const { BrowserWindow, app, Menu, dialog} = require("electron");
const { ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const { NodeSSH } = require('node-ssh');
const yaml = require('js-yaml')

let mainWindow;
const startUrl = process.env.ELECTRON_START_URL

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.resolve(__dirname, "preload.js"),
        },
    });
    
    mainWindow.setMenuBarVisibility(false);

    if (startUrl) {
        mainWindow.loadURL(startUrl);
    } else {
        mainWindow.loadFile("./build/index.html")
    }

};

const ssh = new NodeSSH()

app.whenReady().then(() => {

    ipcMain.handle('connect-ssh', async (event, hostAddress, hostUserName, hostUserPassword) => {
        
        return new Promise ((resolve, reject) => {
            ssh.connect({
                host: hostAddress,
                port: 22,
                username: hostUserName,
                password: hostUserPassword
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            })
        }).then(() => {
            return true
        }).catch(() => {
            return false
        })

    })

    ipcMain.handle('exec-cmd-by-ssh', async (event, cmd, passwd) => {
        if ( ~cmd.indexOf('sudo')) {
            return await ssh.execCommand(cmd, {stdin: passwd + '\n', options: {pty: true}})
        }
        return await ssh.execCommand(cmd, {options: {pty: true}}) 
    })

    ipcMain.handle('disconnect-ssh', async(event) => {
        ssh.dispose()
    })

    ipcMain.handle('get-file-path', async () => {
        return dialog
        .showOpenDialog(mainWindow, {
            properties: ['開く'],
            title: 'ファイルを選択する',
            filters: [
                {
                    name: 'YAMLファイル',
                    extensions: ['yaml'],
                },
            ],
        })
        .then((result) => {
            if (result.canceled) return;
            return result.filePaths[0]
        })
        .catch((err) => console.log(`Error: ${err}`))
    })

    ipcMain.handle('file-open-as-yaml', async (event, target) => {
        return new Promise ((resolve, reject) => {
            try {
                file = fs.readFileSync(target)
                resolve(file)
            } catch (err) {
                reject(err)
            }
        }).then((file) => {
            try {
                yml = yaml.load(file)
                return yml 
            } catch (err) {
                return err.toString()
            }
        }).catch((err) => {
            return err.toString()
        })
    })

    ipcMain.handle('web-api-window-open', async (event, number, flowNumber, cmtsNumber) => {

        const child = new BrowserWindow({
            parent: mainWindow,
            width: 800,
            height: 450,
            modal: false,
            show: false,
            webPreferences: {
                preload: path.resolve(__dirname, "preload.js"),
            },
        })

        if (startUrl) {
            child.loadURL(`${startUrl.slice(0, startUrl.length - 1)}#/SystemInfo/${number}/${flowNumber}/${cmtsNumber}`);
        } else {
            child.loadURL(`file://${__dirname.slice(0, __dirname.length - 8)}build/index.html#/SystemInfo/${number}/${flowNumber}/${cmtsNumber}`); 
        }
        child.setMenuBarVisibility(false)
        child.show('ready-to-show', () => {
            child.show()
        })
    })

    ipcMain.handle('close-window', async(event) => {
        app.quit()
    })

    createWindow()
});

app.once('window-all-closed', () => app.quit());