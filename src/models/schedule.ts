export interface Schedule {
  id: string;
  originPort: string;      // UN/LOCODE e.g., CNSHA
  destinationPort: string; // UN/LOCODE e.g., USLAX
  etd: string;             // ISO 8601 Date
  duration: number;        // Days
  carrier: string;         // Shipping line
  vesselName: string;
  inventory: number;
}

export interface ScheduleQuery {
  originPort?: string;
  destinationPort?: string;
  etdStart?: string;
  etdEnd?: string;
  page: number;
  pageSize: number;
}

export interface ScheduleResponse {
  total: number;
  list: Schedule[];
}
