import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Spacing, Radius } from '../constants/theme';

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.content}>
        {/* Logo / Hero */}
        <View style={styles.hero}>
          <View style={styles.logoRing}>
            <View style={styles.logoInner}>
              <Text style={styles.logoIcon}>✦</Text>
            </View>
          </View>
          <Text style={styles.title}>Clipart AI</Text>
          <Text style={styles.subtitle}>
            Transform your photos into stunning clipart styles with AI
          </Text>
        </View>

        {/* Style preview pills */}
        <View style={styles.stylePills}>
          {['Cartoon', 'Anime', 'Pixel', 'Sketch', 'Flat'].map((s, i) => (
            <View key={s} style={[styles.pill, { marginLeft: i === 0 ? 0 : 8 }]}>
              <Text style={styles.pillText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Feature highlights */}
        <View style={styles.features}>
          {[
            { icon: '⚡', text: 'Batch generate all styles at once' },
            { icon: '⬇', text: 'Download as PNG instantly' },
            { icon: '🔒', text: 'Secure — no API keys exposed' },
          ].map(f => (
            <View key={f.text} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Upload')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Get started — upload a photo"
        >
          <Text style={styles.ctaText}>Get Started</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>Upload a photo to begin</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: Colors.cta,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.cta}22`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 28,
    color: Colors.cta,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.75,
  },
  stylePills: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
  },
  pill: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  features: {
    width: '100%',
    gap: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  featureText: {
    color: Colors.textMuted,
    fontSize: 14,
    flex: 1,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ctaButton: {
    width: '100%',
    backgroundColor: Colors.cta,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footerNote: {
    color: Colors.textMuted,
    fontSize: 13,
  },
});
