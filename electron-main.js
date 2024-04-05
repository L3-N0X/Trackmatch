const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
// const { parseXmlData } = require('./src/RekordboxXmlUtils').default;
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

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
    const rekordboxXmlData = fs.readFileSync(filePath, 'utf8');
    if (!filePath) {
      console.error('File path is empty');
      return null;
    }

    try {
      const parsingOptions = {
        attributeNamePrefix: '@_',
        attrNodeName: false,
        textNodeName: 'Value',
        ignoreAttributes: false,
        ignoreNameSpace: false,
        allowBooleanAttributes: false,
        parseNodeValue: true,
        parseAttributeValue: true,
        trimValues: true,
        cdataPropName: '__cdata',
        parseTrueNumberOnly: false,
        arrayMode: false,
        attrValueProcessor: (val) => (parser.isExist(val) ? parser.isExist(val) : val),
        stopNodes: ['parse-me-as-string']
      };

      const parser = new XMLParser(parsingOptions);
      let parsedRekordboxXML = parser.parse(rekordboxXmlData);

      const parsedDJXML = rekordboxToDjxml(parsedRekordboxXML);
      // console.log('Parsed DJXML:', parsedDJXML);

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const day = String(currentDate.getDate()).padStart(2, '0');

      const formattedDate = `${year}_${month}_${day}`;

      // write the parsed DJXML to a file
      const djxmlFilePath = path.join(
        __dirname,
        'DATA',
        'DJXML',
        `from_rekordbox_${formattedDate}_djxml.xml`
      );
      // convert js object back to xml using fast-xml-parser XMLBuilder
      const buildoptions = {
        attributeNamePrefix: '',
        attrNodeName: false,
        textNodeName: 'Value',
        ignoreAttributes: false,
        cdataTagName: '__cdata',
        format: false,
        indentBy: '  ',
        supressEmptyNode: false
      };

      const builder = new XMLBuilder(buildoptions);
      let xmlDataStr = builder.build(parsedDJXML);
      xmlDataStr = `<?xml version="1.0" encoding="UTF-8"?>\n` + xmlDataStr;

      fs.writeFileSync(djxmlFilePath, xmlDataStr, 'utf8');
      console.log('DJXML file written:', djxmlFilePath);

      // localStorage.setItem('djxmlFilePath', djxmlFilePath);

      return parsedDJXML;
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

function rekordboxToDjxml(parsedRekordboxXmlData) {
  // Convert the JSON object to the desired format
  const djxml = {
    DJXML: {
      DJXMLVersion: '2.0.0',
      Software: {
        SoftwareName: 'MIXO',
        SoftwareVersion: '1.53.0',
        URL: 'https://github.com/mixo-marcus/DJXML'
      },
      Library: {
        Entries: parsedRekordboxXmlData.DJ_PLAYLISTS.COLLECTION['@_Entries'],
        Track: []
      },
      Playlists: {
        Folder: []
      }
    }
  };

  parsedRekordboxXmlData.DJ_PLAYLISTS.COLLECTION.TRACK.forEach((track) => {
    const newTrack = {
      Id: track['@_TrackID'],
      Title: track['@_Name'],
      Album: track['@_Album'] || '',
      Artist: track['@_Artist'] || '',
      Remixer: track['@_Remixer'] || '',
      Composer: track['@_Composer'] || '', // composer instead of producer
      Bpm: track['@_AverageBpm'] || 0,
      BitRate: track['@_BitRate'],
      // colour not used
      Comments: track['@_Comments'] || '',
      DateAdded: track['@_DateAdded'],
      DiscNumber: track['@_DiscNumber'] || 0,
      Genre: track['@_Genre'] || '',
      // subgenre not used
      // subsubgenre not used
      Grouping: track['@_Grouping'] || '',
      Tonality: track['@_Tonality'] || '', // tonality instead of key ?
      Kind: (() => {
        const kind = track['@_Kind'].split('-')[0].toUpperCase();
        const validKinds = ['MP3', 'WAV', 'AIFF', 'OGG', 'AAC', 'FLAC'];
        if (!validKinds.includes(kind)) console.log('Error reading Kind' + track['@_Kind']);
        return validKinds.includes(kind) ? kind : 'MP3';
      })(), // Kind has to be one of MP3, WAV, AIFF, OGG, AAC, FLAC
      Label: track['@_Label'] || '',
      Location: decodeURIComponent(track['@_Location']).replace('file://localhost/', ''),
      Mix: track['@_Mix'] || '',
      PlayCount: track['@_PlayCount'] || 0,
      Rating: track['@_Rating'] || 0,
      // [duplicate] remixer not used
      SampleRate: track['@_SampleRate'],
      Size: track['@_Size'],
      // Musical key not used
      TotalTime: track['@_TotalTime'],
      TrackNumber: track['@_TrackNumber'] || 0,
      Year: track['@_Year'] || 0
      // Energy not used
      // Lossless not used
      // pressing not used
      // riddim not used
      // KeywordTags not used
    };

    let trackPositionMarks;

    if (Array.isArray(track.POSITION_MARK)) {
      trackPositionMarks = track.POSITION_MARK;
    } else if (track.POSITION_MARK) {
      trackPositionMarks = [track.POSITION_MARK];
    }
    if (trackPositionMarks) {
      newTrack.CuePoint = [];
      trackPositionMarks.forEach((cuePoint) => {
        newTrack.CuePoint.push({
          Name: cuePoint['@_Name'],
          Type: cuePoint['@_Type'],
          Start: cuePoint['@_Start'],
          Num: cuePoint['@_Num'],
          Red: cuePoint['@_Red'] || 0,
          Green: cuePoint['@_Green'] || 0,
          Blue: cuePoint['@_Blue'] || 0
        });
      });
    }

    djxml.DJXML.Library.Track.push(newTrack);
  });
  // Playlists
  djxml.DJXML.Playlists.Folder = convertNode(
    parsedRekordboxXmlData.DJ_PLAYLISTS.PLAYLISTS.NODE,
    'root'
  );

  return djxml;
}
function convertNode(node, parentFolderId) {
  let result = [];

  if (!Array.isArray(node)) {
    node = [node];
  }

  node.forEach((child) => {
    let entry = {};

    if (child.NODE) {
      if (Array.isArray(child.NODE)) {
        entry = {
          Folder: convertNode(child.NODE, generateId())
        };
      } else {
        entry = {
          Folder: [convertNode([child.NODE], generateId())]
        };
      }
    } else if (child.TRACK) {
      entry = {
        Playlist: {
          PlaylistName: child.Name,
          Entries: Array.isArray(child.TRACK) ? child.TRACK.length : 1,
          Id: generateId(),
          ParentFolderId: parentFolderId
        },
        PlaylistTrack: Array.isArray(child.TRACK)
          ? child.TRACK.map((track) => `<PlaylistTrack Id="${track.Key}" />`)
          : `<PlaylistTrack Id="${child.TRACK.Key}" />`
      };
    }

    if (child) {
      entry['Name'] = child.NAME || 'root';
      entry['Entries'] = Array.isArray(child.NODE) ? child.NODE.length : 1;
      entry['Id'] = generateId();
      if (child.Type === '0') entry['ParentFolderId'] = parentFolderId;
    }

    result.push(entry);
  });

  return result;
}

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}
