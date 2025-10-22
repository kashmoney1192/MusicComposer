import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Music, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Ready to create some music?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
            <Music className="text-blue-600 mb-4" size={40} />
            <div className="text-3xl font-bold text-gray-800 mb-2">0</div>
            <div className="text-gray-600">Compositions</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
            <TrendingUp className="text-purple-600 mb-4" size={40} />
            <div className="text-3xl font-bold text-gray-800 mb-2">0</div>
            <div className="text-gray-600">Views</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-pink-100">
            <PlusCircle className="text-pink-600 mb-4" size={40} />
            <div className="text-3xl font-bold text-gray-800 mb-2">0</div>
            <div className="text-gray-600">Drafts</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/compose"
              className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              <PlusCircle className="mr-2" size={24} />
              New Composition
            </Link>
            <Link
              to="/browse"
              className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              <Music className="mr-2" size={24} />
              Browse Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
