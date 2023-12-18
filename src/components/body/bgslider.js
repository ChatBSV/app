// bgslider.js

import React, { useState, useEffect } from 'react';
import styles from './bgslider.module.css';

const imageUrls = [
  'https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/65803abc23a542d97205f75e_4png-65803aa9d25cf.webp',
  'https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/65803abc6df9d430700f73f6_2png-65803a9fd5988.webp',
  'https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/65803abc76cabbfba1c69ad5_1png-65803a9d80b67.webp',
  'https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/65803abc2736ba720e62ea72_3png-65803aa68a8fa.webp',

  // Add more image URLs here
];

const BgSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }, 30000); // Change slide every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.sliderimg}>
      {imageUrls.map((url, index) => (
        <div
          key={url}
          className={`${styles.slideimg} ${
            index === currentImageIndex ? styles.activeimg : ''
          }`}
          style={{ backgroundImage: `url(${url})` }}
        />
      ))}
    </div>
  );
};

export default BgSlider;
