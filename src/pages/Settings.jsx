import React, { useState } from 'react';
import { Button } from '@nextui-org/react';

const Settings = () => {
  // const [xmlPath, setXmlPath] = useState('');
  const [xmlFilePath, setXmlFilePath] = useState('');

  const handleFileChange = async () => {
    const response = await fetch('/chooseRekordboxXML', { method: 'POST' });
    const data = await response.json();
    if (data.path) {
      // setXmlPath(data.path);
      setXmlFilePath(data.path);
      localStorage.setItem('xmlPath', data.path);
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
