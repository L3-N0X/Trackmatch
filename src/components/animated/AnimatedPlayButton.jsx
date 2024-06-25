import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from '@phosphor-icons/react';

const AnimatedPlayPauseButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getIcon = () => {
    if (isPlaying) {
      return <Pause size={32} weight="regular" className="text-primary-600" />;
    } else if (hovered) {
      return <Play size={32} weight="duotone" className="text-white" />;
    } else {
      return <Play size={32} weight="regular" className="text-white" />;
    }
  };

  return (
    <motion.div
      className="h-10 w-10 rounded-md flex items-center justify-center cursor-pointer "
      onClick={togglePlayPause}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={''}
      whileHover={{ scale: 1.2 }}
      transition={{ type: 'spring', stiffness: 300 }}>
      {getIcon()}
    </motion.div>
  );
};

export default AnimatedPlayPauseButton;
