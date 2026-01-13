# Feature Specification: 航运船期查询功能 (Shipping Schedule Query)

**Constitution Reminder**:
- 优先使用**中文**编写所有文档。
- 所有的图表必须使用 **Mermaid** 语法。
- 新出现的术语请及时更新至 `.specify/memory/glossary.md`。

**Feature Branch**: `002-shipping-schedules`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "增加航运船期数据及查询功能，支持多条件筛选及港口自动补全"

## Clarifications

### Session 2026-01-13
- Q: 功能入口与集成方式 → A: 独立路由页面。
- Q: 数据自动补全的匹配范围 → A: 全字段模糊匹配（中文/英文/代码）。
- Q: 船期数据一致性策略 → A: 引用一致性硬约束（港口代码必须在港口主表中存在）。
- Q: 查询条件必填性约束 → A: 任意必填（起运港或目的港只要填一个即可查询）。
- Q: 运输耗时的计算逻辑 → A: 静态固定天数（Duration）。
- Q: 结果排序逻辑 → A: 按 ETD 时间升序（由近及远）。
- Q: 时间显示格式 → A: 显示起运港当地时间，并标注时区标识。
- Q: 模拟数据策略 → A: JSON 中写死固定日期。
- Q: 列表加载方式 → A: 标准分页，带翻页器。
- Q: 船名显示层级 → A: 在结果列表中直接显示。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 航运船期基础查询 (Priority: P1)

作为一名货运代理，我希望能够通过起运港和目的港查询航运动态，以便为客户选择合适的航班。

**Why this priority**: 这是该功能的核心价值，满足用户最基础的业务查询需求。

**Independent Test**: 用户在查询页面输入起运港和目的港（手动输入或选择），点击查询后能够看到符合条件的航班列表。

**Acceptance Scenarios**:

1. **Given** 数据库中存在从上海(CNSHA)到洛杉矶(USLAX)的船期，**When** 用户在起运港输入"上海"、目的港输入"洛杉矶"并搜索，**Then** 系统应列出所有相关的航班信息。
2. **Given** 用户未选择任何条件，**When** 用户点击查询，**Then** 系统应提示请输入查询条件或展示默认列表（视UX设计而定，此处暂定为提示）。

---

### User Story 2 - 起运港/目的港自动补全 (Priority: P2)

作为一名用户，在输入港口名称时，我希望系统能自动提示符合条件的港口，以减少输入错误并提高查询效率。

**Why this priority**: 提升用户体验，确保查询条件的准确性，尤其是港口代码或名称拼写复杂时。

**Independent Test**: 在起运港或目的港输入框输入至少2个字符，系统应弹出下拉列表展示匹配的港口。

**Acceptance Scenarios**:

1. **Given** 用户在起运港输入框输入 "Sha"，**When** 等待片刻，**Then** 系统下拉列表应显示 "Shanghai (CNSHA)" 等匹配项。
2. **Given** 用户输入的字符少于2个，**When** 停止输入，**Then** 系统不应触发自动补全。

---

### User Story 3 - 基于ETD时间的精确筛选 (Priority: P2)

作为一名计划员，我需要查找特定日期范围内的航班，以便配合生产计划安排出货。

**Why this priority**: 航运业务对时间高度敏感，日期筛选是实际业务中的高频需求。

**Independent Test**: 用户选择 ETD 起始日期和结束日期，查询结果应仅包含该时间段内的航班。

**Acceptance Scenarios**:

1. **Given** 存在 2026-02-01 和 2026-02-15 的航班，**When** 用户设置 ETD 起始为 2026-02-01，结束为 2026-02-10，**Then** 系统仅显示 2026-02-01 的航班。

---

### User Story 4 - 船期数据持久化与扩展 (Priority: P3)

作为系统管理员，我希望能够预置主流船期数据，并确保数据中涉及的港口在系统中已有定义。

**Why this priority**: 确保系统上线即有可用数据，且数据一致性得到保证。

**Independent Test**: 检查 `schedules.json` 包含至少30条数据，且涉及的所有港口都在 `ports.json` 中定义。

**Acceptance Scenarios**:

1. **Given** 新增了一条涉及 "釜山 (KRPUS)" 的船期，**When** 系统初始化时，**Then** `ports.json` 中应包含 "KRPUS" 的元数据。

---

### Edge Cases

- **搜索无匹配**: 当查询条件无任何匹配船期时，系统应友好提示“未找到符合条件的船期”。
- **起止时间倒置**: 当用户选择的 ETD 结束时间早于起始时间时，系统应报错或自动修正。
- **港口代码不存在**: 虽有自动补全，但若用户直接粘贴不存在的代码，查询应能处理并提示错误。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系统必须提供航运船期查询功能，通过独立的路由页面展示，并提供清晰的导航入口。
- **FR-002**: 船期数据必须存储在 JSON 文件中（例如 `schedules.json`），包含：起运港代码、目的港代码、ETD（日期+时间）、运输时长（天）、承运人名称（Carrier）。
- **FR-003**: 船期数据量不得少于 30 条，且涵盖全球主流航线（如：远东-北美、远东-欧洲、东南亚航线等）。
- **FR-004**: 港口输入框必须支持本地模糊匹配，触发条件为输入字符长度 >= 2，支持匹配港口的中文名、英文名及代码。
- **FR-005**: 自动补全下拉列表应显示港口的中文名、英文名及 5 位海关代码。
- **FR-006**: 查询逻辑必须支持多条件组合：起运港、目的港或其一为必填项，辅以 ETD 时间范围筛选。查询结果默认按 ETD 时间升序排列。
- **FR-007**: 系统内联数据一致性：`schedules.json` 中引用的所有港口代码必须在 `ports.json` 中预先定义，不满足一致性的船期数据不予加载。
- **FR-008**: 运输耗时在界面上以固定的天数形式展示。ETD 时间显示为起运港当地时间，并明确标注时区标识。
- **FR-009**: 船期查询结果列表必须支持标准分页功能，每页显示数量由开发根据前端组件库默认配置确定（建议 10 或 20 条）。
- **FR-010**: 船期列表单行信息中必须直接展示“船名（Vessel Name）”以及“承运商（Carrier）”。

## Success Criteria *(mandatory)*

- **SC-001**: 用户能在 3 秒内从首页导航到独立的船期查询页面并看到初始界面。
- **SC-002**: 自动补全在输入停止后的 300ms 内展示匹配（中文/英文/代码）结果。
- **SC-003**: 系统预置的船期数据不少于 30 条，引用的港口在 `ports.json` 中 100% 存在。
- **SC-004**: 在仅输入起运港或仅输入目的港的情况下，系统应在 500ms 内返回正确的船期列表。
- **SC-005**: 页面在移动端和桌面端均能正常布局和操作，符合响应式设计要求。

## Key Entities *(if data involved)*

### Port (港口) - 沿用并合并新数据
- code: 5位港口代码 (Unique ID)
- name_cn: 中文名称
- name_en: 英文名称
- country: 国家
- timezone: 时区

### Schedule (航运船期)
- id: 唯一标识
- origin_port: 起运港代码
- destination_port: 目的港代码
- etd: 计划发运时间 (ISO 8601 格式)
- duration: 运输耗时 (单位：天)
- carrier: 承运公司名称 (e.g., "Maersk", "COSCO")
- vessel_name: [选填] 船名

## Assumptions

- 数据为静态模拟数据，不涉及实时 API 对接。
- 运输时长为固定天数，不考虑动态延误。
- 搜索匹配为不区分大小写的子串匹配。
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]
