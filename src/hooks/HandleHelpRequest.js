// src/hooks/HandleHelpRequest.js

import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import helpContent from '../../content/help.html';

export const handleHelpRequest = (addMessageToChat) => useCallback((helpCommand) => {
  addMessageToChat({
    id: nanoid(),
    role: 'help',
    content: helpContent.message,
    txid: ''
  }, false);
}, [addMessageToChat]);

export default handleHelpRequest;
