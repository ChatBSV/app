// src/components/MessageWidget.js

import React from 'react';
import styles from './ChatMessage.module.css';
import TxidLink from './txidlink';
import CopyButton from './CopyButton';
import ShareButton from './ShareButton';
import TokenDisplay from './TokenDisplay';

function MessageWidget({ txid, tokens, content, handleCopy, copyButtonText }) {
    return (
        <div className={styles.chatLink}>
            <TxidLink txid={txid} />
            <TokenDisplay tokens={tokens} />
            <CopyButton handleCopy={handleCopy} copyButtonText={copyButtonText} />
            <ShareButton content={content} />
        </div>
    );
}

export default MessageWidget;
