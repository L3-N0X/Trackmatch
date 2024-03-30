import React, { useState } from 'react';
import { Button } from '@nextui-org/react';

const Settings = () => {
  // const [xmlPath, setXmlPath] = useState('');
  const [xmlFilePath, setXmlFilePath] = useState('');

  const handleFileChange = async () => {
    try {
      const filePath = await window.selectFile();
      console.log('Selected file path:', filePath);
      setXmlFilePath(filePath);
      // Do something with the file path
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  return (
    <div className="p-16 h-screen">
      <h1 className="text-3xl pb-4">Settings</h1>

      <div>
        <h2 className="text-xl font-bold">XML Path</h2>
        <div className="flex flex-col gap-2"></div>
        <p>{xmlFilePath}</p>
        <Button color="primary" onClick={handleFileChange}>
          Choose File
        </Button>
      </div>
    </div>
  );
};

export default Settings;
