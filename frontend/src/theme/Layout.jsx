import React from 'react';
import Layout from '@theme-original/Layout';
import FloatingChatWidget from '../components/FloatingChatWidget';

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props}>
        {props.children}
        <FloatingChatWidget />
      </Layout>
    </>
  );
}