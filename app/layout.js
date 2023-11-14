// app/layout.js

import React from 'react';
import './globals.css';

export const metadata = {
  title: 'ChatBSV',
  description: 'OpenAI on Bitcoin',
};

export default function RootLayout({ children }) {
  return (
    
      <html lang="en">
        <body>{children}</body>
      </html>
   
  );
}
