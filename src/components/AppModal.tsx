import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';

export type ModalType = 'success' | 'error' | 'info' | 'warning';

export interface ModalButton {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline';
}

interface Props {
  visible: boolean;
  type?: ModalType;
  title: string;
  message?: string;
  buttons?: ModalButton[];
  onDismiss?: () => void;
}

const TYPE_CONFIG: Record<ModalType, { color: string; icon: string }> = {
  success: { color: Colors.success,  icon: '✓' },
  error:   { color: Colors.error,    icon: '✕' },
  info:    { color: Colors.cta,      icon: 'i' },
  warning: { color: Colors.warning,  icon: '!' },
};

export function AppModal({
  visible,
  type = 'info',
  title,
  message,
  buttons,
  onDismiss,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const config = TYPE_CONFIG[type];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 260,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const defaultButtons: ModalButton[] = buttons ?? [
    { label: 'OK', onPress: onDismiss, variant: 'primary' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.card,
                { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
              ]}
            >
              {/* Icon */}
              <View style={[styles.iconRing, { borderColor: `${config.color}40`, backgroundColor: `${config.color}15` }]}>
                <Text style={[styles.iconText, { color: config.color }]}>
                  {config.icon}
                </Text>
              </View>

              {/* Title */}
              <Text style={styles.title}>{title}</Text>

              {/* Message */}
              {message ? (
                <Text style={styles.message}>{message}</Text>
              ) : null}

              {/* Divider */}
              <View style={styles.divider} />

              {/* Buttons */}
              <View style={[
                styles.buttonRow,
                defaultButtons.length === 1 && styles.buttonRowSingle,
              ]}>
                {defaultButtons.map((btn, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.btn,
                      btn.variant === 'primary'
                        ? [styles.btnPrimary, { backgroundColor: config.color }]
                        : styles.btnOutline,
                      defaultButtons.length === 1 && styles.btnFull,
                    ]}
                    onPress={() => {
                      btn.onPress?.();
                      onDismiss?.();
                    }}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={btn.label}
                  >
                    <Text style={[
                      styles.btnText,
                      btn.variant === 'primary' ? styles.btnTextPrimary : styles.btnTextOutline,
                    ]}>
                      {btn.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    paddingTop: Spacing.xl,
    overflow: 'hidden',
  },
  iconRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  iconText: {
    fontSize: 22,
    fontWeight: '700',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  message: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.border,
    marginTop: Spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
  },
  buttonRowSingle: {
    flexDirection: 'column',
  },
  btn: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFull: {
    flex: 1,
  },
  btnPrimary: {
    borderRadius: 0,
  },
  btnOutline: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  btnTextPrimary: {
    color: '#fff',
  },
  btnTextOutline: {
    color: Colors.textMuted,
  },
});
