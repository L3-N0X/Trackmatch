import React from 'react';
import PropTypes from 'prop-types';
import { msToReadableTime } from '../utils';
import { playLocalTrack } from '../localMusic';

const CompareResultTrack = ({ match }) => {
  // Fallback values are used if track or any nested property is undefined

  const playTrack = () => {
    console.log(match.localTrack.Title);

    playLocalTrack(match.localTrack);
  };

  return (
    // border color depending on matchValue using hsl
    <div
      className="grid grid-cols-[3rem,3fr,2fr,100px] gap-4 items-center px-2 border-1 ml-2 rounded-md my-1"
      style={{ borderColor: `hsl(${match.percentage}, 90%, 60%)` }}
      onDoubleClick={() => {
        playTrack();
      }}>
      <div
        className="text-lg flex items-end gap-0.5"
        onClick={() => {
          console.log(match.localTrack);
        }}
        style={{
          color: `hsl(${match.percentage}, 90%, 60%)`
        }}>
        {match.percentage}
        <p className="text-xs pb-1">%</p>
      </div>
      <div className="text-lg font-semibold">{match.localTrack.Title}</div>
      <div className="text-sm">{match.localTrack.Artist}</div>
      <div className="text-sm text-right">
        {msToReadableTime(match.localTrack.TotalTime * 1000)}
      </div>
    </div>
  );
};

CompareResultTrack.propTypes = {
  match: PropTypes.shape({
    localTrack: PropTypes.shape({
      Title: PropTypes.string.isRequired,
      Artist: PropTypes.string,
      Album: PropTypes.string,
      Year: PropTypes.number,
      TotalTime: PropTypes.number,
      Location: PropTypes.string
    }),
    matchValue: PropTypes.number,
    percentage: PropTypes.number
  }).isRequired
};

export default CompareResultTrack;
