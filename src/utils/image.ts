import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const MAX_DIMENSION = 1024;
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

export async function imageUriToBase64(uri: string): Promise<string> {
  // Strip file:// prefix for RNFS
  const path = uri.startsWith('file://') ? uri.slice(7) : uri;
  const base64 = await RNFS.readFile(path, 'base64');
  return base64;
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

  if (imageUrl.startsWith('http')) {
    await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: destPath,
    }).promise;
  } else {
    const src = imageUrl.startsWith('file://') ? imageUrl.slice(7) : imageUrl;
    await RNFS.copyFile(src, destPath);
  }

  return destPath;
}
