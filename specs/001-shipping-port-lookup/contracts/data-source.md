# Data Contract: ports.json

本项目无后端 API，数据通过加载本地 `ports.json` 获取。

## 示例数据结构 (`/src/assets/ports.json`)

```json
[
  {
    "code": "CNSHA",
    "name_cn": "上海",
    "name_en": "Shanghai",
    "country": "China",
    "timezone": "Asia/Shanghai"
  },
  {
    "code": "SGSGP",
    "name_cn": "新加坡",
    "name_en": "Singapore",
    "country": "Singapore",
    "timezone": "Asia/Singapore"
  },
  {
    "code": "NLRTM",
    "name_cn": "鹿特丹",
    "name_en": "Rotterdam",
    "country": "Netherlands",
    "timezone": "Europe/Amsterdam"
  }
]
```

## 数据约束
- 文件编码必须为 UTF-8。
- `code` 字段作为唯一标识符。
