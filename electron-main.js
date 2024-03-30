// import 'electron-webpack/initialize';
const { app, BrowserWindow } = require('electron');
// const express = require('express');
// const cors = require('cors');
const path = require('path');
let isDev;
import('electron-is-dev')
  .then((module) => {
    isDev = module.default;
  })
  .catch((err) => {
    console.error('Failed to load electron-is-dev:', err);
  });

let mainWindow;
// const expressApp = express();
// const PORT = 3001;

// expressApp.use(express.json());

// // frontend lets user choose an xml file and once the file is picked, it sends the file path back to frontend
// expressApp.post('/chooseRekordboxXML', (req, res) => {
//   // use a dialog to ask the user for the file which should be used in the apllication
//   dialog
//     .showOpenDialog({
//       properties: ['openFile'],
//       filters: [{ name: 'XML', extensions: ['xml'] }]
//     })
//     .then((file) => {
//       if (file.filePaths.length > 0) {
//         res.send({ path: file.filePaths[0] });
//       } else {
//         res.send({ path: null });
//       }
//     });
// });

// expressApp.listen(PORT, () => {
//   console.log(`Express server is running on port ${PORT}`);
// });

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  console.log("IsDev ? : ", isDev)
  const startURL = 'http://localhost:3000' // Development URL
    // isDev  ? : true,  `file://${path.join(__dirname, './build/index.html')}`; // Production URL

  mainWindow.loadURL(startURL);

  if (isDev) {
    mainWindow.webContents.once('did-frame-finish-load', () => {
      mainWindow.webContents.openDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
