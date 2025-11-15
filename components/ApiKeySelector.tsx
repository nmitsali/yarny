
import React from 'react';

interface ApiKeySelectorProps {
  onClose: () => void;
  onSelectKey: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onClose, onSelectKey }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">API Key Required for Video</h2>
        <p className="text-stone-600 mb-6">
          To generate a video with Veo, you need to select your own API key. This feature is part of a paid service.
        </p>
        <p className="text-sm text-stone-500 mb-6">
          For more information, please see the{' '}
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-semibold">
            billing documentation
          </a>.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSelectKey}
            className="px-6 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-semibold transition-colors shadow-md"
          >
            Select API Key
          </button>
        </div>
      </div>
    </div>
  );
};
