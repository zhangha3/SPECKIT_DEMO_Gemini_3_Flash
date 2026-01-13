# Tasks: 用户登录、舱位购买及订单查询

**Feature**: 用户登录、舱位购买及订单查询
**Branch**: `003-user-auth-ordering`
**Project Type**: Vue 3 SPA (Vite)

## Phase 1: Setup

- [ ] T001 Create user model in `src/models/user.ts`
- [ ] T002 Create order model in `src/models/order.ts`
- [ ] T003 Update schedule model to include `inventory` in `src/models/schedule.ts`
- [ ] T004 Create initial user data in `src/assets/users.json` (5 default users)
- [ ] T005 Update `src/assets/schedules.json` to include `inventory: 99` for all entries

## Phase 2: Foundational

- [ ] T006 [P] Implement `StorageService` for LocalStorage management in `src/services/storageService.ts`
- [ ] T007 [P] Implement `AuthService` for login/session logic in `src/services/authService.ts`
- [ ] T008 [P] Implement `OrderService` for purchasing and order history in `src/services/orderService.ts`
- [ ] T009 Implement `useAuth` composable in `src/composables/useAuth.ts`
- [ ] T010 [P] Implement `useOrders` composable in `src/composables/useOrders.ts`
- [ ] T011 Update `src/router.ts` to add Login and Orders routes and global navigation guard

## Phase 3: User Story 1 - 用户登录与权限控制 [US1]

- [ ] T012 [P] [US1] Create `LoginView.vue` in `src/views/LoginView.vue`
- [ ] T013 [US1] Implement login redirect logic in `App.vue` or `router.ts`
- [ ] T014 [US1] Add logout button in navigation component (e.g., `App.vue`)

## Phase 4: User Story 2 - 船期库存展示与舱位购买 [US2]

- [ ] T015 [US2] Update `useSchedules.ts` to fetch from `StorageService` instead of direct JSON
- [ ] T016 [US2] Update `ScheduleList.vue` (or relevant search view) to display inventory
- [ ] T017 [P] [US2] Add "Purchase" button logic in `ScheduleList.vue` with inventory check
- [ ] T018 [US2] Implement success notification after purchase with Order ID

## Phase 5: User Story 3 - 我的订单查询 [US3]

- [ ] T019 [P] [US3] Create `OrdersView.vue` in `src/views/OrdersView.vue`
- [ ] T020 [US3] Implement order list displays with snapshots in `OrdersView.vue`
- [ ] T021 [P] [US3] Add search by Order ID functionality in `OrdersView.vue`

## Final Phase: Polish & Cross-cutting

- [ ] T022 [P] Add unit tests for `AuthService` in `tests/unit/services/auth.test.ts`
- [ ] T023 [P] Add unit tests for `OrderService` in `tests/unit/services/order.test.ts`
- [ ] T024 Perform final UI layout check for mobile responsiveness in Tailwind
- [ ] T025 Verify SessionStorage clearing on tab close vs LocalStorage persistence

## Dependencies & Strategy

- **Order**: US1 (Auth) -> US2 (Purchase) -> US3 (Orders History)
- **Parallel Opportunities**: Service implementations (T006-T008) can be done in parallel once models are ready. UI views (T012, T019) can be scaffolded in parallel.
- **MVP Strategy**: Focus on US1 and US2 first to enable the core business value (buying). US3 is a natural follow-up.
