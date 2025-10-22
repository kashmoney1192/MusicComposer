import React from 'react';
import { Music } from 'lucide-react';

const Browse = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Browse Compositions</h1>
          <p className="text-xl text-gray-600">Discover music from the community</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Music className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h2>
          <p className="text-gray-600">
            The browse feature is currently in development. Check back soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Browse;
