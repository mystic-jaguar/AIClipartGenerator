import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Spacing, Radius } from '../constants/theme';
import { AppModal } from '../components/AppModal';
import { useModal } from '../hooks/useModal';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Upload'>;

const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function UploadScreen() {
  const navigation = useNavigation<Nav>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number; size: number } | null>(null);
  const { modal, hideModal, showError } = useModal();

  const handlePickerResponse = (response: ImagePickerResponse) => {
    if (response.didCancel || response.errorCode) return;

    const asset = response.assets?.[0];
    if (!asset?.uri) return;

    // Validate type
    if (asset.type && !VALID_TYPES.includes(asset.type)) {
      showError('Invalid Format', 'Please select a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate size
    if (asset.fileSize && asset.fileSize > MAX_SIZE) {
      showError('Image Too Large', 'Please select an image under 10MB.');
      return;
    }

    setImageUri(asset.uri);
    setImageInfo({
      width: asset.width ?? 0,
      height: asset.height ?? 0,
      size: asset.fileSize ?? 0,
    });
  };

  const openCamera = () => {
    launchCamera(
      { mediaType: 'photo', quality: 0.85, maxWidth: 1024, maxHeight: 1024 },
      handlePickerResponse,
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.85, maxWidth: 1024, maxHeight: 1024 },
      handlePickerResponse,
    );
  };

  const handleContinue = () => {
    if (!imageUri) return;
    navigation.navigate('StyleSelect', { imageUri });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Upload Photo</Text>
        <Text style={styles.subtitle}>
          Choose a clear photo of yourself for best results
        </Text>

        {/* Upload area */}
        {imageUri ? (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.preview}
              resizeMode="cover"
              accessibilityLabel="Selected photo preview"
            />
            <View style={styles.previewOverlay}>
              <TouchableOpacity
                style={styles.changeBtn}
                onPress={openGallery}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Change photo"
              >
                <Text style={styles.changeBtnText}>Change Photo</Text>
              </TouchableOpacity>
            </View>
            {imageInfo && (
              <View style={styles.imageMetaRow}>
                <Text style={styles.imageMeta}>
                  {imageInfo.width} × {imageInfo.height}px
                </Text>
                <Text style={styles.imageMeta}>
                  {(imageInfo.size / 1024).toFixed(0)} KB
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.dropzone}>
            <View style={styles.dropzoneIcon}>
              <Text style={styles.dropzoneIconText}>↑</Text>
            </View>
            <Text style={styles.dropzoneTitle}>Select a photo</Text>
            <Text style={styles.dropzoneHint}>JPEG, PNG, WebP · Max 10MB</Text>
          </View>
        )}

        {/* Source buttons */}
        <View style={styles.sourceButtons}>
          <TouchableOpacity
            style={styles.sourceBtn}
            onPress={openCamera}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Take a photo with camera"
          >
            <Text style={styles.sourceBtnIcon}>📷</Text>
            <Text style={styles.sourceBtnText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sourceBtn}
            onPress={openGallery}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Choose from gallery"
          >
            <Text style={styles.sourceBtnIcon}>🖼</Text>
            <Text style={styles.sourceBtnText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.tip}>
          Tip: Use a well-lit, front-facing photo for the best clipart output.
        </Text>
      </ScrollView>

      {/* Continue CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, !imageUri && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!imageUri}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Continue to style selection"
          accessibilityState={{ disabled: !imageUri }}
        >
          <Text style={styles.continueBtnText}>
            {imageUri ? 'Continue →' : 'Select a photo first'}
          </Text>
        </TouchableOpacity>
      </View>

      <AppModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        buttons={modal.buttons}
        onDismiss={hideModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    padding: Spacing.xl,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  dropzone: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  dropzoneIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  dropzoneIconText: {
    fontSize: 24,
    color: Colors.textMuted,
  },
  dropzoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  dropzoneHint: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  previewContainer: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  preview: {
    width: '100%',
    aspectRatio: 1,
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 40,
    right: Spacing.md,
  },
  changeBtn: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  changeBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  imageMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  imageMeta: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  sourceButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sourceBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  sourceBtnIcon: {
    fontSize: 22,
  },
  sourceBtnText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  tip: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  continueBtn: {
    backgroundColor: Colors.cta,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnDisabled: {
    backgroundColor: Colors.surfaceElevated,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
