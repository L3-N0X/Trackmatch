import React, { useEffect, useState } from 'react';
import { Image, User } from '@nextui-org/react';
import PropTypes from 'prop-types';
import { spotifyApi } from '../spotify';
import { convLargeToString, secondsToReadableTime, stripHtmlTags } from '../utils';

import he from 'he';
import {
  ClockClockwise,
  Playlist,
  FolderSimplePlus,
  MusicNotesPlus,
  ListHeart
} from '@phosphor-icons/react';

const PlaylistHeader = ({ playlist }) => {
  const { description, images, name, owner, tracks, followers } = playlist;

  // fetch owner user profile for picture
  const [ownerProfile, setOwnerProfile] = useState(null);
  useEffect(() => {
    spotifyApi.getUser(owner.id).then((data) => {
      setOwnerProfile(data.body);
      console.log(data.body);
    });
  }, [owner.id]);

  return (
    <div className="flex px-4 mt-4">
      <div className="grid grid-cols-[auto, 3fr] grid-flow-col gap-4">
        <Image
          src={images[0].url}
          alt="Playlist cover"
          width={288}
          height={288}
          className="rounded-lg w-72 h-72 object-cover aspect-square"
        />
        <div className="flex flex-col items-start justify-end gap-4">
          <h1 className="text-6xl font-semibold mt-4">{name}</h1>
          <p
            className="text-lg overflow-auto scrollbar-hide"
            style={{ maxHeight: 'calc(288px - 4rem - 40px - 48px)' }}>
            {stripHtmlTags(he.decode(description))}
          </p>

          <User
            name={owner.display_name}
            description={convLargeToString(ownerProfile?.followers.total) + ' followers'}
            id={owner.id}
            avatarProps={{ src: ownerProfile?.images[0].url }}
            className="mb-2"
          />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Playlist size={22} />
              <p className="text-sm">{convLargeToString(tracks.total)} Tracks</p>
            </div>
            <div className="h-4 border-r border-primary-400" />
            <div className="flex items-center gap-2">
              <ClockClockwise size={22} />
              <p className="text-sm">
                {secondsToReadableTime(
                  tracks.items.reduce((acc, item) => acc + item.track.duration_ms, 0) / 1000
                )}
              </p>
            </div>
            <div className="h-4 border-r border-primary-400" />
            <div className="flex items-center gap-2">
              <FolderSimplePlus size={22} />
              <p className="text-sm">
                Created {new Date(tracks.items[0].added_at).toLocaleDateString()}
              </p>
            </div>

            {tracks.items[0].added_at !== tracks.items[tracks.items.length - 1].added_at ? (
              <>
                <div className="h-4 border-r border-primary-400" />
                <div className="flex items-center gap-2">
                  <MusicNotesPlus size={22} />
                  <p className="text-sm">
                    Modified{' '}
                    {new Date(tracks.items[tracks.items.length - 1].added_at).toLocaleDateString()}
                  </p>
                </div>
              </>
            ) : null}
            <div className="h-4 border-r border-primary-400" />
            <div className="flex items-center gap-2">
              <ListHeart size={22} />
              <p className="text-sm">{convLargeToString(followers.total)} Likes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PlaylistHeader.propTypes = {
  playlist: PropTypes.object.isRequired
};

export default PlaylistHeader;
