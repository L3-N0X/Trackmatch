import React, { useState } from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import SortCapsule from '../components/SortCapsule.jsx';
import SpotifyPlaylistsList from '../components/SpotifyPlaylistsList.jsx';

import PropTypes from 'prop-types';

const ContentSection = ({ activeSection, sortByKey }) => {
  switch (activeSection) {
    case 'playlists':
      return <SpotifyPlaylistsList sortByKey={sortByKey} />;
    case 'albums':
      return <p>albums</p>;
    case 'artists':
      return <p>artists</p>;
    case 'search':
      return <p>search</p>;
    default:
      return null;
  }
};

ContentSection.propTypes = {
  activeSection: PropTypes.string.isRequired,
  sortByKey: PropTypes.string.isRequired
};

const SpotifyPage = () => {
  const [activeSection, setActiveSection] = useState('playlists');
  const [sortByKey, setSortByKey] = useState('none');

  return (
    <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto flex-grow">
      <div className="flex justify-between">
        <div className="flex flex-wrap gap-4 sticky">
          <Tabs radius="full" aria-label="Tabs radius" onSelectionChange={setActiveSection}>
            <Tab key="playlists" title="Playlists"></Tab>
            <Tab key="albums" title="Albums"></Tab>
          </Tabs>
        </div>

        <SortCapsule
          onItemSelected={(key) => {
            setSortByKey(key);
          }}
          options={[
            { key: 'name', label: 'Name' },
            { key: 'owner', label: 'Owner' },
            { key: 'length', label: 'Length' }
          ]}
        />
      </div>
      <ContentSection activeSection={activeSection} sortByKey={sortByKey} />
    </div>
  );
};

export default SpotifyPage;
