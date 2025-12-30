import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  private readonly PREFIX = '@owles_app:';

  // Generic storage methods
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(`${this.PREFIX}${key}`, jsonValue);
    } catch (error) {
      console.error(`Failed to store ${key}:`, error);
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(`${this.PREFIX}${key}`);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Failed to retrieve ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.PREFIX}${key}`);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.PREFIX));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }

  // Specific storage methods for app data
  async setUserPreferences(preferences: any): Promise<void> {
    return this.setItem('userPreferences', preferences);
  }

  async getUserPreferences(): Promise<any | null> {
    return this.getItem('userPreferences');
  }

  async setTheme(theme: 'light' | 'dark'): Promise<void> {
    return this.setItem('theme', theme);
  }

  async getTheme(): Promise<'light' | 'dark' | null> {
    return this.getItem('theme');
  }

  async setLanguage(language: string): Promise<void> {
    return this.setItem('language', language);
  }

  async getLanguage(): Promise<string | null> {
    return this.getItem('language');
  }

  async setOfflineData(key: string, data: any): Promise<void> {
    return this.setItem(`offline_${key}`, data);
  }

  async getOfflineData<T>(key: string): Promise<T | null> {
    return this.getItem<T>(`offline_${key}`);
  }

  async setCacheData(key: string, data: any, expiry?: number): Promise<void> {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expiry: expiry ? Date.now() + expiry : null,
    };
    return this.setItem(`cache_${key}`, cacheData);
  }

  async getCacheData<T>(key: string): Promise<T | null> {
    try {
      const cacheData = await this.getItem<{
        data: T;
        timestamp: number;
        expiry: number | null;
      }>(`cache_${key}`);

      if (!cacheData) {
        return null;
      }

      // Check if cache has expired
      if (cacheData.expiry && Date.now() > cacheData.expiry) {
        await this.removeItem(`cache_${key}`);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.error(`Failed to get cache data for ${key}:`, error);
      return null;
    }
  }

  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.startsWith(this.PREFIX) && key.includes('cache_')
      );
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  }

  // Auth-specific storage methods
  async setAuthData(user: any, token: string): Promise<void> {
    await this.setItem('user', user);
    await this.setItem('token', token);
  }

  async getAuthData(): Promise<{ user: any | null; token: string | null }> {
    const user = await this.getItem<any>('user');
    const token = await this.getItem<string>('token');
    return { user, token };
  }

  async clearAuthData(): Promise<void> {
    await this.removeItem('user');
    await this.removeItem('token');
  }

  // Get storage info
  async getStorageInfo(): Promise<{
    used: number;
    available: number;
    total: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.PREFIX));
      
      let used = 0;
      for (const key of appKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          used += value.length;
        }
      }

      // Note: AsyncStorage doesn't provide total/available storage info
      // This is a simplified implementation
      return {
        used,
        available: 0, // Not available in AsyncStorage
        total: 0, // Not available in AsyncStorage
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { used: 0, available: 0, total: 0 };
    }
  }
}

export const storageService = new StorageService();
