/**
 * StorageService provides a clean, robust abstraction layer over localStorage
 * and fallbacks for environments where window.localStorage might be restricted.
 */
export class StorageService {
  static getActiveAccountId(): string {
    try {
      return localStorage.getItem('rival_active_account_id') || 'default_device';
    } catch {
      return 'default_device';
    }
  }

  static setActiveAccountId(id: string | null) {
    try {
      if (id) {
        localStorage.setItem('rival_active_account_id', id);
      } else {
        localStorage.removeItem('rival_active_account_id');
      }
    } catch {}
  }

  static getScopedKey(key: string): string {
    // We don't scope the account ID key itself or auth status so we can check if logged in globally
    if (key === 'rival_active_account_id' || key === 'rival_is_authenticated' || key === 'rival_auth_provider') {
      return key;
    }
    const accountId = this.getActiveAccountId();
    return `${accountId}_${key}`;
  }

  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const scopedKey = this.getScopedKey(key);
      const stored = localStorage.getItem(scopedKey);
      if (stored === null) return defaultValue;
      return JSON.parse(stored) as T;
    } catch (err) {
      console.warn(`[StorageService] Failed to parse key "${key}":`, err);
      return defaultValue;
    }
  }

  static setItem<T>(key: string, value: T): void {
    try {
      const scopedKey = this.getScopedKey(key);
      localStorage.setItem(scopedKey, JSON.stringify(value));
    } catch (err) {
      console.warn(`[StorageService] Failed to save key "${key}":`, err);
    }
  }

  static removeItem(key: string): void {
    try {
      const scopedKey = this.getScopedKey(key);
      localStorage.removeItem(scopedKey);
    } catch (err) {
      console.warn(`[StorageService] Failed to remove key "${key}":`, err);
    }
  }

  static clear(): void {
    try {
      // Only clear scoped items, or clear all? 
      // Let's clear everything for simplicity if clear() is called
      localStorage.clear();
    } catch (err) {
      console.warn(`[StorageService] Failed to clear storage:`, err);
    }
  }
}

