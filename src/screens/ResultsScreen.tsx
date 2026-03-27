import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { ResultCard } from '../components/ResultCard';
import { Colors, Spacing, Radius } from '../constants/theme';
import { saveImageToDownloads } from '../utils/image';
import { AppModal } from '../components/AppModal';
import { useModal } from '../hooks/useModal';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Results'>;
type Route = RouteProp<RootStackParamList, 'Results'>;

export function ResultsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { results } = route.params;
  const [downloadingAll, setDownloadingAll] = useState(false);
  const { modal, hideModal, showSuccess, showError } = useModal();

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    try {
      await Promise.all(
        results.map(r =>
          saveImageToDownloads(
            r.imageUrl,
            `clipart_${r.styleId}_${r.timestamp}.png`,
          ),
        ),
      );
      showSuccess('All Saved', `${results.length} images saved to Downloads.`);
    } catch {
      showError('Error', 'Some images failed to save. Please try individually.');
    } finally {
      setDownloadingAll(false);
    }
  };

  const handleStartOver = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your Cliparts</Text>
          <Text style={styles.subtitle}>
            {results.length} style{results.length !== 1 ? 's' : ''} generated
          </Text>
        </View>
        <TouchableOpacity
          style={styles.downloadAllBtn}
          onPress={handleDownloadAll}
          disabled={downloadingAll}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Download all images"
        >
          {downloadingAll ? (
            <ActivityIndicator color={Colors.cta} size="small" />
          ) : (
            <Text style={styles.downloadAllText}>Save All</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {results.map(result => (
          <ResultCard key={result.styleId} result={result} />
        ))}

        {/* Start over */}
        <TouchableOpacity
          style={styles.startOverBtn}
          onPress={handleStartOver}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Start over with a new photo"
        >
          <Text style={styles.startOverText}>+ New Photo</Text>
        </TouchableOpacity>
      </ScrollView>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  downloadAllBtn: {
    backgroundColor: `${Colors.cta}18`,
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: Colors.cta,
    minWidth: 80,
    alignItems: 'center',
  },
  downloadAllText: {
    color: Colors.cta,
    fontWeight: '700',
    fontSize: 14,
  },
  scroll: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  startOverBtn: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  startOverText: {
    color: Colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
});
