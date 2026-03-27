# AI Clipart Generator

Transform your photos into multi-style clipart using AI. Android app built with React Native.

## Styles Supported
- Cartoon · Flat Illustration · Anime · Pixel Art · Sketch

## Setup

### Prerequisites
- Node.js 18+
- JDK 17
- Android Studio + Android SDK (API 33+)
- React Native CLI: `npm install -g @react-native-community/cli`

### Install
```bash
npm install
cd android && ./gradlew clean && cd ..
```

### Configure AI Backend
Edit `src/services/api.ts`:
- Set `USE_MOCK = false`
- Set `API_BASE` to your backend proxy URL

The backend proxy should accept `POST /api/generate` with `{ imageBase64, styleId, prompt }` and call Replicate/OpenAI, returning `{ imageUrl }`. This keeps API keys off the device.

### Run (Android)
```bash
npx react-native run-android
```

### Build APK
```bash
cd android
./gradlew assembleRelease
```
APK output: `android/app/build/outputs/apk/release/app-release.apk`

---

## Tech Decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | React Native | Cross-platform, large ecosystem, TypeScript support |
| Navigation | React Navigation v7 (native stack) | Native performance, type-safe params |
| Image picker | react-native-image-picker | Official RN community lib, camera + gallery |
| File I/O | react-native-fs | Reliable file read/write for base64 + downloads |
| AI API | Replicate (via backend proxy) | Low cost, many models, no vendor lock-in |
| State | useState + custom hook | Simple enough — no Redux needed |

## Tradeoffs

- **Mock mode on by default** — set `USE_MOCK=false` and deploy a backend proxy before submitting APK
- **No caching layer yet** — AsyncStorage caching of previous results is a quick add
- **Parallel generation** — all styles run simultaneously via `Promise.all`, fastest UX but higher API cost per session
- **No SVG output** — PNG only; SVG would require a vector-capable model (e.g. Recraft)

## APK Download
> [Google Drive Link — add after build]

## Screen Recording
> [Google Drive Link — add after recording]
