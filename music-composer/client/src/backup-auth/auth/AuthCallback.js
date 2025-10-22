import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth callback here
    // For now, just redirect to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" color="blue" />
        <p className="mt-4 text-xl text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
