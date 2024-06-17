import React, { useState, useEffect } from 'react';
import { Button, Select, SelectItem, Input } from '@nextui-org/react';
import { Folder, File } from '@phosphor-icons/react';

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
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-xl font-bold pb-2">XML Path</h2>
          <div className="grid grid-cols-[5fr,1fr] gap-2">
            <Input
              type="text"
              label="XML File Path"
              value={xmlFilePath}
              onChange={(e) => {
                setXmlFilePath(e.target.value);
                localStorage.setItem('xmlFilePath', e.target.value);
              }}
            />
            <Button color="primary" onClick={handleXMLFileChange} className="h-auto px-8 text-1xl">
              <File size={24} />
              Choose File
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold pb-2">Music Folder Path</h2>
          <div className="grid grid-cols-[5fr,1fr] gap-2">
            <Input
              type="text"
              label="Music Folder Path"
              value={musicFolderPath}
              onChange={(e) => {
                setMusicFolderPath(e.target.value);
                localStorage.setItem('musicFolderPath', e.target.value);
              }}
            />
            <Button
              color="primary"
              onClick={handleMusicFolderChange}
              className="h-auto px-8 text-1xl">
              <Folder size={24} />
              Choose Folder
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold pb-2">App Theme</h2>
          <div className="flex flex-col gap-2">
            <Select
              value={localStorage.getItem('theme')}
              defaultSelectedKeys={[localStorage.getItem('theme')]}
              label="Select a theme"
              onChange={(value) => {
                localStorage.setItem('theme', value);
                window.dispatchEvent(new CustomEvent('theme-changed', { detail: value }));
              }}>
              <SelectItem key="light" value="light">
                Light
              </SelectItem>
              <SelectItem key="dark" value="dark">
                Dark
              </SelectItem>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
