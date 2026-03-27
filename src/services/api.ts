/**
 * AI Generation Service
 *
 * Calls the backend proxy which holds the Replicate API key.
 * API keys are NEVER stored on the device.
 *
 * Set USE_MOCK=true for local UI development without a backend.
 * Set API_BASE to your deployed backend URL before building the APK.
 */
import axios, { AxiosError } from 'axios';
import { StyleType, GeneratedResult } from '../types';

// ─── Config ──────────────────────────────────────────────────────────────────
// Replace with your deployed backend URL (Railway / Render / ngrok for local dev)
export const API_BASE = 'https://aiclipartbackend-production.up.railway.app';

// Toggle to true for UI dev without a running backend
const USE_MOCK = __DEV__ && true;
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_IMAGES: Record<StyleType, string> = {
  cartoon: 'https://picsum.photos/seed/cartoon/512/512',
  flat:    'https://picsum.photos/seed/flat/512/512',
  anime:   'https://picsum.photos/seed/anime/512/512',
  pixel:   'https://picsum.photos/seed/pixel/512/512',
  sketch:  'https://picsum.photos/seed/sketch/512/512',
};

const client = axios.create({
  baseURL: API_BASE,
  timeout: 90_000, // 90s — AI generation can be slow
  headers: { 'Content-Type': 'application/json' },
});

export async function generateClipart(
  imageBase64: string,
  styleId: StyleType,
  prompt: string,
): Promise<GeneratedResult> {
  if (USE_MOCK) {
    await new Promise<void>(resolve =>
      setTimeout(resolve, 2000 + Math.random() * 2000),
    );
    return { styleId, imageUrl: MOCK_IMAGES[styleId], timestamp: Date.now() };
  }

  try {
    const response = await client.post<{ imageUrl: string }>('/api/generate', {
      imageBase64,
      styleId,
      prompt,
    });

    return {
      styleId,
      imageUrl: response.data.imageUrl,
      timestamp: Date.now(),
    };
  } catch (err) {
    const axiosErr = err as AxiosError<{ error: string }>;
    const message =
      axiosErr.response?.data?.error ??
      axiosErr.message ??
      'Generation failed. Please try again.';
    throw new Error(message);
  }
}

export async function generateAllStyles(
  imageBase64: string,
  styles: Array<{ id: StyleType; prompt: string }>,
  onProgress?: (completed: number, total: number) => void,
): Promise<GeneratedResult[]> {
  const total = styles.length;
  let completed = 0;

  const promises = styles.map(async style => {
    const result = await generateClipart(imageBase64, style.id, style.prompt);
    completed++;
    onProgress?.(completed, total);
    return result;
  });

  return Promise.all(promises);
}
