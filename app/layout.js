// app/layout.js

import React from 'react';
import './globals.css';
import { AuthProvider } from '../src/context/AuthContext'; // Correct the path if necessary

export const metadata = {
  title: 'ChatBSV',
  description: 'OpenAI on Bitcoin',
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
