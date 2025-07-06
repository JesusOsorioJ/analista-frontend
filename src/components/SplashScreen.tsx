import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { TargetAndTransition } from 'framer-motion';

const containerVariants = {
  initial: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 1 } },
};

const logoVariants: Record<string, TargetAndTransition> = {
  initial: {
    scale: 1,
    x: '-50%',
    y: '-50%',
    top: '50%',
    left: '50%',
    position: 'absolute',
    opacity: 1,
  },
  shrink: {
    scale: 0.4,
    top: '13px',
    left: '5px',
    x: '0%',
    y: '0%',
    transition: { duration: 1.2, ease: [0.42, 0, 0.58, 1] },
  },
};

export const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const controls = useAnimation();
  const [isShrinking, setIsShrinking] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const run = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsShrinking(true);
      await controls.start('shrink');
      setTimeout(() => {
        setVisible(false);
        onFinish();
      }, 0);
    };
    run();
  }, [controls, onFinish]);

  if (!visible) return null;

  const letters = ['V', 'e', 'l', 'e', 'z', '.'];

  return (
    <motion.div
      className={`fixed inset-0 z-50 transition-colors duration-1000 
        ${isShrinking ? 'bg-transparent' : 'bg-gray-950'} 
        flex items-center justify-center 
      ${location.pathname.includes("/product") && "hidden"}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="text-white text-6xl font-serif italic flex space-x-1"
        variants={logoVariants}
        initial="initial"
        animate={controls}
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            className="animate-pulse"
            style={{ animationDelay: `${index * 150}ms`, animationDuration: '1.2s' }}
          >
            {letter}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
};
