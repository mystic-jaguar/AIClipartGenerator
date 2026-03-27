export type StyleType = 'cartoon' | 'flat' | 'anime' | 'pixel' | 'sketch';

export interface ClipartStyle {
  id: StyleType;
  label: string;
  description: string;
  prompt: string;
  accentColor: string;
  icon: string;
}

export type GenerationStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export interface GeneratedResult {
  styleId: StyleType;
  imageUrl: string;
  localPath?: string;
  timestamp: number;
}

export interface GenerationState {
  status: GenerationStatus;
  results: GeneratedResult[];
  error?: string;
  progress?: number;
}

export type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  StyleSelect: { imageUri: string };
  Generate: { imageUri: string; selectedStyles: StyleType[] };
  Results: { results: GeneratedResult[] };
};
