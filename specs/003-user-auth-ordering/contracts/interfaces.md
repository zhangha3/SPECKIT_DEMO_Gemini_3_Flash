# Service Contracts: Auth & Ordering

Since this is a simulated backend project, the "contracts" define the interfaces for the Composables and Storage Services.

## 1. Authentication Service (`useAuth`)

```typescript
interface AuthService {
  // State
  currentUser: ComputedRef<User | null>;
  isAuthenticated: ComputedRef<boolean>;
  
  // Actions
  login(username: string, password: string): Promise<boolean>;
  logout(): void;
  initializeSession(): void; // Run on app startup
}
```

## 2. Storage Service (`storageService.ts`)

Low-level wrapper for LocalStorage with seeding.

```typescript
interface StorageService {
  getData<T>(key: string): T[];
  saveData<T>(key: string, data: T[]): void;
  initializeSeeds(): Promise<void>; // Load from JSON if LS is empty
}
```

## 3. Order Service (`useOrders`)

```typescript
interface OrderService {
  // State
  myOrders: ComputedRef<Order[]>;
  loading: Ref<boolean>;
  
  // Actions
  createOrder(schedule: Schedule): Promise<string>; // Returns orderId
  loadMyOrders(): Promise<void>;
  searchOrder(orderId: string): Order | null;
}
```

## 4. Storage Keys
- `SHIP_USERS`: Storage for user accounts.
- `SHIP_SCHEDULES`: Storage for schedules with inventory.
- `SHIP_ORDERS`: Storage for purchase history.
- `SESSION_USER`: Session storage for active login.
