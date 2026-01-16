export const STORAGE_KEYS = {
  USERS: 'SHIP_USERS',
  SCHEDULES: 'SHIP_SCHEDULES',
  ORDERS: 'SHIP_ORDERS',
  SESSION_USER: 'SESSION_USER'
};

export class StorageService {
  static getData<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  static saveData<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static async initializeSeeds(): Promise<void> {
    // For Demo: Force reload users if fund/logs field missing to ensure new functionality works
    const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!existingUsers || !existingUsers.includes('funds')) {
      const usersResp = await fetch('/src/assets/users.json');
      const users = await usersResp.json();
      this.saveData(STORAGE_KEYS.USERS, users);
    }

    if (!localStorage.getItem(STORAGE_KEYS.SCHEDULES)) {
      const schedulesResp = await fetch('/src/assets/schedules.json');
      const schedules = await schedulesResp.json();
      this.saveData(STORAGE_KEYS.SCHEDULES, schedules);
    }

    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      this.saveData(STORAGE_KEYS.ORDERS, []);
    }
  }

  static getSessionUser(): any | null {
    const user = sessionStorage.getItem(STORAGE_KEYS.SESSION_USER);
    return user ? JSON.parse(user) : null;
  }

  static setSessionUser(user: any): void {
    sessionStorage.setItem(STORAGE_KEYS.SESSION_USER, JSON.stringify(user));
  }

  static clearSessionUser(): void {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION_USER);
  }
}
