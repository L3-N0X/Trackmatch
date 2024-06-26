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
        temp_potentialMatches[spotifyTrack.track.id + ' - ' + spotifyTrack.track.name] = [];
        localTrackList.forEach((localTrack) => {
          if (!localTrack.Title.includes(spotifyTrack.track.name.split(' ')[0])) {
            return; // Frühzeitiger Abbruch, wenn die Titel offensichtlich nicht übereinstimmen
          }

          const [matchValue, percentage] = getMatchLocalSpotify(localTrack, spotifyTrack);
          if (matchValue > 90) {
            return; // Frühzeitiger Abbruch, wenn die Übereinstimmung gering ist
          }
          temp_potentialMatches[spotifyTrack.track.id + ' - ' + spotifyTrack.track.name].push({
            localTrack,
            matchValue,
            percentage
          });
        });
      });

      setPotentialMatches(temp_potentialMatches);
      console.log('potentialMatches', temp_potentialMatches);
    });
  }, [currentPlaylist]); // Abhängigkeit: currentPlaylist

  return (
    <>
      {potentialMatches ? (
        <div>
          {Object.keys(potentialMatches).map((spotifyTrackKey) => {
            return (
              <div key={spotifyTrackKey}>
                <h2 className="text-xl text-primary-600">{spotifyTrackKey}</h2>
                <ul>
                  {potentialMatches[spotifyTrackKey].map((match) => {
                    return (
                      <li key={match.localTrack.Title} className="w-full grid grid-cols-3">
                        <p>{match.localTrack.Title}</p>
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
