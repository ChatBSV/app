// src/components/slider.js

import React, { useState } from 'react';
import styles from './slider.module.css';

const slider = ({ memes, txid, tokens }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % memes.length);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + memes.length) % memes.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className={styles.slider}>
      <div className={styles.sliderImages}>
        {memes.map((meme, index) => (
          <img
            key={index}
            src={meme}
            alt={`Meme ${index + 1}`}
            className={`${styles.slide} ${index === currentSlide ? styles.activeSlide : ''}`}
          />
        ))}
      </div>
      <div className={styles.sliderFooter}>
        <button className={styles.arrowButton} onClick={previousSlide}>&lt;</button>
        <div className={styles.slideIndicators}>
          {memes.map((_, index) => (
            <div
              key={index}
              className={`${styles.slideIndicator} ${index === currentSlide ? styles.activeIndicator : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
        <button className={styles.arrowButton} onClick={nextSlide}>&gt;</button>
      </div>
      <div className={styles.widget}>
        <a href={`https://whatsonchain.com/tx/${txid}`} target="_blank" rel="noopener noreferrer">
          TxID:{txid.slice(0, 5)}
        </a>
        <span>Tokens:{tokens || 0}</span>
      </div>
    </div>
  );
};

export default slider;

