import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, HeartBreak } from '@phosphor-icons/react';

const AnimatedHeart = () => {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [broken, setBroken] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    if (liked) {
      setBroken(false);
    }
  };

  const shakeAnimation = {
    shake: {
      x: [-5, 5, -5, 5, -5, 5, -5, 5, 0],
      transition: { duration: 0.3 }
    }
  };

  const getIcon = () => {
    if (broken) {
      return <HeartBreak size={32} weight="fill" className="text-primary-600" />;
    } else if (liked) {
      return <Heart size={32} weight="fill" className="text-primary-600" />;
    } else if (hovered) {
      return <Heart size={32} weight="duotone" className="text-white" />;
    } else {
      return <Heart size={32} weight="regular" className="text-white" />;
    }
  };

  return (
    <motion.div
      className="h-10 w-10 rounded-md text-primary-400 flex items-center justify-center cursor-pointer"
      onClick={toggleLike}
      onMouseEnter={() => {
        setHovered(true);
        if (liked) {
          setBroken(true);
        }
      }}
      onMouseLeave={() => setHovered(false)}
      animate={liked ? '' : 'shake'}
      variants={shakeAnimation}
      whileHover={{ scale: 1.2 }}
      transition={{ type: 'spring', stiffness: 300 }}>
      {getIcon()}
    </motion.div>
  );
};

export default AnimatedHeart;
