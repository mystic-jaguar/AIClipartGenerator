import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Image,
  ScrollView,
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
  const { state, generate } = useGeneration();
  const hasStarted = useRef(false);

  // Progress bar animation
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

  // Navigate to results when done
  useEffect(() => {
    if (state.status === 'success' && state.results.length > 0) {
      const timer = setTimeout(() => {
        navigation.replace('Results', { results: state.results });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [state.status, state.results]);

  const statusLabel = {
    idle: 'Preparing...',
    uploading: 'Processing image...',
    processing: `Generating ${selectedStyles.length} style${selectedStyles.length !== 1 ? 's' : ''}...`,
    success: 'Done! Loading results...',
    error: 'Something went wrong',
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
            <Text style={styles.title}>Generating</Text>
            <Text style={styles.statusLabel}>{statusLabel}</Text>
          </View>
        </View>

        {/* Progress bar */}
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

        {/* Style skeleton cards */}
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

        {state.status === 'error' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{state.error}</Text>
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
  headerText: {
    flex: 1,
  },
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
  grid: {
    gap: Spacing.md,
  },
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
  skeletonDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  skeletonLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: `${Colors.error}18`,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.error}40`,
    marginTop: Spacing.md,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
});
