import React from 'react';
import PropTypes from 'prop-types';
const SpotifySong = ({ track }) => {
  console.log(track);
  return (
    <div>
      <h3>{track.track.name}</h3>
      <p>Author: {track.track.artists.map((artist) => artist.name).join(', ')}</p>
      <p>Length: {12}</p>
      <p>Album: {'Album'}</p>
    </div>
  );
};

SpotifySong.propTypes = {
  track: PropTypes.shape({
    track: PropTypes.shape({
      name: PropTypes.string.isRequired,
      artists: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default SpotifySong;
