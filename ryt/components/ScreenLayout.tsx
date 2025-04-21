import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from './ThemedView';

interface ScreenLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenLayout({ children, style }: ScreenLayoutProps) {
  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safe}>
      <ThemedView style={[styles.container, style]}>
        {children}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
