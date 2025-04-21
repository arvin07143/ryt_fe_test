import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Pressable } from 'react-native';

interface PinInputProps {
  onSubmit: (pin: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
}

export function PinInput({ onSubmit, onCancel, isLoading, error: externalError }: PinInputProps) {
  const [pin, setPin] = useState('');
  const [internalError, setInternalError] = useState('');

  const handleSubmit = () => {
    if (pin.length < 6) {
      setInternalError('PIN must be 6 digits');
      return;
    }
    setInternalError('');
    onSubmit(pin);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Enter PIN</ThemedText>
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={setPin}
        placeholder="Enter 6-digit PIN"
        keyboardType="numeric"
        secureTextEntry
        maxLength={6}
        editable={!isLoading}
      />      {(internalError || externalError) ? (
        <ThemedText style={styles.error}>{internalError || externalError}</ThemedText>
      ) : null}      <View style={styles.buttonContainer}>
        <Pressable 
          style={({pressed}) => [
            styles.button,
            styles.cancelButton,
            pressed && { opacity: 0.7 }
          ]} 
          onPress={onCancel}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>Cancel</ThemedText>
        </Pressable>
        <Pressable 
          style={({pressed}) => [
            styles.button,
            styles.submitButton,
            pressed && { opacity: 0.7 }
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? 'Verifying...' : 'Submit'}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 10,
    letterSpacing: 8,
    textAlign: 'center',
  },
  error: {
    color: '#ff3b30',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#8e8e93',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
