
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ActionPanel } from './components/ActionPanel';
import { ResultCard } from './components/ResultCard';
import { ApiKeySelector } from './components/ApiKeySelector';
import { LoadingState } from './types';
import { 
  analyzeYarnImage, 
  generateKnittingPattern, 
  generateProjectImage, 
  generateYarnVideo 
} from './services/geminiService';

const App: React.FC = () => {
  const [yarnImage, setYarnImage] = useState<string | null>(null);
  const [yarnAnalysis, setYarnAnalysis] = useState<string | null>(null);
  const [knittingPattern, setKnittingPattern] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  
  const [loading, setLoading] = useState<LoadingState>({
    analysis: false,
    pattern: false,
    image: false,
    video: false,
  });

  const [error, setError] = useState<LoadingState>({
    analysis: null,
    pattern: null,
    image: null,
    video: null,
  });

  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isApiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKeySelected, setApiKeySelected] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setYarnImage(reader.result as string);
      // Reset previous results
      setYarnAnalysis(null);
      setKnittingPattern(null);
      setGeneratedImage(null);
      setGeneratedVideo(null);
      setError({ analysis: null, pattern: null, image: null, video: null });
    };
    reader.readAsDataURL(file);
  };

  const getProjectIdeas = useCallback(async () => {
    if (!yarnImage) return;
    setLoading(prev => ({ ...prev, analysis: true }));
    setError(prev => ({ ...prev, analysis: null }));
    try {
      const result = await analyzeYarnImage(yarnImage.split(',')[1]);
      setYarnAnalysis(result);
    } catch (e) {
      setError(prev => ({ ...prev, analysis: 'Failed to get project ideas. Please try again.' }));
      console.error(e);
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  }, [yarnImage]);

  const getKnittingPattern = useCallback(async () => {
    if (!yarnAnalysis) return;
    setLoading(prev => ({ ...prev, pattern: true }));
    setError(prev => ({ ...prev, pattern: null }));
    try {
      const result = await generateKnittingPattern(yarnAnalysis);
      setKnittingPattern(result);
    } catch (e) {
      setError(prev => ({ ...prev, pattern: 'Failed to generate pattern. Please try again.' }));
      console.error(e);
    } finally {
      setLoading(prev => ({ ...prev, pattern: false }));
    }
  }, [yarnAnalysis]);

  const visualizeProject = useCallback(async () => {
    if (!yarnAnalysis) return;
    setLoading(prev => ({ ...prev, image: true }));
    setError(prev => ({ ...prev, image: null }));
    try {
      const result = await generateProjectImage(yarnAnalysis);
      setGeneratedImage(result);
    } catch (e) {
      setError(prev => ({ ...prev, image: 'Failed to visualize project. Please try again.' }));
      console.error(e);
    } finally {
      setLoading(prev => ({ ...prev, image: false }));
    }
  }, [yarnAnalysis]);

  const createVideoStory = useCallback(async () => {
    if (!yarnImage) return;

    if (!apiKeySelected) {
      setApiKeyModalOpen(true);
      return;
    }

    setLoading(prev => ({ ...prev, video: true }));
    setError(prev => ({ ...prev, video: null }));
    try {
      const result = await generateYarnVideo(yarnImage.split(',')[1], videoAspectRatio);
      setGeneratedVideo(result);
    } catch (e: any) {
      if (e.message.includes('Requested entity was not found')) {
        setError(prev => ({...prev, video: 'API Key is invalid. Please select a valid key.'}));
        setApiKeySelected(false);
        setApiKeyModalOpen(true);
      } else {
        setError(prev => ({ ...prev, video: 'Failed to create video story. Please try again.' }));
      }
      console.error(e);
    } finally {
      setLoading(prev => ({ ...prev, video: false }));
    }
  }, [yarnImage, videoAspectRatio, apiKeySelected]);


  const handleSelectApiKey = async () => {
    if(window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setApiKeySelected(true); // Optimistically set to true
      setApiKeyModalOpen(false);
      createVideoStory(); // Retry video generation
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-lg text-stone-600 mb-8">Hello there, fellow creator! Welcome to Yarn Genius. Show me your leftover yarn, and I'll help you spin it into something wonderful. Let's get knitting!</p>
          <ImageUploader onImageUpload={handleImageUpload} yarnImage={yarnImage} />

          {yarnImage && (
            <ActionPanel
              onGetIdeas={getProjectIdeas}
              onGetPattern={getKnittingPattern}
              onVisualize={visualizeProject}
              onCreateVideo={createVideoStory}
              isAnalysisDone={!!yarnAnalysis}
              setVideoAspectRatio={setVideoAspectRatio}
              videoAspectRatio={videoAspectRatio}
            />
          )}

          <div className="mt-8 grid gap-8">
            <ResultCard title="Project Ideas" loading={loading.analysis} error={error.analysis} content={yarnAnalysis} contentType="text" />
            <ResultCard title="Detailed Knitting Pattern (Thinking Mode)" loading={loading.pattern} error={error.pattern} content={knittingPattern} contentType="text" />
            <ResultCard title="Project Visualization" loading={loading.image} error={error.image} content={generatedImage} contentType="image" />
            <ResultCard title="Your Yarn Story" loading={loading.video} error={error.video} content={generatedVideo} contentType="video" />
          </div>
        </div>
      </main>
      {isApiKeyModalOpen && (
        <ApiKeySelector
          onClose={() => setApiKeyModalOpen(false)}
          onSelectKey={handleSelectApiKey}
        />
      )}
    </div>
  );
};

export default App;
