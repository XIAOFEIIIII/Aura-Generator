export interface ColorStop {
  id: string;
  value: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  createdAt: Date;
}

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';
