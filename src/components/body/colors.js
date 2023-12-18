// Colors.js
import React, { useState, useEffect } from 'react';
import styles from './colors.module.css';

const gradients = [
  'linear-gradient(to top right, #00008B, #8A2BE2), radial-gradient(circle, #FFFF00, transparent)',
  'linear-gradient(to top right, #8A2BE2, #FF00FF), radial-gradient(circle, #008000, transparent)',
  'linear-gradient(to top right, #00FFFF, #0000FF), radial-gradient(circle, #FF0000, transparent)',
  'linear-gradient(to top right, #006400, #00FFFF), radial-gradient(circle, #FF00FF, transparent)',
  'linear-gradient(to top right, #00008B, #87CEEB), radial-gradient(circle, #FFA500, transparent)',
  'linear-gradient(to top right, #FF00FF, #FF0000), radial-gradient(circle, #00FFFF, transparent)',
  'linear-gradient(to top right, #008000, #32CD32), radial-gradient(circle, #800080, transparent)'
];

const Colors = () => {
  const [currentGradientIndex, setCurrentGradientIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradientIndex(prevIndex =>
        prevIndex === gradients.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.slider}>
      {gradients.map((gradient, index) => (
        <div
          key={index}
          className={`${styles.slide} ${index === currentGradientIndex ? styles.active : ''}`}
          style={{ background: gradient }}
        />
      ))}
    </div>
  );
};

export default Colors;
