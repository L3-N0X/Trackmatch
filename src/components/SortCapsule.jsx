import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import PropTypes from 'prop-types';
import { FunnelSimple } from '@phosphor-icons/react';

const SortCapsule = ({ onItemSelected, options }) => {
  const handleClick = (key) => {
    onItemSelected(key);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="solid" radius="full" className="bg-default-100">
          <FunnelSimple size={20} />
          Sort by
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        {options.map((option) => (
          <DropdownItem key={option.key} onClick={() => handleClick(option.key)}>
            {option.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

SortCapsule.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired
};

export default SortCapsule;
