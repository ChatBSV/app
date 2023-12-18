// src/utils/markdownParser.js
import styles from '../components/body/ChatMessage.module.css';
import Prism from 'prismjs';

// Core languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';

// Additional common languages - commented out
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-lua';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-elixir';
import 'prismjs/components/prism-erlang';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-docker';

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
      const codeHeader = document.createElement('div');
      codeHeader.className = styles['codeHeader'];

      const languageHeader = document.createElement('div');
      languageHeader.className = styles['codeLanguageHeader'];
      languageHeader.textContent = language || 'code'; // Default to 'code' if no language class
      codeHeader.appendChild(languageHeader);

      const copyButton = document.createElement('button');
      copyButton.className = styles['copyCodeButton'];
      copyButton.innerText = 'Copy';
      codeHeader.appendChild(copyButton);

      codeElement.parentNode.insertBefore(codeHeader, codeElement);
      codeElement.parentNode.setAttribute('data-processed', 'true');

      copyButton.addEventListener('click', () => handleCopyCode(codeElement, copyButton));

      // Now highlight the code block using Prism
      Prism.highlightElement(codeElement);
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
      codeElement.setAttribute('data-processed', 'true');
    }
  });
}
