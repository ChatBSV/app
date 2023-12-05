// src/utils/resetChat.js

const resetChat = (currentThreadId, callback, clearThreadMessages) => {
  if (currentThreadId) {
    localStorage.removeItem(`thread_${currentThreadId}`);
    clearThreadMessages(currentThreadId); // Ensure clearThreadMessages is correctly called

    if (typeof callback === 'function') {
      callback();
    }
  } else {
    console.warn("No current thread ID provided for resetChat");
    window.location.reload();
  }
};

export default resetChat;
