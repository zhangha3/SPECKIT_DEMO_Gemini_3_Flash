import type { Schedule } from './schedule';

export interface Order {
  orderId: string;
  userName: string;
  orderTime: string; // ISO 8601 string
  scheduleSnapshot: Pick<Schedule, 'id' | 'originPort' | 'destinationPort' | 'etd' | 'carrier' | 'vesselName' | 'price'>;
}
