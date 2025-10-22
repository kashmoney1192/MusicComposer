import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Composer from './pages/Composer';
import ComposerPro from './pages/ComposerPro';
import Browse from './pages/Browse';
import CompositionDetail from './pages/CompositionDetail';
import SightReading from './pages/SightReading';

// Auth pages saved for later (commented out)
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import Dashboard from './pages/Dashboard';
// import Profile from './pages/Profile';
// import AuthCallback from './pages/auth/AuthCallback';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public routes - no auth required */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/compose" element={<ComposerPro />} />
          <Route path="/compose-classic" element={<Composer />} />
          <Route path="/compose/:id" element={<Composer />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/composition/:id" element={<CompositionDetail />} />
          <Route path="/sight-reading" element={<SightReading />} />

          {/* 404 route */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Page not found</p>
                <Link to="/home" className="btn-primary">Go Home</Link>
              </div>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;