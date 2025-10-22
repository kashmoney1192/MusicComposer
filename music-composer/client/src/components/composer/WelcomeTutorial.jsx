import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

/**
 * WelcomeTutorial Component
 * Interactive tutorial for first-time users
 * Shows on first visit, can be dismissed or completed
 */
const WelcomeTutorial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Music Composer! 🎵',
      content: "Let's take a quick tour to get you started composing beautiful music.",
      icon: '🎹'
    },
    {
      title: 'Piano Keyboard',
      content: 'Click the piano keys or use your computer keyboard (Z-M, Q-R) to add notes. White keys are labeled with their computer keys!',
      icon: '🎹'
    },
    {
      title: 'Quick Toolbar',
      content: 'The blue toolbar at the top lets you quickly change note duration (𝅝 𝅗𝅥 ♩ ♪) and accidentals (♯ ♭ ♮). Just click or use number keys 1-6!',
      icon: '🎼'
    },
    {
      title: 'Keyboard Shortcuts',
      content: 'Press the purple "Shortcuts" button in the header to see all available keyboard shortcuts. Master these to compose faster!',
      icon: '⌨️'
    },
    {
      title: 'Metronome & Tools',
      content: 'Use the right sidebar to access the metronome, chord library, measure navigator, and playback controls.',
      icon: '⏱️'
    },
    {
      title: 'Auto-Save',
      content: 'Your composition is automatically saved every 30 seconds and after each change. You can also click "Save Now" at the bottom.',
      icon: '💾'
    },
    {
      title: 'Ready to Compose!',
      content: "You're all set! Start creating music by pressing keyboard keys or clicking the piano. Have fun! 🎶",
      icon: '🎉'
    }
  ];

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 rounded-t-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="relative z-10">
            <div className="text-6xl mb-3 text-center">{step.icon}</div>
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              {step.title}
            </h2>
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-lg text-gray-700 text-center leading-relaxed mb-6">
            {step.content}
          </p>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-8 bg-purple-500'
                    : idx < currentStep
                    ? 'w-2 bg-purple-300'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <div className="text-sm text-gray-500 font-semibold">
              Step {currentStep + 1} of {steps.length}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              {currentStep === steps.length - 1 ? "Let's Go!" : 'Next'}
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Skip Button */}
          <div className="mt-4 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Skip tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTutorial;
