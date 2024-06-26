import React, { useState, useEffect } from 'react';
import { useMusic } from '../components/context/mainContext.jsx';
import { getAllLocalTracks } from '../localMusic.js';
import { getMatchLocalSpotify } from '../utils.js';

const ComparePage = () => {
  const { currentPlaylist } = useMusic();
  const [potentialMatches, setPotentialMatches] = useState({});

  useEffect(() => {
    if (!currentPlaylist) {
      // Frühzeitiger Abbruch, wenn keine Playlist ausgewählt ist
      return;
    }

    getAllLocalTracks().then((localTrackList) => {
      console.log('local', localTrackList);
      console.log('current', currentPlaylist);

      const spotifyTrackList = currentPlaylist.tracks.items;
      let temp_potentialMatches = {};

      spotifyTrackList.forEach((spotifyTrack) => {
        temp_potentialMatches[spotifyTrack.track.id] = [];
        localTrackList.forEach((localTrack) => {
          if (!localTrack.Title.includes(spotifyTrack.track.name.split(' ')[0])) {
            return; // Frühzeitiger Abbruch, wenn die Titel offensichtlich nicht übereinstimmen
          }

          const [matchValue, percentage] = getMatchLocalSpotify(localTrack, spotifyTrack);
          if (matchValue > 90) {
            return; // Frühzeitiger Abbruch, wenn die Übereinstimmung gering ist
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
    });
  }, [currentPlaylist]);

  const getTrack = (spotifyTrackKey) => {
    const spotifyTrack = currentPlaylist.tracks.items.find(
      (track) => track.track.id === spotifyTrackKey
    );
    return spotifyTrack.track.name + ' - ' + spotifyTrack.track.artists[0].name;
  };

  return (
    <>
      {potentialMatches ? (
        <div>
          {Object.keys(potentialMatches).map((spotifyTrackKey) => {
            return (
              <div key={spotifyTrackKey}>
                <div className="text-xl text-primary-600">
                  <p>{getTrack(spotifyTrackKey)}</p>
                </div>
                <ul>
                  {potentialMatches[spotifyTrackKey].map((match) => {
                    return (
                      <li key={match.localTrack.Title} className="w-full grid grid-cols-3">
                        <p>{match.localTrack.Title + ' - ' + match.localTrack.Artist}</p>
                        <p>{match.matchValue}</p>
                        <p>{match.percentage}%</p>
                      </li>
                    );
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
