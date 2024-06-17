import React, { useEffect, useState } from 'react';
import { spotifyApi } from '../spotify.js';
import PlaylistItem from './PlaylistItem.jsx';
import { Spinner } from '@nextui-org/react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

const SpotifyPlaylistsList = ({ sortByKey }) => {
  const [playlists, setPlaylists] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
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
        // while (playlists && playlists.next);
        // delete playlists with duplicate ids
        allPlaylists = allPlaylists.filter(
          (playlist, index, self) => index === self.findIndex((t) => t.id === playlist.id)
        );
        allPlaylists = sortPlaylists(sortByKey, allPlaylists);
        setPlaylists(allPlaylists);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
      setLoading(false);
    };

    fetchPlaylist();
  }, [sortByKey]);

  const sortPlaylists = (sortByKey, any_playlists) => {
    setLoading(true);
    let sortedPlaylists;
    if (any_playlists === null) return;
    if (sortByKey === 'name') {
      sortedPlaylists = [...any_playlists].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else if (sortByKey === 'owner') {
      sortedPlaylists = [...any_playlists].sort((a, b) => {
        return a.owner.display_name.localeCompare(b.owner.display_name);
      });
    } else if (sortByKey === 'length') {
      sortedPlaylists = [...any_playlists].sort((a, b) => {
        return a.tracks.total - b.tracks.total;
      });
    } else {
      sortedPlaylists = any_playlists;
    }
    setLoading(false);
    return sortedPlaylists;
  };

  return (
    <div className="flex items-center justify-center">
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {playlists ? (
            playlists.map((playlist) => (
              <Link key={playlist.id} to={'../playlist/' + playlist.id}>
                <PlaylistItem
                  key={playlist.id}
                  image={playlist.images[0].url}
                  title={playlist.name}
                  type="spotify"></PlaylistItem>
              </Link>
            ))
          ) : (
            <p>No playlists found.</p>
          )}
        </div>
      )}
    </div>
  );
};

SpotifyPlaylistsList.propTypes = {
  sortByKey: PropTypes.string.isRequired
};

export default SpotifyPlaylistsList;
