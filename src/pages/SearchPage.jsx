import React, { useEffect, useState } from 'react';
import SpotifyPlaylist from '../components/SpotifyPlaylist.jsx';
import { spotifyApi } from '..js';

const SearchPage = () => {
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        // Replace 'playlistId' with the actual ID of the Spotify playlist you want to fetch
        const playlistId = '37i9dQZF1DX7ZUug1ANKRP';
        await spotifyApi.getPlaylist(playlistId).then((data) => {
          console.log(data.body);
          setPlaylist(data.body);
        });
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
  }, []);

  return (
    <div>{playlist ? <SpotifyPlaylist playlist={playlist} /> : <p>Loading playlist...</p>}</div>
  );
};

export default SearchPage;
