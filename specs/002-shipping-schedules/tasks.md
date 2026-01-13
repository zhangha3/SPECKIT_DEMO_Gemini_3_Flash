# Tasks: 航运船期查询功能

**Feature**: 航运船期查询功能 (Shipping Schedule Query)
**Branch**: `002-shipping-schedules`
**Implementation Strategy**: MVP 首先实现数据层及路由架构，随后分步实现自动补全和核心查询页面。

## Phase 1: Setup
目标：配置路由与项目结构基础。

- [X] T001 安装必要依赖 `vue-router@4`
- [X] T002 在 `src/router.ts` 中根据 `plan.md` 配置基础路由
- [X] T003 创建 `src/views/HomeView.vue` 并迁移 `App.vue` 中的原有港口查询逻辑
- [X] T004 修改 `src/App.vue` 以支持 `<router-view>` 和顶部导航栏
- [X] T005 [P] 在 `src/models/schedule.ts` 中定义船期实体接口

## Phase 2: Foundational
目标：准备及校验核心数据集。

- [X] T006 [P] 在 `src/assets/schedules.json` 中准备 30+ 条主流航线船期数据
- [X] T007 [P] 更新 `src/assets/ports.json` 包含船期数据中涉及的所有港口（补全缺失港口）
- [X] T008 [P] 在 `src/composables/usePorts.ts` 中实现多字段模糊匹配逻辑（FR-004）
- [X] T009 [P] 创建 `src/composables/useSchedules.ts` 用于处理船期数据加载与联合过滤逻辑（FR-006）

## Phase 3: User Story 2 - 起运港/目的港自动补全 (Priority: P2)
目标：实现可复用的港口自动补全组件。

- [X] T010 [Story] [US2] 为 `src/composables/usePorts.ts` 编写模糊查询逻辑的单元测试
- [X] T011 [P] [Story] [US2] 创建 `src/components/PortAutocomplete.vue` 组件，使用 Tailwind 实现下拉列表
- [X] T012 [Story] [US2] 实现输入字符 >= 2 触发检索及防抖逻辑（SC-002）

## Phase 4: User Story 1 & 3 - 航运船期基础查询与筛选 (Priority: P1/P2)
目标：实现核心查询页面与结果展示。

- [X] T013 [Story] [US1] [US3] 创建 `src/views/ScheduleView.vue` 基础页面布局，包含起运港、目的港与 ETD 范围表单
- [X] T014 [Story] [US1] 集成 `PortAutocomplete.vue` 到查询表单中
- [X] T015 [Story] [US1] [US3] 实现多条件联合查询逻辑，支持起/目的港任意填其一即可查询（FR-006）
- [X] T016 [P] [Story] [US1] 创建 `src/components/ScheduleList.vue` 用于展示航班结果，包括船名、承运商等（FR-010）
- [X] T017 [Story] [US1] 在 `ScheduleList.vue` 中集成标准分页功能（FR-009）
- [X] T018 [Story] [US1] 格式化 ETD 字段显示方案：起运港当地时间 + 时区标注（FR-008）

## Phase 5: Polish & Cross-cutting Concerns
目标：优化性能、响应式及边缘处理。

- [X] T019 优化 `ScheduleView.vue` 在移动端的响应式布局（SC-005）
- [X] T020 实现“未找到结果”的友好提示逻辑
- [X] T021 验证数据一致性硬约束：若港口主表缺失对应代码，则过滤掉该船期数据（FR-007）
- [ ] T022 执行全量单元测试及界面验收检查

## Dependencies & Parallelism
1. **依赖关系**: US1/US3 的实现依赖于 US2（自动补全组件）和 Foundational（数据逻辑层）的完成。
2. **并行机会**: 
   - T005, T006, T007 可以并行执行（模型与数据准备）。
   - T008 和 T009 的核心逻辑实现可以并行执行。
   - UI 组件 `ScheduleList.vue` (T016) 的单纯结构开发可与逻辑集成并行。

## Implementation Strategy
- **MVP**: 先跑通 `HomeView` 和 `ScheduleView` 的路由切换，然后填充 `schedules.json`，最后实现表单过滤。
- **Incremental**: 自动补全组件先实现搜索，再对接下拉。分页功能放在结果渲染之后集成。
