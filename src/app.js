const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require("fs")

const ejse = require("ejs-electron");
const { fstat } = require('fs');
require('@electron/remote/main').initialize()

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../views/template/home.ejs'));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("anime_charged", (e, animes) => {
  console.log(animes);
  if (animes["Fate⁄stay_night,_Heaven's_Feel_I._Presage_Flower"]) {
    console.log("good !");
  }
  else {
    console.log("bad");
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
