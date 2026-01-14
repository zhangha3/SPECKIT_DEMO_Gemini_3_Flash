import { StorageService, STORAGE_KEYS } from './storageService';
import { AuthService } from './authService';
import type { Order } from '@/models/order';
import type { Schedule } from '@/models/schedule';

export class OrderService {
  /**
   * Generates order ID in format: ORD-YYYYMMDD-XXXX
   */
  private static generateOrderId(): string {
    const now = new Date();
    const datePart = now.toISOString().split('T')[0].replace(/-/g, '');
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${datePart}-${randomPart}`;
  }

  /**
   * Purchase a schedule: checks inventory, creates order, and updates schedule inventory
   */
  static async purchase(scheduleId: string): Promise<Order | { error: string }> {
    const user = AuthService.getCurrentUser();
    if (!user) return { error: 'User must be logged in to purchase.' };

    const schedules = StorageService.getData<Schedule>(STORAGE_KEYS.SCHEDULES);
    const scheduleIndex = schedules.findIndex(s => s.id === scheduleId);
    
    if (scheduleIndex === -1) return { error: 'Schedule not found.' };
    
    const schedule = schedules[scheduleIndex];
    if (schedule.inventory <= 0) return { error: 'Inventory is sold out.' };

    // 1. Reduce inventory
    schedule.inventory -= 1;
    schedules[scheduleIndex] = schedule;
    StorageService.saveData(STORAGE_KEYS.SCHEDULES, schedules);

    // 2. Create order with snapshot
    const newOrder: Order = {
      orderId: this.generateOrderId(),
      userName: user.username,
      orderTime: new Date().toISOString(),
      scheduleSnapshot: { ...schedule }
    };

    const orders = StorageService.getData<Order>(STORAGE_KEYS.ORDERS);
    orders.push(newOrder);
    StorageService.saveData(STORAGE_KEYS.ORDERS, orders);

    return newOrder;
  }

  /**
   * Get orders for the current user
   */
  static getOrdersForCurrentUser(): Order[] {
    const user = AuthService.getCurrentUser();
    if (!user) return [];
    
    const orders = StorageService.getData<Order>(STORAGE_KEYS.ORDERS);
    return orders.filter(o => o.userName === user.username);
  }

  /**
   * Search for an order by ID (must be current user's order)
   */
  static findOrderById(orderId: string): Order | null {
    const user = AuthService.getCurrentUser();
    if (!user) return null;

    const orders = StorageService.getData<Order>(STORAGE_KEYS.ORDERS);
    return orders.find(o => o.orderId === orderId && o.userName === user.username) || null;
  }
}
