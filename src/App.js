import "./App.css";
import React, { useEffect, useState } from "react";
import { access_token, exchangeToken, spotifyApi } from "./spotify";
import LoginPage from "./pages/LoginPage.jsx";
import MainAppPage from "./pages/MainAppPage.jsx";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
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

  return <div className="bg-default-50">{loggedIn && user ? <MainAppPage /> : <LoginPage />}</div>;
}

export default App;
