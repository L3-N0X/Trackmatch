import './App.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { access_token, exchangeToken, refreshToken, spotifyApi } from './spotify.js';
import LoginPage from './pages/LoginPage.jsx';
import MainAppPage from './pages/MainAppPage.jsx';
import { NextUIProvider } from '@nextui-org/react';
import { MusicProvider } from './components/context/mainContext.jsx';

function App() {
  const navigate = useNavigate();
  // if (access_token) refreshToken();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  var alreadyRefreshed = false;

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');
    localTheme && setTheme(localTheme);

    const themeChangedListener = (event) => {
      setTheme(event.detail.target.value);
      console.log('Theme changed to:', event.detail.target.value);
    };

    window.addEventListener('theme-changed', themeChangedListener);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('theme-changed', themeChangedListener);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      // Exchange authorization code for access token
      exchangeToken(code)
        .then(() => {
          console.log('erstes bei login');
          let spotifyUser;
          spotifyApi.getMe().then((data) => {
            console.log(data.body);
            spotifyUser = data.body;
            setUser(spotifyUser);
            setLoggedIn(true);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (access_token) {
      if (alreadyRefreshed) return;
      console.log('Else bei login');
      alreadyRefreshed = true;
      refreshToken().then(() => {
        spotifyApi.setAccessToken(access_token);
        let spotifyUser;
        spotifyApi.getMe().then((data) => {
          console.log(data.body);
          spotifyUser = data.body;
          setUser(spotifyUser);
        });
        setLoggedIn(true);
      });
    } else {
      console.log('nicht eingeloggt');
    }
  }, []);

  return (
    <NextUIProvider navigate={navigate}>
      <MusicProvider>
        <main
          //Dark mode changer
          // eslint-disable-next-line no-constant-condition
          className={`${theme === 'dark' ? 'purple-dark' : 'purple-light'} text-foreground bg-background `}>
          <div className="h-screen flex flex-col select-none">
            {loggedIn && user ? <MainAppPage /> : <LoginPage />}
          </div>
        </main>
      </MusicProvider>
    </NextUIProvider>
  );
}

export default App;
