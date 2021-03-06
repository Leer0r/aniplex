"use strict";

var _require = require('electron'),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow,
    ipcMain = _require.ipcMain;

var path = require('path');

var ejse = require("ejs-electron");

require('@electron/remote/main').initialize(); // Handle creating/removing shortcuts on Windows when installing/uninstalling.


if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

var window;

var buildWindow = function buildWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    width: 1500,
    height: 1000,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  }); // and load the index.html of the app.

  window.loadFile(path.join(__dirname, '../views/template/loader.ejs'));
};

var load_template = function load_template(path) {}; // This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.


app.on('ready', buildWindow); // Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    buildWindow();
  }
});
ipcMain.on("anime_charged", function (e, animes) {
  console.log(animes);
  ejse.data("anime_data", animes);
  window.loadFile(path.join(__dirname, '../views/template/home.ejs'));
});
ipcMain.on("data_add", function (e, location) {
  console.log("Data added on ".concat(location));
});
ipcMain.on("anime_click", function (e, hash) {
  console.log(hash);
}); // In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.