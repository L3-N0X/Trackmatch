import React, { useEffect, useState } from 'react';
// import { loadXMLData } from '../RekordboxXmlUtils';
// import { ipcRenderer } from 'electron';
import { getLocalMusic } from '../localMusic';

const SearchPage = () => {
  const [playlist, setPlaylist] = useState(null);

  // useEffect(() => {
  //   console.log('window', window);
  //   const loadAndParseFile = async () => {
  //     if (localStorage.getItem('xmlFilePath')) {
  //       console.log('XML File Path:', localStorage.getItem('xmlFilePath'));
  //       try {
  //         const parsedData = await window.readAndParseFile(localStorage.getItem('xmlFilePath'));
  //         console.log('Playlist:', parsedData);
  //         setPlaylist(parsedData);
  //       } catch (err) {
  //         console.error(`Error reading and parsing file: ${err}`);
  //       }
  //     }
  //   };

  //   // loadAndParseFile();
  //   if (window.readAndParseFile) {
  //     loadAndParseFile();
  //   } else {
  //     console.error('readAndParseFile function not available');
  //   }
  // }, []);

  useEffect(() => {
    getLocalMusic().then((data) => {
      console.log('Local Music:', data);
      setPlaylist(data);
    });
  }, []);

  return <div>{playlist ? <div>LOADED!</div> : <p>Loading playlist...</p>}</div>;
};

export default SearchPage;
