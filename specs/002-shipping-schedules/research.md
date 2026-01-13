# Research: 航运船期查询功能 (Shipping Schedule Query)

## Unknowns & Tasks

### 1. 路由方案 (Routing Strategy)
- **Question**: 現有项目没有 `vue-router`。是否需要安装以支持“独立路由页面”？
- **Research Task**: 检查项目是否适合引入 `vue-router` 或者采用简单的 `v-if` 组件切换模式（针对单页应用规模）。
- **Decision**: [TBD]
- **Rationale**: [TBD]

### 2. 自动补齐组件 (Autocomplete Component)
- **Question**: 是否使用现成的 UI 库还是手写？
- **Research Task**: 检查当前是否有安装 UI 框架（如 Element Plus, Naive UI 等）。如果没有，考虑是手写一个轻量级的还是引入一个新的。
- **Decision**: [TBD]
- **Rationale**: [TBD]

### 3. 数据一致性校验 (Data Consistency)
- **Question**: 约束 FR-007 要求 `schedules.json` 在 `ports.json` 中必须有对应记录。这是在运行时校验还是构建时校验？
- **Research Task**: 寻找最佳实践：是在 `usePorts` 或 `useSchedules` composable 中进行过滤，还是通过一个简单的脚本在构建前校验。
- **Decision**: [TBD]
- **Rationale**: [TBD]

### 4. 船期数据生成 (Schedule Data Generation)
- **Question**: 用户要求至少 30 条真实主流数据，并同步更新港口数据。
- **Research Task**: 收集全球主流航线（远东-北美、欧洲等）的港口和航程时间，生成符合要求的 JSON。
- **Decision**: [TBD]
- **Rationale**: [TBD]

## Findings

### 1. 路由方案
- **Findings**: 检查 `package.json` 发现没有 `vue-router`。项目目前结构非常紧凑。引入路由会增加复杂度，但符合“独立页面”的要求。
- **Decision**: 考虑到“独立路由页面”是已澄清的需求，决定引入 `vue-router`。

### 2. 自动补齐组件
- **Findings**: 项目目前使用了 Tailwind CSS，但没有组件库。
- **Decision**: 手写一个基于 Tailwind 的 `PortAutocomplete` 组件，以保持项目轻量，且能完全控制匹配逻辑（中/英/代码）。

### 3. 数据一致性校验
- **Findings**: 运行时的强校验可以保证 UI 不崩溃。
- **Decision**: 在加载船期数据的 Service/Composable 中实现过滤逻辑，并提供控制台警告（仅开发环境），确保 `ports.json` 是 Truth Source。

### 4. 船期数据准备
- **Findings**: 整理后的数据将涵盖上海、洛杉矶、鹿特丹、新加坡、杰贝阿里、釜山、宁波、蛇口、巴生港、安特卫普等主要港口。
- **Decision**: 创建 `src/assets/schedules.json`，并补全 `src/assets/ports.json` 中缺失的港口。

## Alternatives Considered
- **Vue Router vs Manual Switch**: 手动切换代码量少，但不利于 URL 分享和后退按键。为了“独立页面”的高级感，选择 Vue Router。
- **UI Library vs Custom Autocomplete**: 引入 Element Plus 会增加打包体积约 200KB+，手写则只需要几十行样式。

---
**Status**: All NEEDS CLARIFICATION resolved.
