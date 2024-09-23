import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Signup from './components/Auth/Signup';
import Signin from './components/Auth/Signin';
import CreateLink from './components/Links/CreateLink';
import LinkList from './components/Links/LinkList';
import Navbar from './components/navbar';
import PublicFeed from './components/Links/Publicfeed';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/create-link" element={<CreateLink />} />
          <Route path="/links" element={<LinkList />} />
          <Route path="/" element={<PublicFeed />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;