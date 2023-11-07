// components/ButtonIcon.js

import React from 'react';
import styles from './ButtonIcon.module.css';

export default function ButtonIcon({ icon, text, onClick }) {
  return (
    <div 
      className={styles.bgDarkBackground}
      onClick={onClick}
    >
      <div className={styles.flexGap} >
        <img src={icon} className={styles.inlineBlock} />
        <div className={styles.flexCol}>
          <span className={styles.fontBold}>{text}</span>
        </div>
      </div>
    </div>
  );
}
