// src/hooks/HandleHelpRequest.js

import { nanoid } from 'nanoid';
import helpContent from '../../content/help.html';

export function handleHelpRequest(addMessageToChat) {
  return (helpCommand) => {
    addMessageToChat({
      id: nanoid(),
      role: 'help',
      content: helpContent,
      txid: ''
    }, false);
  };
}
