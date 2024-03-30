import React, { useState } from 'react';
import { Input } from '@nextui-org/react';

const Settings = () => {
  const [xmlPath, setXmlPath] = useState('');
  const [xmlFilePath, setXmlFilePath] = useState('');

  const handleFileChange = async () => {
    const response = await fetch('/chooseRekordboxXML');
    const data = await response.json();
    if (data.path) {
      setXmlPath(data.path);
      setXmlFilePath(data.path);
      localStorage.setItem('xmlPath', xmlPath);
    }
  };

  return (
    <div className="p-16 h-screen">
      <h1 className="text-3xl pb-4">Settings</h1>

      <div>
        <h2 className="text-xl font-bold">XML Path</h2>
        <div className="flex flex-col gap-2"></div>
        <input
          type="text"
          value={xmlFilePath}
          onChange={(event) => setXmlPath(event.target.value)}
        />
        <button onClick={handleFileChange}>Choose File</button>
        <Input type="email" onChange={handleFileChange} />
      </div>
    </div>
  );
};

export default Settings;
