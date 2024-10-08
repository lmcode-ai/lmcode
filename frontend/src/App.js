import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import HomePage from './HomePage';
import ResultPage from './ResultPage';
import SearchPage from './SearchPage';
import AboutUsPage from './AboutUsPage';
import DisclaimerPopup from './DisclaimerPopup';
import Navbar from './NavBar';

function App() {
  return (
    // <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <>
      <DisclaimerPopup />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/result/:questionId" element={<div>Question Detail Page</div>} /> {/* Placeholder for question detail */}
          <Route path="/about-us" element={<AboutUsPage />} />
        </Routes>
      </Router>
    </>
    // </GoogleOAuthProvider>
  );
}

export default App;
