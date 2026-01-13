# Quickstart: 航运船期查询功能

## 如何查看此功能？

1. **安装依赖**:
   ```bash
   npm install vue-router@4
   ```

2. **启动开发服务器**:
   ```bash
   npm run dev
   ```

3. **访问路由**:
   - 首页: `/` (保留原有港口查询)
   - 船期查询页面: `/schedules` (由顶部导航或点击切换)

## 测试计划

### 1. 自动补全测试
- 在起运港输入 "Sha"，应提示 "Shanghai / 上海 (CNSHA)"。
- 在目的港输入 "24"，不应触发提示。
- 选择提示项，输入框应填入对应的港口代码。

### 2. 查询过滤测试
- 选择起运港 "Shanghai"，点击查询，列出所有上海出发的船期。
- 进一步选择目的港 "Los Angeles"，点击查询，范围缩小。
- 设置 ETD 日期跨度，验证结果是否在范围内且按日期排序。

### 3. 数据一致性检查
- 检查 `schedules.json` 中每个航班的 `origin_port` 和 `destination_port` 都能在 `ports.json` 中找到详细信息。
