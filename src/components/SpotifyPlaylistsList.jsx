import React from 'react';
// import {} from '@nextui-org/react';
import PlaylistItem from './PlaylistItem.jsx';
import PropTypes from 'prop-types';

const SpotifyPlaylistsList = ({ playlists }) => {
  //   let tracklist = playlist.tracks.items;
  console.log(playlists);

  return (
    <div className="grid grid-cols-4 gap-4">
      {playlists.map((playlist) => (
        <PlaylistItem
          key={playlist.id}
          image={playlist.images[0].url}
          title={playlist.name}
          type="spotify"></PlaylistItem>
      ))}
    </div>
  );
};

SpotifyPlaylistsList.propTypes = {
  playlists: PropTypes.array.isRequired
};

export default SpotifyPlaylistsList;
