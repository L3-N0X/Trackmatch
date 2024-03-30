import React from 'react';
import { Button } from '@nextui-org/react';
import { SignIn } from '@phosphor-icons/react';

import login from '../spotify.js';

const LoginPage = () => {
  return (
    <div className="h-screen flex text-center justify-center items-center flex-col gap-4">
      <h1 className="text-4xl font-bold">Connect with Spotify</h1>
      <p className="">
        This app requires you to connect with Spotify in order to access its features.
      </p>
      <Button color="primary" size="large" onClick={login}>
        <SignIn size={24} />
        Start Login
      </Button>
    </div>
  );
};

export default LoginPage;
