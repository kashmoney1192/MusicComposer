import React, { useEffect, useState, useCallback } from 'react';
import { useMusicContext } from '../../contexts/MusicContext';
import { Check, AlertCircle, Save } from 'lucide-react';

/**
 * AutoSave Component
 * Displays auto-save status from MusicContext (handles actual saving)
 * Shows manual save button and last saved timestamp
 *
 * Note: MusicContext handles all auto-save logic to avoid duplication
 */
const AutoSave = () => {
  const { notes, saveToLocalStorage } = useMusicContext();
  const [lastSaved, setLastSaved] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'success', 'error'
  const [showToast, setShowToast] = useState(false);

  // Manual save triggered by user
  const handleManualSave = useCallback(async () => {
    try {
      setSaveStatus('saving');
      await saveToLocalStorage();
      setLastSaved(new Date());
      setSaveStatus('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Failed to save composition:', error);
      setSaveStatus('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  }, [saveToLocalStorage]);

  // Load composition on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('music-composition');
      if (saved) {
        const composition = JSON.parse(saved);
        setLastSaved(new Date(composition.savedAt));
      }
    } catch (error) {
      console.error('Failed to load composition:', error);
    }
  }, []);

  const getRelativeTime = () => {
    if (!lastSaved) return 'Never';

    const seconds = Math.floor((new Date() - lastSaved) / 1000);

    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds} seconds ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <>
      {/* Auto-Save Status Bar */}
      <div className="auto-save-status bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {saveStatus === 'saving' && (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-gray-600">Saving...</span>
              </>
            )}
            {saveStatus === 'success' && (
              <>
                <Check size={16} className="text-green-500" />
                <span className="text-gray-600">
                  Last saved: <span className="font-semibold text-gray-800">{getRelativeTime()}</span>
                </span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle size={16} className="text-red-500" />
                <span className="text-red-600">Save failed</span>
              </>
            )}
            {saveStatus === 'idle' && notes.length === 0 && (
              <span className="text-gray-500">No composition yet</span>
            )}
          </div>

          <button
            onClick={handleManualSave}
            disabled={notes.length === 0}
            className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-semibold"
            title="Save now"
          >
            <Save size={14} />
            Save Now
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className={`px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 ${
            saveStatus === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {saveStatus === 'success' ? (
              <>
                <Check size={20} />
                <span className="font-semibold">Composition saved successfully!</span>
              </>
            ) : (
              <>
                <AlertCircle size={20} />
                <span className="font-semibold">Failed to save composition</span>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AutoSave;
