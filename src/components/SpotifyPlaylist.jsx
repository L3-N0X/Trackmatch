import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner
} from '@nextui-org/react';
// import SpotifySong from './SpotifySong';
import PropTypes from 'prop-types';
import { useAsyncList } from '@react-stately/data';
import { spotifyApi } from '../spotify';

const columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'ARTIST', uid: 'artist' },
  { name: 'LENGTH', uid: 'length' }
];

const SpotifyPlaylist = ({ playlist }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  let tracklist = playlist.tracks.items;
  let list = useAsyncList({
    async load() {
      // get all tracks from playlist
      for (let i = 0; i < playlist.tracks.total; i += 100) {
        await spotifyApi.getPlaylistTracks(playlist.id, { offset: i }).then((data) => {
          tracklist = tracklist.concat(data.body.items);
        });
      }

      setIsLoading(false);

      return {
        items: tracklist
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first, second;

          switch (sortDescriptor.column) {
            case 'name':
              first = a.track.name.toLowerCase();
              second = b.track.name.toLowerCase();
              break;
            case 'artist':
              first = a.track.artists[0].name.toLowerCase();
              second = b.track.artists[0].name.toLowerCase();
              break;
            case 'length':
              first = a.track.duration_ms;
              second = b.track.duration_ms;
              break;
            default:
              break;
          }

          let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === 'descending') {
            cmp *= -1;
          }

          return cmp;
        })
      };
    }
  });
  const renderCell = React.useCallback((track, columnKey) => {
    switch (columnKey) {
      case 'name':
        return (
          <div key={track.id} style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="rounded-md mr-3 h-8 w-8 object-cover aspect-square"
            />
            <h4>{track.name}</h4>
          </div>
        );
      case 'artist':
        return (
          <div key={track.id} className="flex flex-col">
            <p className="text-bold text-sm ">{track.artists[0].name}</p>
          </div>
        );
      case 'length':
        return (
          <p
            key={
              track.id
            }>{`${Math.floor(track.duration_ms / 60000)}:${((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}`}</p>
        );

      default:
        return <div key={track.id}>{track.name}</div>;
    }
  }, []);
  console.log(list);
  console.log(list.sortDescriptor);
  return (
    <Table
      aria-label="Example table with custom cells"
      selectionMode="single"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      classNames={{
        header: 'bg-primary-600 text-primary-50',
        th: 'text-primary-800',
        wrapper: 'bg-transparent'
      }}>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align="start" allowsSorting>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={list.items}
        isLoading={isLoading}
        loadingContent={<Spinner label="Loading..." />}>
        {(item) => (
          <TableRow key={item.track.name}>
            {(columnKey) => (
              <TableCell key={`${item.track.id}-${columnKey}`}>
                {renderCell(item.track, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

SpotifyPlaylist.propTypes = {
  playlist: PropTypes.object.isRequired
};

export default SpotifyPlaylist;
