import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useGeneration } from '../hooks/useGeneration';
import { SkeletonCard } from '../components/SkeletonCard';
import { CLIPART_STYLES } from '../constants/styles';
import { Colors, Spacing, Radius } from '../constants/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Generate'>;
type Route = RouteProp<RootStackParamList, 'Generate'>;

export function GenerateScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { imageUri, selectedStyles } = route.params;
  const { state, generate, retry } = useGeneration();
  const hasStarted = useRef(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      generate(imageUri, selectedStyles);
    }
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: state.progress ?? 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [state.progress]);

  useEffect(() => {
    if (state.status === 'success' && state.results.length > 0) {
      const timer = setTimeout(() => {
        navigation.replace('Results', { results: state.results });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [state.status, state.results]);

  const isError = state.status === 'error';
  const isProcessing = state.status === 'uploading' || state.status === 'processing';

  const statusLabel = {
    idle: 'Preparing...',
    uploading: 'Compressing image...',
    processing: `Generating ${selectedStyles.length} style${selectedStyles.length !== 1 ? 's' : ''}...`,
    success: 'Done! Loading results...',
    error: 'Generation failed',
  }[state.status];

  const selectedStyleInfos = CLIPART_STYLES.filter(s =>
    selectedStyles.includes(s.id),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: imageUri }}
            style={styles.sourceThumb}
            resizeMode="cover"
            accessibilityLabel="Source photo being processed"
          />
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {isError ? 'Something went wrong' : 'Generating'}
            </Text>
            <Text style={[styles.statusLabel, isError && { color: Colors.error }]}>
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* Progress bar — hidden on error */}
        {!isError && (
          <>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
                accessibilityRole="progressbar"
                accessibilityValue={{ min: 0, max: 100, now: state.progress ?? 0 }}
              />
            </View>
            <Text style={styles.progressText}>
              {state.progress ?? 0}% complete
            </Text>
          </>
        )}

        {/* Error state */}
        {isError && (
          <View style={styles.errorContainer}>
            <View style={styles.errorBox}>
              <Text style={styles.errorIcon}>✕</Text>
              <Text style={styles.errorTitle}>Generation Failed</Text>
              <Text style={styles.errorMessage}>{state.error}</Text>
            </View>

            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => retry(imageUri, selectedStyles)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Retry generation"
            >
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back to style selection"
            >
              <Text style={styles.backBtnText}>← Change Styles</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Skeleton cards — shown while processing */}
        {isProcessing && (
          <View style={styles.grid}>
            {selectedStyleInfos.map(style => (
              <View key={style.id} style={styles.skeletonWrapper}>
                <View style={[styles.skeletonBadge, { backgroundColor: `${style.accentColor}22` }]}>
                  <View style={[styles.skeletonDot, { backgroundColor: style.accentColor }]} />
                  <Text style={[styles.skeletonLabel, { color: style.accentColor }]}>
                    {style.label}
                  </Text>
                </View>
                <SkeletonCard height={180} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sourceThumb: {
    width: 52,
    height: 52,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.cta,
  },
  headerText: { flex: 1 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.cta,
    borderRadius: 2,
  },
  progressText: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'right',
    marginBottom: Spacing.xl,
  },
  // Error
  errorContainer: {
    gap: Spacing.md,
  },
  errorBox: {
    backgroundColor: `${Colors.error}12`,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: `${Colors.error}35`,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  errorIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.error}20`,
    textAlign: 'center',
    lineHeight: 44,
    fontSize: 18,
    color: Colors.error,
    overflow: 'hidden',
  },
  errorTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  errorMessage: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    backgroundColor: Colors.cta,
    borderRadius: Radius.lg,
    paddingVertical: 15,
    alignItems: 'center',
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  backBtnText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  // Skeletons
  grid: { gap: Spacing.md },
  skeletonWrapper: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    padding: Spacing.sm,
  },
  skeletonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    marginBottom: Spacing.sm,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  skeletonDot: { width: 8, height: 8, borderRadius: 4 },
  skeletonLabel: { fontSize: 13, fontWeight: '600' },
});
