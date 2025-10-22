import React from 'react';
import { Music } from 'lucide-react';

const CompositionDetail = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Music className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Composition Details</h2>
          <p className="text-gray-600">This feature is coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default CompositionDetail;
