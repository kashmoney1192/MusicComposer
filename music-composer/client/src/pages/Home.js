import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Play, Download, Users, Sparkles } from 'lucide-react';

/**
 * Home Page - Landing page with features and call-to-action
 */
const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="mb-8 flex justify-center">
            <Music size={80} className="animate-bounce" />
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
            Music Composer
          </h1>
          <p className="text-2xl md:text-3xl mb-12 text-blue-100">
            Create beautiful sheet music with an intuitive click-to-compose interface
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/compose"
              className="px-10 py-5 bg-white text-purple-600 rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200"
            >
              <Play className="inline-block mr-2" size={28} />
              Start Composing
            </Link>
            <Link
              to="/browse"
              className="px-10 py-5 bg-purple-500 bg-opacity-30 border-2 border-white text-white rounded-xl font-bold text-xl hover:bg-opacity-40 transform hover:scale-105 transition-all duration-200"
            >
              <Music className="inline-block mr-2" size={28} />
              Browse Compositions
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-5xl font-bold text-center mb-4 text-gray-800">
            Powerful Features
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16">
            Everything you need to compose and share your music
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Music className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Interactive Editor</h3>
              <p className="text-gray-600 text-lg">
                Click to place notes on a professional staff. Support for multiple time signatures, key signatures, and clefs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Play className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Live Playback</h3>
              <p className="text-gray-600 text-lg">
                Hear your composition instantly with high-quality MIDI playback using Tone.js synthesis.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Download className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Export Anywhere</h3>
              <p className="text-gray-600 text-lg">
                Export your compositions as PDF sheet music or MIDI files. Share with musicians worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Sparkles className="mx-auto mb-4 text-blue-600" size={48} />
              <div className="text-5xl font-bold text-gray-800 mb-2">Easy</div>
              <div className="text-xl text-gray-600">Intuitive Interface</div>
            </div>
            <div>
              <Users className="mx-auto mb-4 text-purple-600" size={48} />
              <div className="text-5xl font-bold text-gray-800 mb-2">Free</div>
              <div className="text-xl text-gray-600">Always Free to Use</div>
            </div>
            <div>
              <Music className="mx-auto mb-4 text-pink-600" size={48} />
              <div className="text-5xl font-bold text-gray-800 mb-2">Professional</div>
              <div className="text-xl text-gray-600">Quality Output</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Create?</h2>
          <p className="text-2xl mb-10 text-blue-100">
            Start composing your masterpiece today
          </p>
          <Link
            to="/compose"
            className="inline-block px-12 py-6 bg-white text-purple-600 rounded-xl font-bold text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200"
          >
            <Play className="inline-block mr-2" size={32} />
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
