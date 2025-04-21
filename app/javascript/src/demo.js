import React from 'react';
import ReactDOM from 'react-dom/client'; // ← note the '/client'
import Layout from './layout';

const Demo = () => (
  <Layout>
    <h1>Demo pljbjkbkhvkage</h1>
  </Layout>
);

document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.body.appendChild(document.createElement('div')));
  root.render(<Demo />);
});
