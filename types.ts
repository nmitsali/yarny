export interface LoadingState {
  analysis: boolean | string | null;
  pattern: boolean | string | null;
  image: boolean | string | null;
  video: boolean | string | null;
}

// FIX: Define the AIStudio interface and augment the global Window object to fix declaration errors.
// By moving AIStudio into `declare global`, it becomes a global type and can be merged with other declarations.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  
  interface Window {
    aistudio: AIStudio;
  }
}
