import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SpotifyPlaylist from '../components/SpotifyPlaylist.jsx';
import { spotifyApi } from '../spotify.js';
import { Spinner } from '@nextui-org/react';
import PlaylistHeader from '../components/PlaylistHeader.jsx';
import { Play } from '@phosphor-icons/react';
import AnimatedHeart from '../components/animated/AnimatedHeart.jsx';
import { AnimatedShuffle } from '../components/animated/AnimatedShuffle.jsx';

const PlaylistPage = () => {
  const [playlist, setPlaylist] = useState(null);

  // extract playlistId from URL (playlist/:playlistId
  const { playlistId } = useParams();
  console.log(playlistId);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        await spotifyApi.getPlaylist(playlistId).then((data) => {
          console.log(data.body);
          setPlaylist(data.body);
        });
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  return (
    <>
      {playlist ? (
        <>
          <PlaylistHeader playlist={playlist} />
          <div className="pt-4 px-4 flex flex-row items-center gap-2">
            <div className="h-16 w-16 rounded-md bg-primary-600 flex items-center justify-center">
              <Play size={32} />
            </div>
            <AnimatedShuffle />
            <AnimatedHeart />
          </div>
          <SpotifyPlaylist playlist={playlist} />
        </>
      ) : (
        <div className="w-full flex justify-center py-8">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default PlaylistPage;
