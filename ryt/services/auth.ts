import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { authenticateWeb } from './webAuth';

const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Fallback storage for Node.js environment
class NodeStorage {
  private static storage = new Map<string, string>();

  static async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  static async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  static async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }
}

// Use appropriate storage based on environment
const storage = Platform.OS === 'web' && typeof window === 'undefined' 
  ? NodeStorage 
  : AsyncStorage;

export class AuthenticationService {
  private static instance: AuthenticationService;
  private isAuthenticated: boolean = false;
  private sessionTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    // Check for existing session on initialization
    this.checkExistingSession();
  }

  private async checkExistingSession() {
    try {
      const lastAuthTime = await storage.getItem('lastAuthTime');
      if (lastAuthTime) {
        const hasExpired = Date.now() - parseInt(lastAuthTime) > SESSION_DURATION;
        if (!hasExpired) {
          this.isAuthenticated = true;
        } else {
          await this.clearAuthentication();
        }
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      this.isAuthenticated = false;
    }
  }

  static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  async checkBiometricSupport(): Promise<{
    supported: boolean;
    available: boolean;
    enrolled: boolean;
  }> {
    if (Platform.OS === 'web') {
      return {
        supported: false,
        available: false,
        enrolled: false
      };
    }

    const supported = await LocalAuthentication.hasHardwareAsync();
    const available = await LocalAuthentication.isEnrolledAsync();

    return {
      supported,
      available,
      enrolled: supported && available,
    };
  }

  private setSessionTimeout() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
    this.sessionTimeout = setTimeout(() => {
      this.clearAuthentication();
    }, SESSION_DURATION);
  }

  async authenticateWithBiometrics(pin?: string): Promise<boolean> {
    try {
      let success = false;
      
      if (Platform.OS === 'web') {
        success = await authenticateWeb(pin || '');
      } else {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to view transactions',
          fallbackLabel: 'Use passcode',
          cancelLabel: 'Cancel',
          disableDeviceFallback: false,
        });
        success = result.success;
      }

      if (success) {
        this.isAuthenticated = true;
        await storage.setItem('lastAuthTime', Date.now().toString());
        this.setSessionTimeout();
      }

      return success;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  async isUserAuthenticated(): Promise<boolean> {
    try {
      if (!this.isAuthenticated) {
        return false;
      }

      const lastAuthTime = await storage.getItem('lastAuthTime');
      if (!lastAuthTime) {
        return false;
      }

      const hasExpired = Date.now() - parseInt(lastAuthTime) > SESSION_DURATION;
      
      if (hasExpired) {
        await this.clearAuthentication();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  async clearAuthentication(): Promise<void> {
    try {
      this.isAuthenticated = false;
      if (this.sessionTimeout) {
        clearTimeout(this.sessionTimeout);
        this.sessionTimeout = null;
      }
      await storage.removeItem('lastAuthTime');
    } catch (error) {
      console.error('Error clearing authentication:', error);
    }
  }
}
