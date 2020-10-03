const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const ipcMain = electron.ipcMain;
const dialog = electron.dialog;

const steg = require('../utils/core');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 645,
        resizable: false,
        webPreferences: { nodeIntegration: true, preload: __dirname + '/preload.js' }
    });

    const startURL = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../dist/index.html'),
        protocol: 'file:',
        slashes: true
    })

    // and load the index.html of the app.
    mainWindow.loadURL(startURL);

    // hide the menu
    // mainWindow.setMenu(null);


    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



// IPC Processes

let files = {};

let decrypted_files = {};

ipcMain.handle("hideParentFile", async (e, o) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ["openFile"],
        filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
    });
    let results = {};
    if (canceled) {
        results.error = true;
        return results;
    } else {
        files.parentFile = filePaths[0];
        results.fileName = path.basename(filePaths[0]);
        console.log(files);
        return results;
    }
});

ipcMain.handle("hideChildFile", async (e, o) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ["openFile"],
    });
    let results = {};
    if (canceled) {
        results.error = true;
        return results;
    } else {
        files.childFile = filePaths[0];
        results.fileName = path.basename(filePaths[0]);
        console.log(files);
        return results;
    }
});

ipcMain.handle("saveHiddenFile", async (e, o) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        buttonLabel: "Save your secret file",
        filters: [{ name: "Images" }]
    });
    let results = {};
    if(canceled) {
        results.error = true;
        return results;
    } else {
        const res = await steg.encrypt(files.parentFile, files.childFile, filePath, o.password);
        results.successfull = res.result;
        return results;
    }
});

ipcMain.handle("selectParentFileForDecrypting", async (e, o) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ["openFile"],
        filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
    });
    let results = {};
    if (canceled) {
        results.error = true;
        return results;
    } else {
        decrypted_files.parentFile = filePaths[0];
        results.fileName = path.basename(filePaths[0]);
        console.log(decrypted_files);
        return results;
    } 
})

ipcMain.handle("decryptHiddenFile", async (e, o) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory"],
    });
    let results = {};
    if (canceled) {
        results.error = true;
        return results;
    } else {
        const directoryToSave = filePaths[0];

        console.log(decrypted_files.parentFile + " " + directoryToSave + " " + o.password);

        const res = await steg.decrypt(decrypted_files.parentFile, directoryToSave, o.password);
        if(res === undefined) {
            results.successfull = false;
            return results;
        } else {
            results.successfull = res.result;
            results.childFile = res.file;
            return results;
        }
    }  
});

ipcMain.on("clearHideCache", async (e, o) => {
    files = {};
});

ipcMain.on("clearDecryptCache", async(e, o) => {
    decrypted_files = {};
})