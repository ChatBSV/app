// src/utils/resetChat.js

const resetChat = (callback) => {
  localStorage.removeItem('chat');
  localStorage.removeItem('txid');
  localStorage.removeItem('tokens');

  // Execute the callback function to update the state in React components
  if (typeof callback === 'function') {
    callback();
  } else {
    // Only reload the page if no callback is provided
    window.location.reload();
  }
};

export default resetChat;
