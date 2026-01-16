import { StorageService, STORAGE_KEYS } from './storageService';
import { AuthService } from './authService';
import type { User } from '@/models/user';
import type { TransactionLog, TransactionType } from '@/models/transaction';

export class FundService {
  private static FUND_PASSWORD = '123456';

  /**
   * Top up user funds
   */
  static async topUp(amount: number, password: string): Promise<{ success: boolean; error?: string }> {
    if (amount <= 0 || !Number.isInteger(amount)) {
      return { success: false, error: '充值金额必须为正整数' };
    }

    if (password !== this.FUND_PASSWORD) {
      return { success: false, error: '资金密码错误' };
    }

    return this.updateBalance('TOP_UP', amount);
  }

  /**
   * Refund user funds
   */
  static async refund(amount: number, password: string): Promise<{ success: boolean; error?: string }> {
    const user = AuthService.getCurrentUser();
    if (!user) return { success: false, error: '用户未登录' };

    if (amount <= 0) {
      return { success: false, error: '退款金额必须大于 0' };
    }

    if (amount > user.funds) {
      return { success: false, error: '退款金额不能超过当前余额代大小' };
    }

    if (password !== this.FUND_PASSWORD) {
      return { success: false, error: '资金密码错误' };
    }

    return this.updateBalance('REFUND', -amount);
  }

  /**
   * Internal balance update logic
   */
  static async updateBalance(type: TransactionType, amount: number, orderId?: string): Promise<{ success: boolean; error?: string }> {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return { success: false, error: '用户未登录' };

    const users = StorageService.getData<User>(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.username === currentUser.username);

    if (userIndex === -1) return { success: false, error: '找不到当前用户' };

    const user = users[userIndex];
    
    // Check for negative balance (redundant check for safety)
    if (user.funds + amount < 0) {
      return { success: false, error: '余额不足' };
    }

    user.funds += amount;

    const newLog: TransactionLog = {
      id: `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type,
      amount: Math.abs(amount),
      balanceAfter: user.funds,
      orderId
    };

    if (!user.transactionLogs) user.transactionLogs = [];
    user.transactionLogs.unshift(newLog); // Newest first

    // Save back to storage
    users[userIndex] = user;
    StorageService.saveData(STORAGE_KEYS.USERS, users);

    // Update session user to reflect balance change
    StorageService.setSessionUser(user);

    return { success: true };
  }
}
