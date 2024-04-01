import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';

const Settings = () => {
  // const [xmlPath, setXmlPath] = useState('');
  const [xmlFilePath, setXmlFilePath] = useState('');

  useEffect(() => {
    const storedFilePath = localStorage.getItem('xmlFilePath');
    if (storedFilePath) {
      setXmlFilePath(storedFilePath);
    }
  }, []);

  const handleFileChange = async () => {
    try {
      const filePath = await window.selectFile();
      setXmlFilePath(filePath);
      localStorage.setItem('xmlFilePath', filePath);
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

  return (
    <div className="p-16 h-screen">
      <h1 className="text-3xl pb-4">Settings</h1>
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
        <Button color="primary" onClick={handleFileChange}>
          Choose File
        </Button>
      </div>
    </div>
  );
};

export default Settings;
