import React, { createContext, useState, useContext } from 'react';
import propTypes from 'prop-types';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const selectPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    setIsPlaying(true);
  };

  return (
    <MusicContext.Provider value={{ isPlaying, currentPlaylist, togglePlayPause, selectPlaylist }}>
      {children}
    </MusicContext.Provider>
  );
};

MusicProvider.propTypes = {
  children: propTypes.node.isRequired
};

export const useMusic = () => useContext(MusicContext);
