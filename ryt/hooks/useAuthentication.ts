import { useState, useCallback, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { AuthenticationService } from '../services/auth';

export function useAuthentication() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const auth = AuthenticationService.getInstance();

  const checkAuthStatus = useCallback(async () => {
    const status = await auth.isUserAuthenticated();
    setIsAuthenticated(status);
    setIsLoading(false);
  }, []);

  const authenticate = useCallback(async (pin?: string) => {
    setIsLoading(true);
    try {
      const { supported, enrolled } = await auth.checkBiometricSupport();
      
      if (!supported || !enrolled) {
        if (Platform.OS !== 'web') {
          Alert.alert(
            'Biometric Authentication Not Available',
            'Your device either does not support biometric authentication or has no biometrics enrolled.',
            [{ text: 'OK' }]
          );
          setIsLoading(false);
          return false;
        }
      }
      const success = await auth.authenticateWithBiometrics(pin);
      setIsAuthenticated(success);
      return success;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    auth.clearAuthentication();
    setIsAuthenticated(false);
  }, []);

  // Initial auth check
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Periodic auth check every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(checkAuthStatus, 30000);
    return () => clearInterval(intervalId);
  }, [checkAuthStatus]);

  return {
    isAuthenticated,
    isLoading,
    authenticate,
    logout,
  };
}
