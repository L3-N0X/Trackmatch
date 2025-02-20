import React, { useState, useEffect } from 'react';
import { useMusic } from '../components/context/mainContext.jsx';
import { getAllLocalTracks } from '../localMusic.js';
import { getMatchLocalSpotify } from '../utils.js';
import CompareSourceTrack from '../components/CompareSourceTrack.jsx';
import CompareResultTrack from '../components/CompareResultTrack.jsx';
import { spotifyApi } from '../spotify.js';

const ComparePage = () => {
  const { currentPlaylist } = useMusic();
  const [potentialMatches, setPotentialMatches] = useState({});
  const [spotifyTrackList, setSpotifyTrackList] = useState([]);

  useEffect(() => {
    if (!currentPlaylist) return;

    const fetchTracks = async () => {
      const localTrackList = await getAllLocalTracks();

      console.log('local', localTrackList);
      console.log('current', currentPlaylist);

      let _spotifyTrackList = [];

      for (let i = 0; i < currentPlaylist.tracks.total; i += 100) {
        console.log('i', i);
        await spotifyApi.getPlaylistTracks(currentPlaylist.id, { offset: i }).then((data) => {
          console.log('data', data);
          _spotifyTrackList = _spotifyTrackList.concat(data.body.items);
        });
      }
      console.log('spotify', _spotifyTrackList);
      setSpotifyTrackList(_spotifyTrackList);

      let temp_potentialMatches = {};

      _spotifyTrackList.forEach((spotifyTrack) => {
        temp_potentialMatches[spotifyTrack.track.id] = [];
        localTrackList.forEach((localTrack) => {
          // Ensure Title is defined and a string
          if (
            !localTrack.Title ||
            typeof localTrack.Title !== 'string' ||
            !spotifyTrack.track.name ||
            localTrack.Title.toLowerCase().substring(0, 5) !==
              spotifyTrack.track.name.toLowerCase().substring(0, 5)
          ) {
            return;
          }

          const [matchValue, percentage] = getMatchLocalSpotify(localTrack, spotifyTrack, 50);
          if (percentage < 30) {
            return; // Early exit if match is too low
          }
          temp_potentialMatches[spotifyTrack.track.id].push({
            localTrack,
            matchValue,
            percentage
          });

          // sort by percentage
          temp_potentialMatches[spotifyTrack.track.id].sort((a, b) => {
            return b.percentage - a.percentage;
          });
        });
      });
      setPotentialMatches(temp_potentialMatches);
      console.log('potentialMatches', temp_potentialMatches);
    };

    fetchTracks();
  }, [currentPlaylist]);

  const getTrack = (trackID) => {
    const spotifyTrack = spotifyTrackList.find((track) => track.track.id === trackID);
    return spotifyTrack.track;
  };

  return (
    <>
      {potentialMatches && currentPlaylist ? (
        <div className="p-4">
          {Object.keys(potentialMatches).map((trackID) => {
            return (
              <div key={trackID} className="">
                <div className="text-xl text-primary-600 ">
                  <CompareSourceTrack
                    track={getTrack(trackID)}
                    key={trackID}
                    isSource={true}></CompareSourceTrack>
                </div>
                <ul>
                  {potentialMatches[trackID].map((match) => {
                    return <CompareResultTrack match={match} key={trackID}></CompareResultTrack>;
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Select a playlist first!</p>
      )}
    </>
  );
};

export default ComparePage;
