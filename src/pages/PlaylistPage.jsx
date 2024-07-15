import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SpotifyPlaylist from '../components/SpotifyPlaylist.jsx';
import { spotifyApi } from '../spotify.js';
import { Spinner } from '@nextui-org/react';
import PlaylistHeader from '../components/PlaylistHeader.jsx';
import AnimatedHeart from '../components/animated/AnimatedHeart.jsx';
import AnimatedShuffle from '../components/animated/AnimatedShuffle.jsx';
import AnimatedPlayButton from '../components/animated/AnimatedPlayButton.jsx';
import AnimatedIntersect from '../components/animated/AnimatedIntersect.jsx';
import { useMusic } from '../components/context/mainContext.jsx';

import { Link } from 'react-router-dom';

const PlaylistPage = () => {
  const [playlist, setPlaylist] = useState(null);
  const { selectPlaylist } = useMusic();

  // extract playlistId from URL (playlist/:playlistId
  const { playlistId } = useParams();
  console.log(playlistId);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        await spotifyApi.getPlaylist(playlistId).then((data) => {
          console.log('playlist from page', data.body);
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
            <AnimatedPlayButton />
            <AnimatedShuffle />
            <AnimatedHeart />
            <Link to="/compare">
              <button
                type="button"
                className="bg-transparent"
                onClick={() => {
                  console.log('Intersect button clicked');
                  selectPlaylist(playlist);
                }}>
                <AnimatedIntersect />
              </button>
            </Link>
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
