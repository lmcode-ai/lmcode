import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import HomePage from './HomePage';
import ResultPage from './ResultPage';
import SearchPage from './SearchPage';

const GOOGLE_CLIENT_ID = '1011505161223-ajksarufqtl9iile2d3i25sg6jckegkb.apps.googleusercontent.com'; // Replace with your actual Google Client ID

function App() {
  return (

    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/result/:questionId" element={<div>Question Detail Page</div>} /> {/* Placeholder for question detail */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
