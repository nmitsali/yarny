import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ActionPanel } from './components/ActionPanel';
import { ResultCard } from './components/ResultCard';
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
  // FIX: Add state to track API key selection for Veo models.
  const [isApiKeySelected, setIsApiKeySelected] = useState<boolean>(false);
  
  // FIX: Check for selected API key on initial render.
  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsApiKeySelected(hasKey);
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

  // FIX: Removed ensureApiKey and apiKey logic as per guidelines.
  const getProjectIdeas = useCallback(async () => {
    if (!yarnImage) return;
    setLoading(prev => ({ ...prev, analysis: true }));
    setError(prev => ({ ...prev, analysis: null }));
    try {
      // FIX: Removed apiKey argument.
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
      // FIX: Removed apiKey argument.
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
      // FIX: Removed apiKey argument.
      const result = await generateProjectImage(yarnAnalysis);
      setGeneratedImage(result);
    } catch (e) {
      setError(prev => ({ ...prev, image: 'Failed to visualize project. Please try again.' }));
      console.error(e);
    } finally {
      setLoading(prev => ({ ...prev, image: false }));
    }
  }, [yarnAnalysis]);

  // FIX: Updated to handle Veo API key selection flow.
  const createVideoStory = useCallback(async () => {
    if (!yarnImage) return;

    if (window.aistudio && !isApiKeySelected) {
        try {
            await window.aistudio.openSelectKey();
            setIsApiKeySelected(true); // Assume success to avoid race conditions
        } catch (e) {
            console.error('Failed to open API key selector:', e);
            setError(prev => ({ ...prev, video: 'API Key selection is required to create a video. Please try again.' }));
            return;
        }
    }

    setLoading(prev => ({ ...prev, video: true }));
    setError(prev => ({ ...prev, video: null }));
    try {
      // FIX: Removed apiKey argument.
      const result = await generateYarnVideo(yarnImage.split(',')[1], videoAspectRatio);
      setGeneratedVideo(result);
    } catch (e: any) {
      // FIX: Handle specific API key error for Veo as per guidelines.
      if (e.message?.includes('Requested entity was not found')) {
        setError(prev => ({ ...prev, video: 'API Key error. Please try selecting your key again.' }));
        setIsApiKeySelected(false); // Reset key selection state
      } else {
        setError(prev => ({ ...prev, video: 'Failed to create video story. Please try again.' }));
      }
      console.error(e);
    } finally {
      setLoading(prev => ({ ...prev, video: false }));
    }
  }, [yarnImage, videoAspectRatio, isApiKeySelected]);

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-lg text-stone-600 mb-6">Hello there, fellow creator! Welcome to Yarn Genius. Show me your leftover yarn, and I'll help you spin it into something wonderful. Let's get knitting!</p>
          
          {/* FIX: Removed manual API key input field as per guidelines. */}

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
    </div>
  );
};

export default App;
