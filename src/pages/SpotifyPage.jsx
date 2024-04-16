import React, { useEffect, useState } from 'react';
import SpotifyPlaylistsList from '../components/SpotifyPlaylistsList.jsx';
import { spotifyApi } from '../spotify.js';
import PageTabs from '../components/PageTabs.jsx';
import FilterCapsule from '../components/FilterCapsule.jsx';

const SpotifyPage = () => {
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        let allPlaylists = [];
        let offset = 0;
        let nextExists = false;

        do {
          await spotifyApi.getUserPlaylists({ offset }).then((data) => {
            console.log(data);
            allPlaylists = allPlaylists.concat(data.body.items);
            offset += data.body.items.length + 1;
            nextExists = !!data.body.next;
          });
        } while (nextExists);
        while (playlists && playlists.next);
        // delete playlists with duplicate ids
        allPlaylists = allPlaylists.filter(
          (playlist, index, self) => index === self.findIndex((t) => t.id === playlist.id)
        );

        setPlaylists(allPlaylists);

        sortPlaylists('name');
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylist();
  }, []);

  const sortPlaylists = (key) => {
    let sortedPlaylists;
    if (key === 'name') {
      sortedPlaylists = [...playlists].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else if (key === 'user') {
      sortedPlaylists = [...playlists].sort((a, b) => {
        return a.owner.display_name.localeCompare(b.owner.display_name);
      });
    } else if (key === 'length') {
      sortedPlaylists = [...playlists].sort((a, b) => {
        return a.tracks.total - b.tracks.total;
      });
    }
    setPlaylists(sortedPlaylists);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between">
        <PageTabs className=""></PageTabs>
        <FilterCapsule
          onItemSelected={sortPlaylists}
          options={[
            { key: 'name', label: 'Name' },
            { key: 'user', label: 'User' },
            { key: 'length', label: 'Length' }
          ]}
        />
      </div>
      {playlists ? <SpotifyPlaylistsList playlists={playlists} /> : <p>Loading playlists...</p>}
    </div>
  );
};

export default SpotifyPage;
