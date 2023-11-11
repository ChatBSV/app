// src/utils/ChatInputUtils.js

export const handleTextareaChange = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
};
  
export const onDisconnect = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
    window.location.href = "/";
};
