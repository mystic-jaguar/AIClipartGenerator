import { useState, useCallback, useRef } from 'react';
import { GenerationState, GeneratedResult, StyleType } from '../types';
import { generateAllStyles } from '../services/api';
import { compressAndEncodeBase64 } from '../utils/image';
import { CLIPART_STYLES } from '../constants/styles';

const initialState: GenerationState = {
  status: 'idle',
  results: [],
};

export function useGeneration() {
  const [state, setState] = useState<GenerationState>(initialState);
  // Keep the last base64 so retry doesn't re-compress
  const cachedBase64 = useRef<string | null>(null);
  const cachedUri = useRef<string | null>(null);

  const generate = useCallback(
    async (imageUri: string, selectedStyles: StyleType[]) => {
      setState({ status: 'uploading', results: [], progress: 0 });

      try {
        // Only re-compress if the image changed
        if (cachedUri.current !== imageUri || !cachedBase64.current) {
          cachedUri.current = imageUri;
          cachedBase64.current = await compressAndEncodeBase64(imageUri);
        }

        const base64 = cachedBase64.current;
        setState(prev => ({ ...prev, status: 'processing', progress: 0 }));

        const stylesToGenerate = CLIPART_STYLES.filter(s =>
          selectedStyles.includes(s.id),
        );

        const results = await generateAllStyles(
          base64,
          stylesToGenerate,
          (completed, total) => {
            setState(prev => ({
              ...prev,
              progress: Math.round((completed / total) * 100),
            }));
          },
        );

        setState({ status: 'success', results, progress: 100 });
      } catch (err: any) {
        setState({
          status: 'error',
          results: [],
          error: err?.message ?? 'Generation failed. Please try again.',
        });
      }
    },
    [],
  );

  const retry = useCallback(
    (imageUri: string, selectedStyles: StyleType[]) => {
      generate(imageUri, selectedStyles);
    },
    [generate],
  );

  const reset = useCallback(() => {
    cachedBase64.current = null;
    cachedUri.current = null;
    setState(initialState);
  }, []);

  return { state, generate, retry, reset };
}
