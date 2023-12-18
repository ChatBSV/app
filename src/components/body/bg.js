// bg.js
import React, { useMemo } from 'react';
import styles from './bg.module.css';

const generateRandomStyle = () => ({
  width: `${150 + Math.random() * 150}px`,
  height: `${150 + Math.random() * 150}px`,
  opacity: 0.5, // Static opacity
  top: `${Math.random() * 100}%`, // Random position
  left: `${Math.random() * 100}%`, // Random position
});

const Background = () => {
  const lights = useMemo(() => Array.from({ length: 3 }).map((_, index) => (
    <div key={index} className={styles.light} style={generateRandomStyle()}></div>
  )), []);

  return <div className={styles.background}>{lights}</div>;
};

export default Background;
