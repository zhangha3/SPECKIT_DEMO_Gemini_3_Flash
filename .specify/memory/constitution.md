<!--
Sync Impact Report:
- Version change: none -> 1.0.0
- List of modified principles:
  - PRINCIPLE_1: 中文优先 (Chinese First)
  - PRINCIPLE_2: Mermaid 图表语法 (Mermaid Syntax)
  - PRINCIPLE_3: 统一术语管理 (Unified Terminology Management)
- Added sections: 开发约束 (Development Constraints), 质量保证 (Quality Assurance)
- Removed sections: PRINCIPLE_4, PRINCIPLE_5
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated)
  - .specify/templates/spec-template.md (✅ updated)
  - .specify/templates/tasks-template.md (✅ updated)
- Follow-up TODOs: None
-->

# SPECKIT DEMO (Gemini 3 Flash) Constitution

## Core Principles

### I. 中文优先 (Chinese First)
项目的所有核心文档（包括 Spec, Plan, Tasks 等）必须优先使用中文编写。确保团队成员和利益相关者对项目目标和细节有最清晰、最准确的理解，减少语言隔阂带来的歧义。

### II. Mermaid 图表语法 (Mermaid Syntax)
所有流程图、架构图、时序图等图表统统使用 Mermaid 语法嵌入到 Markdown 文档中。Mermaid 是文本化的，易于版本控制、搜索和通过 AI 生成/修改，保证了文档与代码同步更新的便利性。

### III. 统一术语管理 (Unified Terminology Management)
项目中出现的关键业务术语、技术专有名词必须统一记录在 `.specify/memory/glossary.md` 文档中并在变更过程中持续维护。避免团队沟通中的称呼混乱，确保文档和代码中的命名一致性。

## 开发约束
所有任务必须经过 Spec -> Plan -> Tasks -> Implement 的完整流程。代码提交必须遵循语义化提交规范。大型变更必须在 Plan 阶段明确复杂度及其正当性。

## 质量保证
所有的代码改动必须伴随相应的单元测试或集成测试。测试覆盖率应作为功能验收的重要指标。任何违反核心原则的代码或文档更新将不被接受。

## Governance
本宪法是项目的最高准则，优于所有其他开发实践。任何对原则的修改必须通过修订程序，记录在变更日志中，并同步更新相关的模板和指令文件。

**Version**: 1.0.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-13

