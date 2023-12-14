// src/utils/markdownParser.js

import styles from '../components/body/ChatMessage.module.css';

export function handleCopyCode(codeElement, copyButton) {
  navigator.clipboard.writeText(codeElement.textContent).then(() => {
    copyButton.innerText = 'Copied!';
    setTimeout(() => {
      copyButton.innerText = 'Copy';
    }, 2000);
  });
}

export function processCodeElements(htmlContent) {
  // Handle block code elements
  const blockCodeElements = htmlContent.querySelectorAll('pre > code');
  blockCodeElements.forEach((codeElement) => {
    if (!codeElement.parentNode.hasAttribute('data-processed')) {
      const language = codeElement.className.replace('language-', ''); 

      // Create a new div to hold the language header and the copy button
      const codeHeader = document.createElement('div');
      codeHeader.className = styles['codeHeader'];

      // Create and insert language display as a header
      const languageHeader = document.createElement('div');
      languageHeader.className = styles['codeLanguageHeader'];
      languageHeader.textContent = language;
      codeHeader.appendChild(languageHeader);

      // Add copy button
      const copyButton = document.createElement('button');
      copyButton.className = styles['copyCodeButton'];
      copyButton.innerText = 'Copy';
      codeHeader.appendChild(copyButton);

      // Insert the codeHeader before the codeElement
      codeElement.parentNode.insertBefore(codeHeader, codeElement);

      // Mark as processed
      codeElement.parentNode.setAttribute('data-processed', 'true');

      // Add event listener to the copy button
      copyButton.addEventListener('click', () => handleCopyCode(codeElement, copyButton));
    }
  });

  // Handle inline code elements
  const inlineCodeElements = htmlContent.querySelectorAll('code:not(pre > code)');
  inlineCodeElements.forEach((codeElement) => {
    if (!codeElement.hasAttribute('data-processed')) {
      codeElement.onclick = () => {
        navigator.clipboard.writeText(codeElement.textContent).then(() => {
          const originalText = codeElement.textContent;
          codeElement.textContent = 'Copied!';
          setTimeout(() => {
            codeElement.textContent = originalText;
          }, 2000);
        });
      };
      // Mark as processed
      codeElement.setAttribute('data-processed', 'true');
    }
  });
}
