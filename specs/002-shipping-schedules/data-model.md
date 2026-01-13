# Data Model: 航运船期查询功能

## Entities

### Port (港口)
| 字段 | 类型 | 说明 | 校验规则 |
|---|---|---|---|
| code | string | 5位大写字母港口代码 (UN/LOCODE) | 必须唯一 |
| name_cn | string | 中文名称 | 非空 |
| name_en | string | 英文名称 | 非空 |
| country | string | 国家 | - |
| timezone | string | 时区 (如 Asia/Shanghai) | 必须符合 IANA 格式 |

### Schedule (航运船期)
| 字段 | 类型 | 说明 | 校验规则 |
|---|---|---|---|
| id | string | 唯一标识符 | UUID/ShortID |
| origin_port | string | 起运港代码 | 必须存在于 Ports |
| destination_port | string | 目的港代码 | 必须存在于 Ports |
| etd | string | 计划发运时间 | ISO 8601 (YYYY-MM-DDTHH:mm:SSZ) |
| duration | number | 运输耗时 (天) | 正整数 |
| carrier | string | 承运人 (Carrier) | 非空 |
| vessel_name | string | 船名 | 非空 |

## Relationships
- **Schedule -> Port (Origin)**: Many-to-one.
- **Schedule -> Port (Destination)**: Many-to-one.

## State Transitions (Query Only)
1. **Idle**: 初始页面，显示查询表单。
2. **Searching**: 用户点击查询，根据起/目的港及时间范围在 JSON 中进行内存索引。
3. **Empty**: 匹配结果为 0，显示提示。
4. **Populated**: 显示分页后的航班列表。
