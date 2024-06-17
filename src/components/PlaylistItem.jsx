import React from 'react';
import PropTypes from 'prop-types';
import { SpotifyLogo, Playlist } from '@phosphor-icons/react';

import Atropos from 'atropos/react';

const PlaylistItem = ({ title, image, type, onClick }) => {
  return (
    <Atropos activeOffset={40} onClick={onClick}>
      <div className="relative w-full aspect-square rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex flex-col justify-between py-2 px-4 h-min top-auto">
          <div className="grid grid-cols-[1fr_24px] gap-2" data-atropos-offset="4">
            <h2 className="text-lg truncate text-white">{title}</h2>
            <div className="">
              {type === 'spotify' ? (
                <SpotifyLogo size={26} className="text-white" />
              ) : (
                <Playlist size={26} className="text-white" />
              )}
            </div>
          </div>
        </div>
        <div className="aspect-square">
          <img src={image} className="object-cover w-full h-full" alt={title} draggable="false" />
        </div>
      </div>
    </Atropos>
  );
};

PlaylistItem.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default PlaylistItem;
