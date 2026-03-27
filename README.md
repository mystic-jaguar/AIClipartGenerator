# AI Clipart Generator — Mobile App

React Native Android app for generating AI clipart images via Hugging Face models.

---

## Prerequisites

- Node.js 18+
- JDK 17
- Android Studio + emulator (or physical device via USB)
- React Native CLI

```bash
npm install -g @react-native-community/cli
```

---

## Setup

```bash
# Install dependencies
npm install

# Clean Android build cache (if you hit build errors)
cd android && ./gradlew clean && cd ..
```

---

## Running

Open two terminals:

**Terminal 1 — Metro bundler:**
```bash
npx react-native start --port 8081
```

**Terminal 2 — Android:**
```bash
npx react-native run-android --port 8081
```

Make sure an emulator is running or a device is connected via USB before running the second command.

---

## API Configuration

In `src/services/api.ts`, set the backend URL:

```ts
const API_BASE = 'https://xxxx.trycloudflare.com'; // or your Railway domain
```

Toggle mock mode for UI testing without a backend:

```ts
const USE_MOCK = __DEV__ && true;  // mock ON
const USE_MOCK = __DEV__ && false; // mock OFF (real API)
```

---

## Build APK

```bash
cd android

# Debug APK
./gradlew assembleDebug

# Release APK
./gradlew assembleRelease
```

Output paths:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

Install to connected device:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Common Fixes

```bash
# Reset Metro cache
npx react-native start --reset-cache

# Reinstall node_modules
rm -rf node_modules && npm install

# Clean Android build
cd android && ./gradlew clean && cd ..

# Check TypeScript errors
npx tsc --noEmit
```

---

## Design System

```bash
# Generate design system for a new feature
python .kiro/steering/ui-ux-pro-max/scripts/search.py "your query" --design-system -p "Project Name"

# Search UX guidelines
python .kiro/steering/ui-ux-pro-max/scripts/search.py "loading animation" --domain ux

# Get React Native stack guidelines
python .kiro/steering/ui-ux-pro-max/scripts/search.py "navigation" --stack react-native
```

---

## Quick Start (Full Stack)

Open 3 terminals:

```bash
# Terminal 1 — Backend
cd ../backend && npm run dev

# Terminal 2 — Tunnel
cd ../backend && npx cloudflared tunnel --url http://localhost:3000

# Terminal 3 — App
npx react-native run-android --port 8081
```
