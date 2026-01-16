# Implementation Plan: 用户资金账户及统计分析

**Branch**: `005-user-funds-stats` | **Date**: 2026-01-14 | **Spec**: [./spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-user-funds-stats/spec.md`

## Summary

本功能旨在为现有航运系统集成完整的用户资金管理与多维度统计分析能力。主要包括：
1. **资金循环**: 实现基于 CNY 的充值、退款及购买自动扣费流。
2. **数据资产**: 扩展用户模型至 localStorage 持久化，记录完整的交易流水日志。
3. **商业智能**: 基于 Chart.js 实现个人维度的订单与财务统计，并提供滑动 7 天的热门航线推荐。

## Technical Context

**Language/Version**: TypeScript 5.2, Vue 3.4
**Primary Dependencies**: Vite 5.0, Vue Router 4.6, Chart.js 4.5, Vue-chartjs 5.3, TailwindCSS 3.4
**Storage**: LocalStorage (模拟持久化), SessionStorage (管理用户会话)
**Testing**: Vitest, Vue Test Utils
**Target Platform**: Web Browser (Desktop optimized)
**Project Type**: Single Page Application (SPA)
**Performance Goals**: 统计看板图表渲染 < 500ms，热门船期计算逻辑在本地执行 < 50ms。
**Constraints**: 资金密码硬编码为 123456，不涉及真实的支付网关集成。
**Scale/Scope**: 独立资金管理页，集成在侧边栏的热门推荐，以及一个综合统计仪表盘。

## Constitution Check

*GATE: Must pass before Phase 1 design.*

- [x] **中文优先**: 计划书及后续文档均使用中文编写。
- [x] **Mermaid 图表**: 在 data-model.md 中使用了 Mermaid 描述状态机。
- [x] **术语一致性**: 已同步更新 .specify/memory/glossary.md。
- [x] **流程合规**: 严格遵循从 Spec 到 Plan 的推导过程。

## Project Structure

### Documentation (this feature)

`	ext
specs/005-user-funds-stats/
 plan.md              # 本文档 (实施方案)
 research.md          # 技术预研与最佳实践
 data-model.md        # 模型定义与日志结构
 quickstart.md        # 快速上手与演示路径
 checklists/          # 需求核对清单
 tasks.md             # 详细开发任务表
`

### Source Code (repository root)

`	ext
src/
 components/          # 新增 FundStatsChart.vue, HotSchedules.vue
 composables/         # 更新 useAuth.ts (余额状态), useSchedules.ts (购买扣费逻辑)
 models/              # 更新 user.ts, transaction.ts, order.ts
 services/            # 新增 fundService.ts, statsService.ts
 views/               # 新增 FundManagementView.vue, AnalyticsView.vue
 assets/              # 更新 users.json, schedules.json (初始计算价格)
`

**Structure Decision**: 沿用现有的单层 Vue 目录结构，在 services 层统一处理业务逻辑，在 composables 层暴露响应式状态。

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 无 | N/A | N/A |

---

## Phase 0: Outline & Research (Done)

- **Research Task**: Chart.js 与 Vue 3 的集成模式（已确定使用 ue-chartjs）。
- **Research Task**: 滑动 7 天统计的本地实现算法。
- **Consolidation**: 结果已整合至 data-model.md 中的聚合逻辑部分。

## Phase 1: Design & Contracts

### 1. 实体扩展 (data-model.md)
见 [./data-model.md](./data-model.md)。

### 2. 界面清单 (Views & Components)
- FundManagementView: 包含余额展示、充值/退款表单（含密码校验）。
- AnalyticsView: 包含 3 个主要的 Chart.js 组件。
- HotSchedulesWidget: 常驻在船期查询页侧边的推荐位。

### 3. Agent Context Update
执行脚本更新上下文环境。

---

**Output**: plan.md, data-model.md, tasks.md, glossary.md 已就绪。
