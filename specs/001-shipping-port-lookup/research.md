# Research: 001-shipping-port-lookup

## Decision Log

### 1. 前端框架选择
- **Decision**: Vue 3 (Composition API) + Vite
- **Rationale**: 用户明确要求 Vue + TypeScript。Vite 提供了极快的开发体验和现代的构建管道。
- **Alternatives considered**: None (User directed)

### 2. 搜索逻辑实现
- **Decision**: 使用 Computed 属性配合正则进行过滤。
- **Rationale**: 100个港口的数据量极小，完全可以在前端内存中进行高效搜索和排序。
- **Auto-Detection Logic**: 
  - `const isExactCode = /^[A-Z]{5}$/i.test(query)`
  - 如果匹配，则执行 `port.code.toUpperCase() === query.toUpperCase()`
  - 否则执行 `port.name_cn.includes(query) || port.name_en.toLowerCase().includes(query.toLowerCase())`

### 3. 分页实现
- **Decision**: 手动计算切片 `allResults.slice(offset, offset + limit)`。
- **Rationale**: 简单直接，无需引入额外的分页库。

### 4. 样式框架
- **Decision**: Tailwind CSS
- **Rationale**: 能够快速实现“简洁且现代”的 UI，且易于定制。用户未指定具体组件库，Tailwind 提供最大的灵活性。

### 5. 异常处理
- **Decision**: `try-catch` 包裹 `fetch` 调用，配合 Vue 的 `ref<boolean>` 状态控制 UI 禁用。

## 技术栈最佳实践 (Vue 3 + Vitest)
- **组件化**: 保持组件单一职责。
- **类型安全**: 定义严格的 `interface Port`。
- **测试**: 使用 Vitest 测试 `usePorts` composable 的搜索滤波逻辑，确保边界情况（如空输入、特殊字符）得到处理。
