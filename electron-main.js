import { app, BrowserWindow, dialog } from 'electron';
import express, { json, static as expressStatic } from 'express';
import cors from 'cors';
const localServerApp = express();
const PORT = 8088;
const startLocalServer = (done) => {
  localServerApp.use(json({ limit: '100mb' }));
  localServerApp.use(cors());
  localServerApp.use(expressStatic('./build/'));
  localServerApp.listen(PORT, async () => {
    console.log('Server Started on PORT ', PORT);
    done();
  });
};

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
    // webPreferences: {
    //   preload: path.join(__dirname, "preload.js"),
    // },
  });

  // and load the index.html of the app.
  //   mainWindow.loadFile('index.html')
  mainWindow.loadURL('http://localhost:' + PORT);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  startLocalServer(createWindow);

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// frontend lets user choose an xml file and once the file is picked, it sends the file path back to frontend
localServerApp.post('/chooseRekordboxXML', (req, res) => {
  // use a dialog to ask the user for the file which should be used in the apllication

  dialog
    .showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'XML', extensions: ['xml'] }]
    })
    .then((file) => {
      if (file.filePaths.length > 0) {
        res.send({ path: file.filePaths[0] });
      } else {
        res.send({ path: null });
      }
    });
});
