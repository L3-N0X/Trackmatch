import React, { useState, useEffect } from 'react';
import { useMusic } from '../components/context/mainContext.jsx';
import { getAllLocalTracks } from '../localMusic.js';
import { getMatchLocalSpotify } from '../utils.js';
import CompareSourceTrack from '../components/CompareSourceTrack.jsx';
import CompareResultTrack from '../components/CompareResultTrack.jsx';

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
          // frühzeitiger Abbruch, wenn die titel der tracks nicht gleich starten
          if (
            localTrack.Title.toLowerCase().substring(0, 5) !==
            spotifyTrack.track.name.toLowerCase().substring(0, 5)
          ) {
            return;
          }

          const [matchValue, percentage] = getMatchLocalSpotify(localTrack, spotifyTrack, 50);
          if (percentage < 30) {
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

  const getTrack = (trackID) => {
    const spotifyTrack = currentPlaylist.tracks.items.find((track) => track.track.id === trackID);
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
