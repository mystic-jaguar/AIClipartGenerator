import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import { ClipartStyle } from '../types';
import { Colors, Radius, Spacing } from '../constants/theme';

interface Props {
  style: ClipartStyle;
  selected: boolean;
  onPress: () => void;
}

export function StyleChip({ style, selected, onPress }: Props) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={[
          styles.chip,
          selected && { borderColor: style.accentColor, backgroundColor: `${style.accentColor}18` },
        ]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        accessibilityLabel={`${style.label} style`}
      >
        <View style={[styles.dot, { backgroundColor: style.accentColor }]} />
        <View style={styles.textContainer}>
          <Text style={[styles.label, selected && { color: style.accentColor }]}>
            {style.label}
          </Text>
          <Text style={styles.description}>{style.description}</Text>
        </View>
        {selected && (
          <View style={[styles.checkmark, { backgroundColor: style.accentColor }]}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  description: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  checkmark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
