import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle } from '@phosphor-icons/react';

const AnimatedShuffle = () => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  const toggleActive = () => {
    setActive(!active);
  };

  const shuffleAnimation = {
    shake: {
      x: [-5, 5, -5, 5, -5, 5, -5, 5, 0],
      transition: { duration: 0.3 }
    }
  };

  const getIcon = () => {
    if (active) {
      return <Shuffle size={32} weight="fill" className="text-primary-600" />;
    } else if (hovered) {
      return <Shuffle size={32} weight="duotone" className="text-white" />;
    } else {
      return <Shuffle size={32} weight="regular" className="text-white" />;
    }
  };

  return (
    <motion.div
      className="h-10 w-10 rounded-md flex items-center justify-center cursor-pointer"
      onClick={toggleActive}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={active ? '' : 'shake'}
      variants={shuffleAnimation}
      whileHover={{ scale: 1.2 }}
      transition={{ type: 'spring', stiffness: 300 }}>
      {getIcon()}
    </motion.div>
  );
};

export default AnimatedShuffle;
