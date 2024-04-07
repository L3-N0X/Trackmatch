import './App.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { access_token, exchangeToken, refreshToken, spotifyApi } from './spotify.js';
import LoginPage from './pages/LoginPage.jsx';
import MainAppPage from './pages/MainAppPage.jsx';
import { NextUIProvider } from '@nextui-org/react';

function App() {
  const navigate = useNavigate();
  if (access_token) refreshToken();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      // Exchange authorization code for access token
      exchangeToken(code).then(() => {
        setLoggedIn(true);
        let spotifyUser;
        spotifyApi.getMe().then((data) => {
          console.log(data.body);
          spotifyUser = data.body;
          setUser(spotifyUser);
        });
      });
    } else if (access_token) {
      refreshToken();
      setLoggedIn(true);
      spotifyApi.setAccessToken(access_token);
      let spotifyUser;
      spotifyApi.getMe().then((data) => {
        console.log(data.body);
        spotifyUser = data.body;
        setUser(spotifyUser);
      });
    }
  }, []);

  return (
    <NextUIProvider navigate={navigate}>
      <main className="dark text-foreground bg-background">
        <div className="bg-default-50">{loggedIn && user ? <MainAppPage /> : <LoginPage />}</div>;
      </main>
    </NextUIProvider>
  );
}

export default App;
