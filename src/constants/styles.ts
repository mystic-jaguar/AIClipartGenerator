import { ClipartStyle } from '../types';
import { Colors } from './theme';

export const CLIPART_STYLES: ClipartStyle[] = [
  {
    id: 'cartoon',
    label: 'Cartoon',
    description: 'Bold outlines, vibrant colors',
    prompt: 'Transform this photo into a cartoon illustration style with bold outlines, vibrant saturated colors, simplified features, and a fun animated look. High quality digital art.',
    accentColor: Colors.cartoon,
    icon: '🎨',
  },
  {
    id: 'flat',
    label: 'Flat Art',
    description: 'Clean, minimal illustration',
    prompt: 'Convert this photo into a flat design illustration with clean geometric shapes, minimal details, solid colors, no shadows, modern vector art style.',
    accentColor: Colors.flat,
    icon: '🖼',
  },
  {
    id: 'anime',
    label: 'Anime',
    description: 'Japanese animation style',
    prompt: 'Transform this photo into anime art style with large expressive eyes, clean line art, cel shading, vibrant hair colors, Japanese animation aesthetic.',
    accentColor: Colors.anime,
    icon: '✨',
  },
  {
    id: 'pixel',
    label: 'Pixel Art',
    description: '8-bit retro game style',
    prompt: 'Convert this photo into pixel art style, 16-bit retro video game aesthetic, limited color palette, visible pixels, nostalgic arcade game character design.',
    accentColor: Colors.pixel,
    icon: '🕹',
  },
  {
    id: 'sketch',
    label: 'Sketch',
    description: 'Hand-drawn pencil outline',
    prompt: 'Transform this photo into a pencil sketch illustration with hand-drawn lines, cross-hatching shading, artistic sketch style, black and white with subtle tones.',
    accentColor: Colors.sketch,
    icon: '✏️',
  },
];
