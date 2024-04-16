import React from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import PropTypes from 'prop-types';

const PageTabs = () => {
  return (
    <div className="flex flex-wrap gap-4 bg-default-50 sticky">
      <Tabs radius="full" aria-label="Tabs radius">
        <Tab key="photos" title="Photos" />
        <Tab key="music" title="Music" />
        <Tab key="videos" title="Videos" />
      </Tabs>
    </div>
  );
};
// props validation

PageTabs.propTypes = {
  onItemSelected: PropTypes.func.isRequired
};
export default PageTabs;
