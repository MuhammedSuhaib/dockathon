import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
// Note: We use require here to avoid build-time import issues if the file uses browser APIs
const FloatingChatWidget = require('@site/src/components/FloatingChatWidget').default;

export default function Root({children}) {
  return (
    <>
      {children}
      <BrowserOnly>
        {() => <FloatingChatWidget />}
      </BrowserOnly>
    </>
  );
}