import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle } from '@phosphor-icons/react';

const AnimatedShuffle = () => {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const shakeAnimation = {
    shake: {
      x: [-5, 5, -5, 5, -5, 5, -5, 5, 0],
      transition: { duration: 0.3 }
    }
  };

  const getIconColor = () => {
    if (liked) {
      return 'text-purple-500';
    } else if (hovered) {
      return 'text-white';
    } else {
      return 'text-gray-500';
    }
  };

  return (
    <motion.div
      className="h-16 w-16 rounded-md flex items-center justify-center cursor-pointer"
      onClick={toggleLike}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={liked ? '' : 'shake'}
      variants={shakeAnimation}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'tween', duration: 0.3 }}>
      <Shuffle size={32} weight="fill" className={getIconColor()} />
    </motion.div>
  );
};

export default AnimatedShuffle;
