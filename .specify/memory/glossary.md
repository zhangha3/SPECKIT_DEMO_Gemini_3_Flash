# 项目术语表 (Glossary)

本文档用于记录项目中的专有名词、业务术语和技术定义，以确保团队沟通的一致性。

## 术语列表

| 术语 | 定义 | 备注 |
| :--- | :--- | :--- |
| Speckit | 一个基于文档驱动开发的自动化工具集合。 | |
| Constitution | 项目宪法，定义了项目的核心原则和治理规范。 | |
| Spec | 需求规格说明书。 | |
| Plan | 实施方案/执行计划。 | |
| Tasks | 任务列表。 | |
| UN/LOCODE | 联合国贸易和运输地点代码 (United Nations Code for Trade and Transport Locations) | |
| 模糊查询 | 指搜索关键词只需包含在目标文本中即可匹配 | |
| IANA Timezone | 互联网号码指派局 (Internet Assigned Numbers Authority) 维护的时区数据库格式，如 'Asia/Shanghai' | |
| 港口代码 | 即 UN/LOCODE | |
| ETD | 预计发运时间 (Estimated Time of Departure) | 航运核心时间节点 |
| 运输耗时 (Duration) | 船舶从起运港到目的港所需的平均天数 | |
| 承运人 (Carrier) | 负责运输貨物的航运公司，如马士基(Maersk)、中远海运(COSCO) | |
| 船名 (Vessel Name) | 具体执行航次的船舶名称 | |
| 订单号 (Order ID) | 用于唯一标识一笔订单的编码，格式为 `ORD-YYYYMMDD-XXXX` | 新增 |
| 库存 (Inventory) | 对应船期可供购买的剩余舱位数量 | 新增 |
| 订单快照 (Order Snapshot) | 在下单时刻记录的船期详细信息副本，确保历史订单展示不受基础数据变更影响 | 新增 |
| 登录态 (Session State) | 用户登录后的会话状态，本项目中使用 SessionStorage 维持 | 新增 |
| 本地存储 (LocalStorage) | 浏览器提供的持久化存储，用于模拟后端数据库保存用户、库存和订单数据 | 新增 |
| 种子数据 (Seed Data) | 系统首次启动时用于初始化数据的 JSON 文件内容 | 新增 |
| 资金账户 (Fund Account) | 用户用于存放人民币(CNY)的虚拟账户，支持充值、退款和购买支付 | 新增 |
| 资金密码 (Fund Password) | 独立于登录密码的 6 位数字，用于验证资金变动操作，默认为 123456 | 新增 |
| 交易流水 (Transaction Log) | 记录账户资金变动的日志，包括类型、金额、变动后余额等信息 | 新增 |
| 热门船期 (Hot Schedules) | 基于最近滑动 7 天内订单量统计出的成交前 3 的去重航线 | 新增 |
| 滑动统计 (Rolling Statistics) | 以当前时刻为起点，向过去推算固定时长(如 168 小时)的统计方式 | 新增 |
