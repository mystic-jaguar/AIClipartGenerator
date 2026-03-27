import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, StyleType } from '../types';
import { CLIPART_STYLES } from '../constants/styles';
import { StyleChip } from '../components/StyleChip';
import { Colors, Spacing, Radius } from '../constants/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'StyleSelect'>;
type Route = RouteProp<RootStackParamList, 'StyleSelect'>;

export function StyleSelectScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { imageUri } = route.params;

  const [selected, setSelected] = useState<StyleType[]>(
    CLIPART_STYLES.map(s => s.id), // All selected by default
  );

  const toggleStyle = (id: StyleType) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id],
    );
  };

  const selectAll = () => setSelected(CLIPART_STYLES.map(s => s.id));
  const clearAll = () => setSelected([]);

  const handleGenerate = () => {
    if (selected.length === 0) return;
    navigation.navigate('Generate', { imageUri, selectedStyles: selected });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Choose Styles</Text>
        <Text style={styles.subtitle}>
          Select which clipart styles to generate. All styles run in parallel.
        </Text>

        {/* Photo thumbnail */}
        <View style={styles.thumbnailRow}>
          <Image
            source={{ uri: imageUri }}
            style={styles.thumbnail}
            resizeMode="cover"
            accessibilityLabel="Your uploaded photo"
          />
          <View style={styles.thumbnailInfo}>
            <Text style={styles.thumbnailLabel}>Your photo</Text>
            <Text style={styles.thumbnailHint}>
              {selected.length} style{selected.length !== 1 ? 's' : ''} selected
            </Text>
          </View>
        </View>

        {/* Select all / clear */}
        <View style={styles.bulkRow}>
          <TouchableOpacity
            onPress={selectAll}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Select all styles"
          >
            <Text style={styles.bulkBtn}>Select All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={clearAll}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Clear all styles"
          >
            <Text style={[styles.bulkBtn, styles.bulkBtnMuted]}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Style chips */}
        {CLIPART_STYLES.map(style => (
          <StyleChip
            key={style.id}
            style={style}
            selected={selected.includes(style.id)}
            onPress={() => toggleStyle(style.id)}
          />
        ))}

        <View style={styles.batchNote}>
          <Text style={styles.batchNoteText}>
            ⚡ All selected styles generate simultaneously
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.generateBtn, selected.length === 0 && styles.generateBtnDisabled]}
          onPress={handleGenerate}
          disabled={selected.length === 0}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`Generate ${selected.length} clipart styles`}
          accessibilityState={{ disabled: selected.length === 0 }}
        >
          <Text style={styles.generateBtnText}>
            {selected.length === 0
              ? 'Select at least one style'
              : `Generate ${selected.length} Style${selected.length !== 1 ? 's' : ''} →`}
          </Text>
        </TouchableOpacity>
      </View>
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
  thumbnailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
  },
  thumbnailInfo: {
    flex: 1,
  },
  thumbnailLabel: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  thumbnailHint: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  bulkRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  bulkBtn: {
    color: Colors.cta,
    fontSize: 14,
    fontWeight: '600',
  },
  bulkBtnMuted: {
    color: Colors.textMuted,
  },
  batchNote: {
    backgroundColor: `${Colors.cta}15`,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: `${Colors.cta}30`,
  },
  batchNoteText: {
    color: Colors.cta,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
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
  generateBtn: {
    backgroundColor: Colors.cta,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  generateBtnDisabled: {
    backgroundColor: Colors.surfaceElevated,
  },
  generateBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
