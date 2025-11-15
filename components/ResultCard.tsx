
import React from 'react';

interface ResultCardProps {
  title: string;
  loading: boolean | string | null;
  error: boolean | string | null;
  content: string | null;
  contentType: 'text' | 'image' | 'video';
}

const LoadingSpinner: React.FC<{ message?: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-stone-500 py-8">
        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="mt-2 text-sm font-semibold" id={message ? 'video-loading-message' : undefined}>{message || 'Generating...'}</span>
    </div>
);

export const ResultCard: React.FC<ResultCardProps> = ({ title, loading, error, content, contentType }) => {
  if (!loading && !error && !content) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <h3 className="text-lg font-bold text-stone-700 p-4 bg-amber-100/50 border-b border-amber-200">{title}</h3>
      <div className="p-6">
        {loading && <LoadingSpinner message={contentType === 'video' ? 'Spinning up the video loom...' : undefined} />}
        {error && typeof error === 'string' && (
          <div className="text-red-600 bg-red-100 p-4 rounded-lg flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>{error}</p>
          </div>
        )}
        {content && !loading && (
          <div>
            {contentType === 'text' && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />}
            {contentType === 'image' && <img src={content} alt="Generated project visualization" className="rounded-lg shadow-md mx-auto" />}
            {contentType === 'video' && <video src={content} controls className="w-full rounded-lg shadow-md" />}
          </div>
        )}
      </div>
    </div>
  );
};
