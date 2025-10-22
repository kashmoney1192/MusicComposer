import React from 'react';
import { Music, Github, Mail } from 'lucide-react';

/**
 * Footer Component - Site footer with links and info
 */
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <Music className="mr-2" size={28} />
              <span className="text-2xl font-bold">Music Composer</span>
            </div>
            <p className="text-gray-400">
              Create, compose, and share beautiful sheet music online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/compose" className="hover:text-white transition-colors">Compose</a></li>
              <li><a href="/browse" className="hover:text-white transition-colors">Browse</a></li>
              <li><a href="/sight-reading" className="hover:text-white transition-colors">Sight Reading</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <button
                onClick={() => window.open('https://github.com', '_blank')}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github size={24} />
              </button>
              <button
                onClick={() => window.location.href = 'mailto:contact@musiccomposer.com'}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Email"
              >
                <Mail size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Music Composer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
