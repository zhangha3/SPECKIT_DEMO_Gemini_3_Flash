# Data Model: 001-shipping-port-lookup

## Entities

### Port (港口)
代表全球航运中的一个港口节点。

| Field | Type | Description | Validation |
| :--- | :--- | :--- | :--- |
| `code` | String | UN/LOCODE (5位大写字母) | 必须匹配 `^[A-Z]{5}$` |
| `name_cn` | String | 中文名称 | 必填 |
| `name_en` | String | 英文名称 | 必填 |
| `country` | String | 所属国家名称/代码 | 必填 |
| `timezone` | String | IANA 时区 (如 Asia/Shanghai) | 必须是有效的 IANA string |

## JSON Schema (Static Data Source)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "code": { "type": "string" },
      "name_cn": { "type": "string" },
      "name_en": { "type": "string" },
      "country": { "type": "string" },
      "timezone": { "type": "string" }
    },
    "required": ["code", "name_cn", "name_en", "country", "timezone"]
  }
}
```

## State Transitions
由于是静态查询应用，不涉及复杂的状态转移，仅包含：
- **Initial**: 应用启动，开始加载 JSON。
- **Error**: JSON 加载失败，进入异常状态（UI 禁用）。
- **Ready**: 数据加载完成，等待用户搜索。
- **Searching**: 用户输入后执行过滤并分页展示。
