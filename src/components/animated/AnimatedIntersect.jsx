import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Intersect } from '@phosphor-icons/react';

const AnimatedIntersect = () => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  const toggleActive = () => {
    setActive(!active);
  };

  const getIcon = () => {
    if (active) {
      return <Intersect size={32} weight="fill" className="text-primary-600" />;
    } else if (hovered) {
      return <Intersect size={32} weight="regular" className="text-white" />;
    } else {
      return <Intersect size={32} weight="regular" className="text-white" />;
    }
  };

  return (
    <motion.div
      className="h-10 w-10 rounded-md flex items-center justify-center cursor-pointer"
      onClick={toggleActive}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={active ? '' : 'shake'}
      whileHover={{ scale: 1.2 }}
      transition={{ type: 'spring', stiffness: 300 }}>
      {getIcon()}
    </motion.div>
  );
};

export default AnimatedIntersect;
