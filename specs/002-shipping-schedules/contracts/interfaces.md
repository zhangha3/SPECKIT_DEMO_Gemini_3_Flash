# API Contract: Shipping Schedule Service

## Types

```typescript
export interface ScheduleQuery {
  originPort?: string;      // 5-digit code
  destinationPort?: string; // 5-digit code
  etdStart?: string;        // ISO Date
  etdEnd?: string;          // ISO Date
  page: number;
  pageSize: number;
}

export interface ScheduleResponse {
  total: number;
  list: Schedule[];
}

export interface Schedule {
  id: string;
  originPort: string;
  destinationPort: string;
  etd: string;
  duration: number;
  carrier: string;
  vesselName: string;
}
```

## Internal "Endpoints" (Composables)

### `useSchedules()`

**Method**: `query(params: ScheduleQuery): Promise<ScheduleResponse>`
- **Description**: 根据起运港、目的港和 ETD 范围进行联合过滤。
- **Logic**: 
  - (originPort OR destinationPort) IS REQUIRED.
  - AND etd >= etdStart (if provided)
  - AND etd <= etdEnd (if provided)
  - Result must be sorted by ETD ascending.

### `usePortsAutocomplete()`

**Method**: `search(query: string): Port[]`
- **Description**: 当输入长度 >= 2 时，匹配 code, name_cn, name_en。
