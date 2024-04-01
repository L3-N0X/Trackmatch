const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
// const { parseXmlData } = require('./src/RekordboxXmlUtils').default;
const { XMLParser } = require('fast-xml-parser');

let isDev;
import('electron-is-dev')
  .then((module) => {
    isDev = module.default;
  })
  .catch((err) => {
    console.error('Failed to load electron-is-dev:', err);
  });

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  console.log('IsDev ? : ', isDev);
  const startURL = 'http://localhost:3000'; // Development URL
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

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'XML Files', extensions: ['xml'] } // Add this line to filter for XML files
    ]
  });

  if (!result.canceled) {
    return result.filePaths[0]; // Return the selected file path
  }
});

ipcMain.handle('read-and-parse-file', async (event, filePath) => {
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    if (!filePath) {
      console.error('File path is empty');
      return null;
    }

    try {
      // Parse the XML data and return it
      const parser = new XMLParser();
      let jObj = parser.parse(fileData);

      return jObj;
    } catch (err) {
      console.error(`Error reading file: ${err}`);
      return null;
    }
  } catch (err) {
    console.error(`Error reading file: ${err}`);
    throw err;
  }
});

// Handle the 'read-file' event in the main process (if needed)
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error(`Error reading file: ${err}`);
    throw err;
  }
});

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
