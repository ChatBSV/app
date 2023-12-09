// src/components/MetaHead.js

import Head from 'next/head';

const MetaHead = () => (
    <Head>
        <title>ChatBSV - OpenAI on Bitcoin</title>
        <meta name="description" content="Ask me anything! Micro transactions at their best. Pay per use AI tokens." />
        <meta name="theme-color" content="#eee" />
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:title" content="ChatBSV - AI on Bitcoin" />
        <meta property="og:description" content="Ask me anything! Micro transactions at their best. Pay per use AI tokens." />
        <meta property="og:image" content="/ChatBSV_openGraph.png" />
        <meta property="twitter:title" content="ChatBSV - AI on Bitcoin" />
        <meta property="twitter:description" content="Ask me anything! Micro transactions at their best. Pay per use AI tokens." />
        <meta property="twitter:image" content="/ChatBSV_openGraph.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="/ChatBSV_openGraph.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
    </Head>
);

export default MetaHead;
