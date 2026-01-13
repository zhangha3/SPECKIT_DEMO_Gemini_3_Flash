# Data Model: User, Inventory & Orders

This document defines the entities and data structures for the User Authentication, Inventory Management, and Ordering system.

## 1. User Entity
Represents a registered user in the system.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `username` | `string` | Unique identifier for login. | Required, unique, min-length 3. |
| `password` | `string` | Cleartext password (as per spec). | Required. |
| `email`    | `string` | User's email address. | Required, email format. |
| `country`  | `string` | User's country. | Required. |

**Default Users (Seed)**:
Initial 5 users defined in `src/assets/users.json`.

---

## 2. Updated Schedule Entity
Extends the existing boat schedule with inventory tracking.

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `id` | `string` | Unique identifier (S001, etc.) | N/A |
| ... | ... | (Existing fields: originPort, destinationPort, etc.) | N/A |
| `inventory` | `number` | Remaining seats/space. | 99 |

---

## 3. Order Entity
Represents a record of a successful cabin purchase.

| Field | Type | Description |
|-------|------|-------------|
| `orderId` | `string` | Unique ID in `ORD-YYYYMMDD-XXXX` format. |
| `userName` | `string` | Username of the buyer (relationship to User). |
| `orderTime` | `string` | ISO 8601 timestamp of purchase. |
| `scheduleSnapshot` | `object` | Copy of the schedule details at time of purchase. |

**Schedule Snapshot Details**:
Includes: `id`, `originPort`, `destinationPort`, `etd`, `carrier`, `vesselName`.

---

## 4. State Transitions & Rules

### Purchase Flow
1. **Pre-check**: Ensure `user` is logged in (session exists).
2. **Availability Check**: `schedule.inventory > 0`.
3. **Atomic decrement**: Subtract 1 from `schedule.inventory` in LocalStorage.
4. **Order Creation**: Construct `Order` object with current user and schedule snapshot.
5. **Persistence**: Push `Order` to `orders` array in LocalStorage.

### Authentication Flow
1. **Login**: Match `username` + `password` against User repository.
2. **Session**: On success, store user info in `SessionStorage['activeUser']`.
3. **Logout**: Clear `SessionStorage['activeUser']`.
