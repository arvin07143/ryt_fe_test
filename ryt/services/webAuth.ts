import AsyncStorage from '@react-native-async-storage/async-storage';

const PIN_KEY = '@auth_pin';
const DEFAULT_PIN = '123456'; // In a real app, this would be set during first-time setup

export async function authenticateWeb(pin: string): Promise<boolean> {
  try {
    if (!pin || pin.length !== 6) {
      return false;
    }
    const storedPin = await AsyncStorage.getItem(PIN_KEY) || DEFAULT_PIN;
    const isValid = pin === storedPin;
    if (isValid) {
      // Store authentication state
      await AsyncStorage.setItem('lastAuthTime', Date.now().toString());
      console.log('Web authentication successful');
    } else {
      // Add a small delay on failed attempts to prevent brute force
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return isValid;
  } catch (error) {
    console.error('Web authentication error:', error);
    return false;
  }
}
