import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
} from 'react-native';
import { GeneratedResult } from '../types';
import { CLIPART_STYLES } from '../constants/styles';
import { Colors, Radius, Spacing } from '../constants/theme';
import { saveImageToDownloads } from '../utils/image';
import { AppModal } from './AppModal';
import { useModal } from '../hooks/useModal';

interface Props {
  result: GeneratedResult;
}

export function ResultCard({ result }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { modal, hideModal, showSuccess, showError } = useModal();
  const styleInfo = CLIPART_STYLES.find(s => s.id === result.styleId);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const filename = `clipart_${result.styleId}_${result.timestamp}.png`;
      await saveImageToDownloads(result.imageUrl, filename);
      showSuccess('Saved', `${styleInfo?.label} clipart saved to Downloads.`);
    } catch {
      showError('Download Failed', 'Could not save image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my ${styleInfo?.label} clipart!`,
        url: result.imageUrl,
      });
    } catch {
      // User cancelled share
    }
  };

  return (
    <>
      <View style={styles.card}>
      <View style={[styles.badge, { backgroundColor: `${styleInfo?.accentColor}22` }]}>
        <View style={[styles.badgeDot, { backgroundColor: styleInfo?.accentColor }]} />
        <Text style={[styles.badgeText, { color: styleInfo?.accentColor }]}>
          {styleInfo?.label}
        </Text>
      </View>

      <View style={styles.imageContainer}>
        {!imageLoaded && (
          <View style={styles.imagePlaceholder}>
            <ActivityIndicator color={styleInfo?.accentColor} />
          </View>
        )}
        <Image
          source={{ uri: result.imageUrl }}
          style={[styles.image, !imageLoaded && styles.hidden]}
          onLoad={() => setImageLoaded(true)}
          resizeMode="cover"
          accessibilityLabel={`${styleInfo?.label} clipart result`}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          onPress={handleShare}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Share image"
        >
          <Text style={styles.btnOutlineText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={handleDownload}
          disabled={downloading}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Download image"
        >
          {downloading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.btnPrimaryText}>Download</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>

      <AppModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        buttons={modal.buttons}
        onDismiss={hideModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.surfaceElevated,
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hidden: {
    opacity: 0,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  btnPrimary: {
    backgroundColor: Colors.cta,
  },
  btnOutlineText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
