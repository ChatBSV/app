// handleHelpRequest.js

import { nanoid } from 'nanoid';
import helpContent from '../../content/help.html';

export const handleHelpRequest = (addMessageToChat) => {
    return () => {
        addMessageToChat({
            id: nanoid(),
            role: 'help',
            content: helpContent.message,
            txid: ''
        }, false);
    };
};

export default handleHelpRequest;
