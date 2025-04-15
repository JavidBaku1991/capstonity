// home.jsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import Layout from './layout';

const Home = () => (
  <Layout>
    <h1>Home page</h1>
  </Layout>
);

document.addEventListener('DOMContentLoaded', () => {
  // Using createRoot instead of render for React 18+
  const root = ReactDOM.createRoot(document.body.appendChild(document.createElement('div')));
  root.render(<Home />);
});
