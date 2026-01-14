import { StorageService, STORAGE_KEYS } from './storageService';
import type { User } from '@/models/user';

export class AuthService {
  static async login(username: string, password: string): Promise<User | null> {
    const users = StorageService.getData<User>(STORAGE_KEYS.USERS);
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      StorageService.setSessionUser(user);
      return user;
    }
    return null;
  }

  static logout(): void {
    StorageService.clearSessionUser();
  }

  static getCurrentUser(): User | null {
    return StorageService.getSessionUser();
  }

  static isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}
