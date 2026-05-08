import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'tween',
        ease: 'easeOut',
        duration: 0.25
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
