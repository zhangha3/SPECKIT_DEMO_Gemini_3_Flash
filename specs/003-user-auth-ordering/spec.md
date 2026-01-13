# Feature Specification: 用户登录、舱位购买及订单查询

**Constitution Reminder**:
- 优先使用**中文**编写所有文档。
- 所有的图表必须使用 **Mermaid** 语法。
- 新出现的术语请及时更新至 `.specify/memory/glossary.md`。

**Feature Branch**: `003-user-auth-ordering`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "在该项目的原功能之上，我需要添加以下功能：1. 用户登录页面...2. 舱位购买功能...3. 订单查询功能..."

## Clarifications

### Session 2026-01-13
- Q: 用户登录会话如何持久化？ → A: 使用 SessionStorage，仅在当前标签页有效。
- Q: 购买时的库存扣减如何处理并发？ → A: 前端简单校验，点击购买前检查内存值。
- Q: 订单详情数据是否快照？ → A: 全量快照购买时刻的所有船期字段数据。
- Q: 购买成功的后续行为？ → A: 留在当前页显示提示并更新本地库存展示。
- Q: 订单查询页面初始化显示什么？ → A: 默认展示本人所有订单列表，按时间倒序。
- Q: 默认用户初始化逻辑？ → A: 持久化存储，仅在首次运行或 users.json 为空时初始化。
- Q: 订单号生成规则？ → A: 采用 `ORD-YYYYMMDD-XXXX` 时间戳格式。
- Q: 库存不足时的 UI 表现？ → A: 按钮变灰禁用并显示“暂无库存”。
- Q: 是否支持修改密码？ → A: 不支持，仅限初始分配的密码。
- Q: 订单列表排序规则？ → A: 最新订单优先（按时间倒序）。

## User Scenarios & Testing *(mandatory)*
// ...existing code...
### User Story 1 - 用户登录与权限控制 (Priority: P1)

作为一名访客，我希望能够通过用户名和密码登录系统，并通过 SessionStorage 维持会话，以便访问系统功能。

**Why this priority**: 登录是所有后续功能的前提，确保数据的安全性和用户关联。

**Independent Test**: 用户在未登录时访问主页应被重定向到登录页；输入正确的默认用户凭据后应能成功进入系统；关闭标签页后重新打开应需重新登录。

**Acceptance Scenarios**:
// ...existing code...
### User Story 2 - 船期库存展示与舱位购买 (Priority: P1)

作为一名已登录用户，我希望在查看船期时能看到剩余库存，并在有库存时购买舱位。

**Why this priority**: 这是该功能的核心业务流程。

**Independent Test**: 搜索船期结果中应包含库存列；库存为 0 时购买按钮应为禁用状态；点击购买后，停留原页面并看到库存更新。

**Acceptance Scenarios**:

1. **Given** 船期查询结果页面, **When** 船期库存为 99, **Then** 显示“库存：99”和“购买”按钮（可用）。
2. **Given** 船期库存为 0, **When** 查看该船期, **Then** “购买”按钮变更为“暂无库存”且为禁用状态（不可点击）。
3. **Given** 用户点击“购买”按钮, **When** 购买操作成功, **Then** 弹出包含订单号的成功提示，原页面库存减 1。

---

### User Story 3 - 我的订单查询 (Priority: P2)

作为一名已登录用户，我希望能够查询自己购买过的订单。

**Why this priority**: 用户需要确认购买结果。

**Independent Test**: 进入订单查询页，应默认列出当前用户的所有订单，按时间倒序排列。输入订单号搜索应能精确定位。

**Acceptance Scenarios**:

1. **Given** 订单查询页面, **When** 页面加载, **Then** 默认按时间倒序展示本人所有的订单列表。
2. **Given** 订单查询页面, **When** 输入有效的本人订单号并搜索, **Then** 展示该订单的完整快照信息（包含购买时的船期详情）。
3. **Given** 订单查询页面, **When** 输入他人订单号, **Then** 提示未找到相关订单。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系统必须提供登录页面，支持输入用户名和密码。
- **FR-002**: 系统必须初始化5个默认用户信息，保存于 `users.json`，密码采用明文存储供演示使用。如果文件已存在且不为空，则跳过初始化。
- **FR-003**: 船期数据（`schedules.json`）必须增加 `inventory` 字段，默认值为 99。
- **FR-004**: 系统必须在船期列表中展示当前剩余库存。
- **FR-005**: 只有库存 > 0 时，“购买”按钮才可用，否则按钮禁用并显示为“暂无库存”。
- **FR-006**: 购买成功后通过 SessionStorage 保存登录态。
- **FR-007**: 点击购买时，系统生成订单并持久化到 `orders.json`。订单必须包含全量船期数据快照，订单号格式为 `ORD-YYYYMMDD-XXXX`。
- **FR-008**: 订单查询页面默认展示本人订单列表，按时间降序（最新在前）排列。
- **FR-009**: 系统必须实现登出功能，清除 SessionStorage。

### Key Entities

- **User**: 代表系统用户。包含 `username`, `password`, `email`, `country`。
- **Schedule**: 代表船期。在原基础上增加 `inventory` (int) 属性。
- **Order**: 代表一笔购买记录。包含：
    - `orderId`: 字符串，格式 `ORD-YYYYMMDD-XXXX`。
    - `userName`: 字符串，下单人用户名。
    - `orderTime`: ISO 格式的时间戳。
    - `scheduleSnapshot`: 对象，包含购买时船期所有的原始字段（避免原始船期变更导致订单信息不符）。

## Success Criteria *(mandatory)*
// ...existing code...
### Measurable Outcomes

- **SC-001**: 登录/登出操作响应时间小于 500ms。
- **SC-002**: 购买操作后，用户在 1s 内收到反馈且当前页面库存显示已更新。
- **SC-003**: 100% 的购买行为都会成功持久化，并在应用重启后可查。
- **SC-004**: 订单查询能准确展示该订单被创建时的全量船期快照信息。

## Assumptions

- 初始化的5个用户数据在项目首次启动时生成。
- 订单号采用 `ORD-YYYYMMDD-XXXX` 格式。
- 密码在 demo 环境下采用明文存储。
- 登录态仅通过 SessionStorage 维持，不涉及后端真正的 session/token 校验。


## User Scenarios & Testing *(mandatory)*

### User Story 1 - 用户登录与权限控制 (Priority: P1)

作为一名访客，我希望能够通过用户名和密码登录系统，以便访问船期查询和购买功能。

**Why this priority**: 登录是所有后续功能的前提，确保数据的安全性和用户关联。

**Independent Test**: 用户在未登录时访问主页应被重定向到登录页；输入正确的默认用户凭据后应能成功进入系统。

**Acceptance Scenarios**:

1. **Given** 用户未登录, **When** 访问系统功能页面, **Then** 系统跳转至登录页面。
2. **Given** 用户在登录页面输入正确的用户名和密码, **When** 点击登录, **Then** 登录成功并跳转至系统首页。
3. **Given** 用户已登录, **When** 点击登出, **Then** 清除会话并跳转回登录页面。

---

### User Story 2 - 船期库存展示与舱位购买 (Priority: P1)

作为一名已登录用户，我希望在查看船期时能看到剩余库存，并在有库存时购买舱位。

**Why this priority**: 这是该功能的核心业务流程。

**Independent Test**: 搜索船期结果中应包含库存列；点击购买后，库存应减少1，并提示购买成功。

**Acceptance Scenarios**:

1. **Given** 船期查询结果页面, **When** 船期库存为 99, **Then** 显示“库存：99”和“购买”按钮。
2. **Given** 船期库存为 0, **When** 查看该船期, **Then** “购买”按钮变更为“暂无库存”且不可点击。
3. **Given** 用户点击“购买”按钮, **When** 购买操作成功, **Then** 对应船期库存减1，并生成一条订单记录。

---

### User Story 3 - 我的订单查询 (Priority: P2)

作为一名已登录用户，我希望能够查询自己购买过的订单，以便核对交易信息。

**Why this priority**: 用户需要确认购买结果。

**Independent Test**: 在订单查询页面输入订单号，应能准确展示该订单的所有详细字段。

**Acceptance Scenarios**:

1. **Given** 订单查询页面, **When** 输入有效的本人订单号并搜索, **Then** 展示订单号、下单用户、下单时间、船期详情等信息。
2. **Given** 订单查询页面, **When** 输入他人订单号或无效订单号, **Then** 提示未找到相关订单（系统严格限制只能查询本人订单）。

## Requirements *(mandatory)*
// ...existing code...
### Functional Requirements

- **FR-001**: 系统必须提供登录页面，支持输入用户名和密码。
- **FR-002**: 系统必须初始化5个默认用户信息，包含用户名、密码（明文形式存储于 JSON 以便演示）、邮箱、所在国家，并保存于 `users.json`。
- **FR-003**: 船期数据（`schedules.json`）必须增加 `inventory` 字段，默认值为 99。
// ...existing code...
- **FR-007**: 系统必须实现订单查询功能，支持按订单号精确查询，且仅限查询当前登录用户的订单。
- **FR-008**: 系统必须实现登出功能，确保用户凭据安全。
// ...existing code...
## Assumptions

- 初始化的5个用户数据在项目首次启动时生成或预置在 `users.json` 中。
- 订单号采用简单的字符串格式，如 `ORD-YYYYMMDD-XXXX`。
- 密码在 demo 环境下采用明文存储。


## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系统必须提供登录页面，支持输入用户名和密码。
- **FR-002**: 系统必须初始化5个默认用户信息，包含用户名、密码（[NEEDS CLARIFICATION: 是否允许明文存储？]）、邮箱、所在国家，并保存于 `users.json`。
- **FR-003**: 船期数据（`schedules.json`）必须增加 `inventory` 字段，默认值为 99。
- **FR-004**: 系统必须在船期列表中展示当前剩余库存。
- **FR-005**: 只有库存 > 0 时，“购买”按钮才可用。
- **FR-006**: 点击购买时，系统必须生成唯一的订单号，记录下单人、时间及船期快照，并持久化到 `orders.json`。
- **FR-007**: 系统必须实现订单查询功能，支持按订单号精确匹配。
- **FR-008**: 系统必须实现登出功能，确保用户凭据安全。

### Key Entities

- **User**: 代表系统用户。包含 `username`, `password`, `email`, `country`。
- **Schedule**: 代表船期。在原基础上增加 `inventory` 属性。
- **Order**: 代表一笔购买记录。包含 `orderId`, `userName`, `orderTime`, `scheduleDetails`（包含始发港、目的港、船名等关键信息的快照）。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 登录/登出操作响应时间小于 500ms。
- **SC-002**: 购买操作后，本地 JSON 数据的库存扣减和订单生成在 1s 内完成并对用户可见。
- **SC-003**: 100% 的购买行为都会成功持久化，用户重启应用后订单数据依然存在。
- **SC-004**: 订单查询能准确展示该订单被创建时的船期快照信息。

## Assumptions

- 初始化的5个用户数据在项目首次启动时生成或预置在 `users.json` 中。
- 订单号采用简单的字符串格式，如 `ORD-YYYYMMDD-XXXX`。
- 密码在 demo 环境下采用 [NEEDS CLARIFICATION: 加密还是明文？] 方式存储。
