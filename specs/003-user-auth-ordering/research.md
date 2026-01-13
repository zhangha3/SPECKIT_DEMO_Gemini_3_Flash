# Research: Mock Data Persistence in Pure Frontend Environment

**Branch**: `003-user-auth-ordering` | **Date**: 2026-01-13
**Subject**: Best practices for simulating a backend with persistent data (User, Inventory, Orders).

## 1. LocalStorage vs IndexedDB for State Mirroring

### Decision
使用 **LocalStorage** 作为主要的持久化模拟介质，配合内存中的 **Store (Pinia)** 进行状态管理。

### Rationale
- **简单性**: LocalStorage 的 API 极其简单（`getItem`/`setItem`），非常适合演示项目（Demo）。
- **容量受限但足用**: 虽然有 5MB 限制，但对于存储 5 个默认用户、数百个船期记录和数十个订单记录绰绰有余。
- **持久性**: 满足“应用重启后数据可查”的需求。

### Alternatives
- **IndexedDB**: 适用于更复杂、数据量更大的场景（如离线应用），但增加了解析和异步处理的复杂度，不建议在简单的 Demo 中过度设计。
- **Mock Service Worker (MSW)**: 可以拦截 HTTP 请求并返回内存中的数据，但如果需要跨刷新持久化，仍需配合 LocalStorage。

## 2. 处理 "Persist to orders.json" 指令

### Decision
在 Demo 语境下，该需求应理解为“持久化到名为 `orders` 的 LocalStorage 存储槽中”。

### Rationale
- **浏览器限制**: 浏览器基于安全考虑，禁止 JS 直接写入本地文件系统（即使是项目源码目录）。
- **模拟层**: 建立一个 `StorageService` 抽象层，向上层提供 `orderRepository.save(order)` 方法。这个方法内部将数据推入 LocalStorage 数组。

## 3. Local Storage Service 模式

### Decision
采用 **Repository Pattern (仓库模式)** 结合 **Seed Logic (种子逻辑)**。

### Pattern Implementation
1. **初始化 (Initialization)**:
   - 应用启动时，检查 `LS_KEY_USERS`, `LS_KEY_SCHEDULES` 是否存在。
   - 若不存在，从 `src/assets/users.json` 或 `src/assets/schedules.json` 读取初始值并存入 LocalStorage。
2. **读写分离**:
   - `fetchSchedules()`: 优先从 LocalStorage 取，若为空则取 Seed。
   - `updateInventory()`: 直接更新 LocalStorage 中的对应记录。
   - `saveOrder()`: 将新订单 `push` 进 LocalStorage 的订单列表中。

## 4. 唯一订单号生成 (ORD-YYYYMMDD-XXXX)

### Decision
使用 `Date` 对象配合随机数生成器。

### Format Logic
- `ORD-`: 固定前缀。
- `YYYYMMDD`: 当前系统日期。
- `XXXX`: 4位随机数字，使用 `padStart(4, '0')` 确保对齐。

### Implementation Snippet
```typescript
function generateOrderId(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${dateStr}-${randomStr}`;
}
```

## Alternatives Considered
- **UUID**: 虽然更专业，但不符合 spec 要求的 `ORD-YYYYMMDD-XXXX` 格式。
- **Counter-based**: 如果存储中已有订单，可以根据长度递增（如 `0001`, `0002`），但在单机 Demo 中随机数冲突概率极低且实现更简单。
