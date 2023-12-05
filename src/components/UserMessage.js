// src/components/UserMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function UserMessage({ user, content }) {
  return (
    <div className={`${styles.chatMessage} ${styles.userMessage}`}>
      {user && (
        <img 
          src={user.avatarUrl} 
          alt="User Avatar"
          className='message-avatar' // you need to define this class in your CSS
          style={{ borderRadius: '50%', marginRight: '8px', width: '22px', height: '22px' }} // or use CSS classes
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
    </div>
  );
}

export default UserMessage;
