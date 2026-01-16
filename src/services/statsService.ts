import { StorageService, STORAGE_KEYS } from './storageService';
import { AuthService } from './authService';
import type { Order } from '@/models/order';
import type { Schedule } from '@/models/schedule';

export interface StatsData {
  totalOrders: number;
  totalSpent: number;
  ordersByDate: Record<string, number>;
  ordersByCarrier: Record<string, number>;
  ordersByRoute: Record<string, number>;
}

export class StatsService {
  /**
   * Get statistics for the current user
   */
  static getUserStats(): StatsData {
    const user = AuthService.getCurrentUser();
    if (!user) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        ordersByDate: {},
        ordersByCarrier: {},
        ordersByRoute: {}
      };
    }

    const orders = StorageService.getData<Order>(STORAGE_KEYS.ORDERS)
      .filter(o => o.userName === user.username);

    const stats: StatsData = {
      totalOrders: orders.length,
      totalSpent: 0,
      ordersByDate: {},
      ordersByCarrier: {},
      ordersByRoute: {}
    };

    orders.forEach(order => {
      // Total spent
      const price = (order.scheduleSnapshot as any).price || 0;
      stats.totalSpent += price;

      // By Date (YYYY-MM-DD)
      const date = order.orderTime.split('T')[0];
      stats.ordersByDate[date] = (stats.ordersByDate[date] || 0) + 1;

      // By Carrier
      const carrier = order.scheduleSnapshot.carrier;
      stats.ordersByCarrier[carrier] = (stats.ordersByCarrier[carrier] || 0) + 1;

      // By Route (Origin -> Destination)
      const route = `${order.scheduleSnapshot.originPort} → ${order.scheduleSnapshot.destinationPort}`;
      stats.ordersByRoute[route] = (stats.ordersByRoute[route] || 0) + 1;
    });

    return stats;
  }

  /**
   * Get Hot Schedules (Top 3 most booked in the last 7 days)
   * Q8: Rolling 7-day period.
   */
  static getHotSchedules(): { schedule: Schedule; bookingCount: number }[] {
    const orders = StorageService.getData<Order>(STORAGE_KEYS.ORDERS);
    const schedules = StorageService.getData<Schedule>(STORAGE_KEYS.SCHEDULES);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Count bookings by scheduleId in the last 7 days
    const counts: Record<string, number> = {};
    orders.forEach(order => {
      const orderDate = new Date(order.orderTime);
      if (orderDate >= sevenDaysAgo) {
        const sid = order.scheduleSnapshot.id;
        counts[sid] = (counts[sid] || 0) + 1;
      }
    });

    // Map to result and sort
    return Object.entries(counts)
      .map(([id, count]) => ({
        schedule: schedules.find(s => s.id === id)!,
        bookingCount: count
      }))
      .filter(item => item.schedule) // Ensure schedule still exists
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 3);
  }
}
