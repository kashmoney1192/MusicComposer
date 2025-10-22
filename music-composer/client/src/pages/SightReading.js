import React from 'react';
import SightReadingGenerator from '../components/sightreading/SightReadingGenerator';

/**
 * SightReading Page
 * Main page for the sight-reading practice feature
 * Uses the SightReadingGenerator component to provide interactive music generation
 */
const SightReading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <SightReadingGenerator />
    </div>
  );
};

export default SightReading;
