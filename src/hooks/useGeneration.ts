import { useState, useCallback, useRef } from 'react';
import { GenerationState, GeneratedResult, StyleType } from '../types';
import { generateAllStyles } from '../services/api';
import { imageUriToBase64 } from '../utils/image';
import { CLIPART_STYLES } from '../constants/styles';

const initialState: GenerationState = {
  status: 'idle',
  results: [],
};

export function useGeneration() {
  const [state, setState] = useState<GenerationState>(initialState);
  const abortRef = useRef(false);

  const generate = useCallback(
    async (imageUri: string, selectedStyles: StyleType[]) => {
      abortRef.current = false;
      setState({ status: 'uploading', results: [], progress: 0 });

      try {
        const base64 = await imageUriToBase64(imageUri);

        setState(prev => ({ ...prev, status: 'processing', progress: 0 }));

        const stylesToGenerate = CLIPART_STYLES.filter(s =>
          selectedStyles.includes(s.id),
        );

        const results = await generateAllStyles(
          base64,
          stylesToGenerate,
          (completed, total) => {
            if (!abortRef.current) {
              setState(prev => ({
                ...prev,
                progress: Math.round((completed / total) * 100),
                // Append results as they come in
                results: prev.results,
              }));
            }
          },
        );

        if (!abortRef.current) {
          setState({ status: 'success', results, progress: 100 });
        }
      } catch (err: any) {
        if (!abortRef.current) {
          setState({
            status: 'error',
            results: [],
            error: err?.message ?? 'Generation failed. Please try again.',
          });
        }
      }
    },
    [],
  );

  const reset = useCallback(() => {
    abortRef.current = true;
    setState(initialState);
  }, []);

  return { state, generate, reset };
}
