# Tasks: 用户资金账户及统计分析

**Input**: Design documents from `/specs/005-user-funds-stats/`
**Prerequisites**: plan.md, spec.md, data-model.md

**Organization**: 任务按用户故事分组，支持独立实施和测试。

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: 可并行执行（不同文件，无依赖）
- **[Story]**: 所属用户故事 (US1, US2, US3, US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 初始化数据结构和基础配置

- [ ] T001 在 `src/assets/users.json` 中为初始用户增加 `funds: 0` 和 `transactionLogs: []` 字段
- [ ] T002 更新 `src/assets/schedules.json`，为每个船期增加 `price` 字段（值为 transit_days * 5）
- [ ] T003 更新 `.specify/memory/glossary.md` 包含资金、流水、热门船期等新术语

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 核心模型和服务层基础架构

- [ ] T004 [P] 创建 `src/models/transaction.ts` 定义交易流水接口
- [ ] T005 [P] 在 `src/models/user.ts` 中增加 `funds` 和 `transactionLogs` 定义
- [ ] T006 在 `src/services/storageService.ts` 中更新数据初始化逻辑，确保新字段被正确加载并持久化
- [ ] T007 创建 `src/services/fundService.ts` 基础类，并注入认证和存储依赖

**Checkpoint**: 基础架构就绪，用户故事可开始并行开发

---

## Phase 3: User Story 1 - 资金账户管理与充值退款 (Priority: P1)  MVP

**Goal**: 用户可充值/退款，并查看余额和流水日志

**Independent Test**: 进入资金管理页，输入金额及密码 123456 进行充值，余额应实时增加并显示在流水列表中。

### Implementation for User Story 1

- [ ] T008 [P] [US1] 在 `src/services/fundService.ts` 中实现充值（topUp）和退款（refund）逻辑，并包含密码验证
- [ ] T010 [US1] 创建 `src/views/FundManagementView.vue`，展示当前余额、充值/退款表单及流水日志表格
- [ ] T011 [US1] 在 `src/router.ts` 中增加资金管理页面的路由配置
- [ ] T012 [US1] 在 `src/App.vue` 导航栏中增加资金账户入口

**Checkpoint**: 用户故事 1 已完成，可独立进行资金操作及流水查看

---

## Phase 4: User Story 2 - 结合资金扣减的船期舱位购买 (Priority: P1)

**Goal**: 购买船期时自动从余额扣除相应金额，并更新流水

**Independent Test**: 在船期页面购买一个 50 元的船期，检查余额是否减少 50，且流水中新增一条购买支付记录。

### Implementation for User Story 2

- [ ] T013 [US2] 修改 `src/services/orderService.ts` 中的 purchase 方法，增加余额检查和资金扣减逻辑
- [ ] T014 [US2] 在 `src/composables/useSchedules.ts` 中适配余额不足时的错误提示逻辑
- [ ] T015 [US2] 更新船期显示组件 `src/views/ScheduleView.vue` 列表项，展示船期价格

**Checkpoint**: 完成资金流闭环，购买操作与账户余额解耦

---

## Phase 5: User Story 3 - 经营数据统计与分析可视化 (Priority: P2)

**Goal**: 提供个人订单金额和流水的可视化看板

**Independent Test**: 访问统计页面，应能看到柱状图展示的不同月份订单总额及周趋势。

### Implementation for User Story 3

- [ ] T016 [P] [US3] 创建 `src/services/statsService.ts`，实现按时间、港口、用户维度的聚合计算逻辑
- [ ] T017 [P] [US3] 创建 `src/components/FundStatsChart.vue` 通用图表组件（基于 vue-chartjs）
- [ ] T018 [US3] 创建 `src/views/AnalyticsView.vue`，集成多个统计图表
- [ ] T019 [US3] 在 `src/router.ts` 中增加统计分析页面的路由配置

**Checkpoint**: 统计功能就绪，支持可视化展示

---

## Phase 6: User Story 4 - 热门船期推荐与快速搜索 (Priority: P3)

**Goal**: 在侧边栏展示最近 7 天热门航线并支持一键填充

**Independent Test**: 产生一笔新订单后，在搜索页侧边栏应能立即看到该航线排名上升。点击后搜索框自动填充出发/到达地。

### Implementation for User Story 4

- [ ] T020 [P] [US4] 在 `src/services/statsService.ts` 中实现滑动 7 天热门船期排行逻辑
- [ ] T021 [US4] 创建 `src/components/HotSchedules.vue` 组件，展示前 3 名的热门航线
- [ ] T022 [US4] 将 `HotSchedules.vue` 集成到 `src/views/ScheduleView.vue` 的右侧布局中

**Checkpoint**: 全部功能完备

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 性能优化与最终验证

- [ ] T023 [P] 优化图表加载动画及空数据状态展示
- [ ] T024 校验 `specs/005-user-funds-stats/quickstart.md` 中的演示流程
- [ ] T025 执行全局代码清理及 TypeScript 类型完善

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖，立即开始
- **Foundational (Phase 2)**: 依赖 Phase 1 
- **User Stories (Phase 3+)**: 依赖 Phase 2 完成。US1 和 US2 是核心业务流，建议优先完成。

### Parallel Opportunities

- T004, T005, T008 (当 Phase 2 基础结构确定后) 可并行。
- 不同用户故事的服务层计算逻辑 (US3, US4) 可在 `statsService.ts` 中并行开发。

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. 完成 Phase 1 & 2。
2. 完成 US1 (资金操作) -> 用户可以充值。
3. 完成 US2 (支付集成) -> 用户可以消费。
4. **验证核心链路**: 充值 -> 余额 -> 购买 -> 扣费 -> 流水记录。

### Incremental Delivery

1. 基座（Phase 1 & 2）
2. 资金管理逻辑（US1）
3. 支付逻辑注入（US2）
4. 数据可视化（US3）
5. 辅助推荐功能（US4）
