import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { ThemeSwitcher } from '../components/ThemeSwitcher.jsx'


const Settings = () => {
  // const [xmlPath, setXmlPath] = useState('');
  const [xmlFilePath, setXmlFilePath] = useState('');
  const [musicFolderPath, setMusicFolderPath] = useState('');

  useEffect(() => {
    const storedXMLFilePath = localStorage.getItem('xmlFilePath');
    if (storedXMLFilePath) {
      setXmlFilePath(storedXMLFilePath);
    }
    const storedMusicFilePath = localStorage.getItem('musicFolderPath');
    if (storedMusicFilePath) {
      setMusicFolderPath(storedMusicFilePath);
    }
  }, []);

  const handleXMLFileChange = async () => {
    try {
      const filePath = await window.selectFile();
      setXmlFilePath(filePath);
      localStorage.setItem('xmlFilePath', filePath);
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  const handleMusicFolderChange = async () => {
    try {
      const filePath = await window.selectFolder();
      setMusicFolderPath(filePath);
      localStorage.setItem('musicFolderPath', filePath);
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  useEffect(() => {
    const handleFileSelected = (event) => {
      const filePath = event.detail;
      setXmlFilePath(filePath);
      localStorage.setItem('xmlFilePath', filePath);
    };

    window.addEventListener('file-selected', handleFileSelected);

    return () => {
      window.removeEventListener('file-selected', handleFileSelected);
    };
  }, []);

  useEffect(() => {
    const handleFolderSelected = (event) => {
      const folderPath = event.detail;
      setMusicFolderPath(folderPath);
      localStorage.setItem('musicFolderPath', folderPath);
    };

    window.addEventListener('folder-selected', handleFolderSelected);

    return () => {
      window.removeEventListener('folder-selected', handleFolderSelected);
    };
  }, []);

  return (
    <div className="p-16 h-screen">
      <h1 className="text-3xl pb-4">Settings</h1>
      <div className='flex flex-col gap-8'>
        <div>
          <h2 className="text-xl font-bold">XML Path</h2>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={xmlFilePath}
              onChange={(e) => {
                setXmlFilePath(e.target.value);
                localStorage.setItem('xmlFilePath', e.target.value);
              }}
            />
          </div>
          <Button color="primary" onClick={handleXMLFileChange}>
            Choose File
          </Button>
        </div>
        <div>
          <h2 className="text-xl font-bold">Music Folder Path</h2>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={musicFolderPath}
              onChange={(e) => {
                setMusicFolderPath(e.target.value);
                localStorage.setItem('musicFolderPath', e.target.value);
              }}
            />
          </div>
          <Button color="primary" onClick={handleMusicFolderChange}>
            Choose Folder
          </Button>
        </div>
        <div>
          <h2 className="text-xl font-bold">App Theme</h2>
          <div className="flex flex-col gap-2">
            <ThemeSwitcher></ThemeSwitcher>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings;
