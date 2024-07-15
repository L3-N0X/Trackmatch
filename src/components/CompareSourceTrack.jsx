import React from 'react';
import PropTypes from 'prop-types';
import { Image } from '@nextui-org/react';
import { msToReadableTime } from '../utils';
import { spotifyApi } from '../spotify';

const CompareSourceTrack = ({ track }) => {
  // Fallback values are used if track or any nested property is undefined

  const {
    name = 'Track Name',
    artists = [
      {
        name: 'Artist Name'
      }
    ],
    album = {
      name: 'Album Name',
      release_date: '2020',
      images: [
        {
          url: ''
        }
      ]
    },
    duration_ms = 0
  } = track || {};

  const playTrack = () => {
    console.log(track.name);
    spotifyApi.getMyDevices().then((data) => {
      console.log(data);
      const activeDevice = data.body.devices.find((device) => device.is_active);
      if (activeDevice) {
        playOnDevice(activeDevice.id);
      } else {
        playOnDevice(data.body.devices[0].id);
      }
    });
  };

  const playOnDevice = (deviceId) => {
    spotifyApi
      .play({
        uris: [`spotify:track:${track.id}`],
        device_id: deviceId,
        context_uri: null
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const copyTrack = () => {
    navigator.clipboard.writeText(
      `${track.name} ${track.artists.map((artist) => artist.name).join(', ')}`
    );
    console.log('Copied!');
  };

  return (
    <div
      className="grid grid-cols-[3.5rem,3fr,2fr,100px] gap-4 items-center p-2"
      onDoubleClick={() => {
        playTrack();
      }}
      role="button"
      tabIndex={0}
      onClick={() => {
        // on ctrl/cmd + click, copy track info
        if (window.navigator.platform.includes('Mac') ? event.metaKey : event.ctrlKey) copyTrack();
      }}>
      <div className="aspect-square rounded-sm overflow-hidden w-14">
        <Image src={album.images[0]?.url} alt="Track Image" width={100} height={100} />
      </div>
      <div className="text-lg font-semibold">{name}</div>
      <div className="text-sm">{artists.map((artist) => artist.name).join(', ')}</div>
      <div className="text-sm text-right">{msToReadableTime(duration_ms)}</div>
    </div>
  );
};

CompareSourceTrack.propTypes = {
  track: PropTypes.shape({
    name: PropTypes.string.isRequired,
    artists: PropTypes.arrayOf(PropTypes.object),
    album: PropTypes.shape({
      name: PropTypes.string,
      release_date: PropTypes.string,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string
        })
      )
    }),
    duration_ms: PropTypes.number,
    id: PropTypes.string,
    popularity: PropTypes.number
  })
};

export default CompareSourceTrack;
