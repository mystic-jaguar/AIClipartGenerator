import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 82; // Good balance of quality vs size

/**
 * Compress and resize an image before sending to the API.
 * Keeps aspect ratio, caps longest side at MAX_DIMENSION.
 * Returns the URI of the compressed image (written to cache dir).
 */
export async function compressImage(uri: string): Promise<string> {
  const result = await ImageResizer.createResizedImage(
    uri,
    MAX_DIMENSION,
    MAX_DIMENSION,
    'JPEG',
    JPEG_QUALITY,
    0,           // no rotation
    undefined,   // output path — uses cache dir
    false,       // no premature scaling
    { mode: 'contain', onlyScaleDown: true }, // never upscale
  );
  return result.uri;
}

/**
 * Compress then read as base64.
 */
export async function compressAndEncodeBase64(uri: string): Promise<string> {
  const compressedUri = await compressImage(uri);
  return imageUriToBase64(compressedUri);
}

export async function imageUriToBase64(uri: string): Promise<string> {
  const path = uri.startsWith('file://') ? uri.slice(7) : uri;
  return RNFS.readFile(path, 'base64');
}

export function getImageMimeType(uri: string): string {
  const ext = uri.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function getDownloadDir(): Promise<string> {
  if (Platform.OS === 'android') {
    return RNFS.DownloadDirectoryPath;
  }
  return RNFS.DocumentDirectoryPath;
}

export async function saveImageToDownloads(
  imageUrl: string,
  filename: string,
): Promise<string> {
  const dir = await getDownloadDir();
  const destPath = `${dir}/${filename}`;

  if (imageUrl.startsWith('data:')) {
    // base64 data URI — extract and write directly
    const base64Data = imageUrl.split(',')[1];
    await RNFS.writeFile(destPath, base64Data, 'base64');
  } else if (imageUrl.startsWith('http')) {
    await RNFS.downloadFile({ fromUrl: imageUrl, toFile: destPath }).promise;
  } else {
    const src = imageUrl.startsWith('file://') ? imageUrl.slice(7) : imageUrl;
    await RNFS.copyFile(src, destPath);
  }

  return destPath;
}
