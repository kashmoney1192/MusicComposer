import React from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Profile Settings</h1>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <User className="text-blue-600" size={32} />
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="text-lg font-semibold text-gray-800">{user?.name || 'N/A'}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="text-purple-600" size={32} />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="text-lg font-semibold text-gray-800">{user?.email || 'N/A'}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Calendar className="text-green-600" size={32} />
              <div>
                <div className="text-sm text-gray-600">Member Since</div>
                <div className="text-lg font-semibold text-gray-800">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
