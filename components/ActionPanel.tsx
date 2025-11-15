
import React from 'react';

interface ActionPanelProps {
  onGetIdeas: () => void;
  onGetPattern: () => void;
  onVisualize: () => void;
  onCreateVideo: () => void;
  isAnalysisDone: boolean;
  setVideoAspectRatio: (ratio: '16:9' | '9:16') => void;
  videoAspectRatio: '16:9' | '9:16';
}

const ActionButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string }> = ({ onClick, disabled, children, className }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full text-left p-4 rounded-lg font-semibold transition-all shadow-sm flex items-center gap-3 ${
            disabled 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white hover:bg-teal-50 hover:shadow-md text-teal-700'
        } ${className}`}
    >
        {children}
    </button>
);


export const ActionPanel: React.FC<ActionPanelProps> = ({
  onGetIdeas,
  onGetPattern,
  onVisualize,
  onCreateVideo,
  isAnalysisDone,
  setVideoAspectRatio,
  videoAspectRatio
}) => (
    <div className="mt-8 p-6 bg-teal-600/10 rounded-xl">
        <h2 className="text-xl font-bold text-teal-800 mb-4">What should we create?</h2>
        <div className="grid md:grid-cols-2 gap-4">
            <ActionButton onClick={onGetIdeas}>
                <span className="text-2xl">💡</span>
                Get Project Ideas
            </ActionButton>
            
            <ActionButton onClick={onVisualize} disabled={!isAnalysisDone}>
                <span className="text-2xl">🖼️</span>
                Visualize Project
            </ActionButton>
            
            <ActionButton onClick={onGetPattern} disabled={!isAnalysisDone}>
                <span className="text-2xl">📜</span>
                 Generate Detailed Pattern
            </ActionButton>

            <div className="bg-white rounded-lg shadow-sm">
                <ActionButton onClick={onCreateVideo} className="rounded-b-none">
                    <span className="text-2xl">🎬</span>
                    Create a Yarn Story
                </ActionButton>
                <div className="p-2 flex justify-center items-center gap-2 text-sm text-stone-600">
                    <label>Aspect Ratio:</label>
                    <select 
                      value={videoAspectRatio} 
                      onChange={(e) => setVideoAspectRatio(e.target.value as '16:9' | '9:16')}
                      className="bg-gray-100 border-gray-300 rounded-md p-1"
                    >
                      <option value="16:9">16:9 (Landscape)</option>
                      <option value="9:16">9:16 (Portrait)</option>
                    </select>
                </div>
            </div>
        </div>
        {!isAnalysisDone && <p className="text-sm text-center mt-4 text-teal-700">First, get project ideas to unlock more actions!</p>}
    </div>
);
