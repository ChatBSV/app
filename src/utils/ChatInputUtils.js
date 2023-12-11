// utils/ChatInputUtils.js

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

export const handleKeyDown = (event, submitInput) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submitInput();
  }
};


export const getButtonText = (paymentResult, isConnected) => {
  if (paymentResult?.status === 'pending') return 'Sending...';
  return isConnected ? 'Send' : 'Connect';
};

