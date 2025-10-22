import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Play, Download, Users, Sparkles, Zap, Clock, Globe, ArrowRight, Check } from 'lucide-react';
import { useDevice } from '../contexts/DeviceContext';

/**
 * Home Page - Professional landing page with features and call-to-action
 */
const Home = () => {
  const { isMobile } = useDevice();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white py-24 md:py-32 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
          <div className={`mb-8 flex justify-center ${isMobile ? 'mb-6' : ''}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-75"></div>
              <Music size={isMobile ? 60 : 80} className="relative animate-pulse text-white" />
            </div>
          </div>
          <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-7xl'} font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400`}>
            Professional Music Composition
          </h1>
          <p className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} mb-12 text-blue-200 max-w-3xl mx-auto leading-relaxed`}>
            A powerful, free platform for composers, musicians, and music educators. Create, share, and collaborate on sheet music with professional-grade tools.
          </p>
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-4 justify-center`}>
            <Link
              to="/compose"
              className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Play size={24} />
              Start Composing
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/sight-reading"
              className="px-10 py-4 bg-white bg-opacity-10 border-2 border-blue-300 text-white rounded-xl font-bold text-lg hover:bg-opacity-20 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur"
            >
              <Sparkles size={24} />
              Practice Sight Reading
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Powerful Features for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional-grade composition tools designed for musicians at any skill level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Music className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Interactive Editor</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Click to place notes on a professional staff with full support for time signatures, key signatures, and multiple clefs.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><Check size={16} className="text-blue-500 mr-2" /> VexFlow notation</li>
                <li className="flex items-center"><Check size={16} className="text-blue-500 mr-2" /> Keyboard shortcuts</li>
                <li className="flex items-center"><Check size={16} className="text-blue-500 mr-2" /> Undo/Redo support</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-green-200 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Play className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Real-time Playback</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Hear your compositions instantly with high-quality synthesis and full playback control.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><Check size={16} className="text-green-500 mr-2" /> Tone.js synthesis</li>
                <li className="flex items-center"><Check size={16} className="text-green-500 mr-2" /> MIDI support</li>
                <li className="flex items-center"><Check size={16} className="text-green-500 mr-2" /> Tempo control</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Download className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Multiple Exports</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Export your work in multiple formats including PDF, MIDI, and MusicXML.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><Check size={16} className="text-purple-500 mr-2" /> PDF sheet music</li>
                <li className="flex items-center"><Check size={16} className="text-purple-500 mr-2" /> MIDI files</li>
                <li className="flex items-center"><Check size={16} className="text-purple-500 mr-2" /> MusicXML format</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Zap className="mx-auto mb-4 text-blue-600" size={40} />
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Lightning</div>
              <div className="text-lg text-gray-600">Fast & Responsive</div>
              <p className="text-sm text-gray-500 mt-3">Compose at the speed of thought</p>
            </div>

            {/* Stat 2 */}
            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Globe className="mx-auto mb-4 text-green-600" size={40} />
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Free</div>
              <div className="text-lg text-gray-600">Forever Free</div>
              <p className="text-sm text-gray-500 mt-3">No subscriptions or hidden fees</p>
            </div>

            {/* Stat 3 */}
            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Clock className="mx-auto mb-4 text-purple-600" size={40} />
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-lg text-gray-600">Always Available</div>
              <p className="text-sm text-gray-500 mt-3">Create whenever inspiration strikes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Compose?
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-blue-200 leading-relaxed">
            Join musicians, composers, and educators creating beautiful sheet music with Music Composer
          </p>
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-4 justify-center`}>
            <Link
              to="/compose"
              className="px-12 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Play size={24} />
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/sight-reading"
              className="px-12 py-5 bg-white bg-opacity-10 border-2 border-blue-300 text-white rounded-xl font-bold text-lg hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur"
            >
              <Sparkles size={24} />
              Try Sight Reading
            </Link>
          </div>
          <p className="text-sm text-blue-200 mt-8">
            No credit card required • No installation needed • Works on all devices
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
