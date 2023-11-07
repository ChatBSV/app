// src/utils/resetChat.js

const resetChat = () => {
  localStorage.removeItem('chat');
  localStorage.removeItem('txid');
  localStorage.removeItem('tokens');
  window.location.reload();
};

export default resetChat;