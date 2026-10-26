# 外链建设素材包（Link Building Kit）

目标：为 minecraftcirclegen.com 获取真实外链，解锁 Google 对新页面（特别是 "Discovered - currently not indexed" 页面）的爬取预算。所有渠道经过验证真实存在；发帖前先读该社区的版规。

## 原则

1. **分享作品，不是发广告**。Reddit 和 Minecraft 社区对纯推广极度敏感——以"我做了个东西/我写了篇指南"的展示口吻，链接是内容的一部分而不是目的。
2. **10:1 法则**：发布账号在自推内容之外，需要有大量正常的社区参与（评论、回答、作品图）。
3. **一次一个渠道，观察反馈再复制**。先发效果最可能的帖子，根据评论改进下一帖。

## 一、Reddit（最高优先级）

### 目标版块

| Subreddit | 适合的内容 | 注意 |
|---|---|---|
| r/MinecraftBuilds | 圆形图表页、house blueprints、sphere 逐层指南 | 以"作品展示"形式发，图为主，链接放评论区或帖内自然位置 |
| r/Minecraft | 圆图表/坐标玩法类指南 | 版规严格，先读 sidebar；避免纯工具帖 |
| r/MinecraftCommands | 传送门计算器的 /fill、/tp 命令输出 | 以命令技巧角度切入 |

### 帖子草稿 1（r/MinecraftBuilds，配图帖）

标题：`I made a printable chart of every common circle size (7 to 101 blocks) with exact block counts`

正文：我一直在手工数格子建圆形，索性把生成器的算法做成了静态图表库，每个直径都标了精确方块数（空心/实心两套），可以直接照着格子放。附上 21 格圆的例子——56 块。欢迎挑错。链接：https://minecraftcirclegen.com/minecraft-circle-chart

配图：截取 circle-chart-21.svg 的渲染 + 一张游戏内建好的圆（**等你的游戏内实拍**）。

### 帖子草稿 2（r/Minecraft 或 r/MinecraftBuilds）

标题：`Layer-by-layer sphere plans: a 21-block sphere is exactly 1,082 blocks`

正文：整理了 15/21/31 三种直径球的逐层蓝图和精确材料数（21 空心球正好 1,082 块，实心要 4,945），逐层网格可以直接照抄。链接：https://minecraftcirclegen.com/guides/sphere-layer-guide

### 帖子草稿 3（r/MinecraftCommands）

标题：`Nether portal math cheat sheet: /tp + /fill frame commands at the exact converted coordinates`

正文：做了个下界传送门坐标换算器，输出目标坐标、`/execute in minecraft:the_nether run tp @s X Y Z`，以及 4 条门框 `/fill` 指令（含 Java/Bedrock 搜索半径差异说明：16 块 vs 128 块）。链接：https://minecraftcirclegen.com/nether-portal-calculator

### 时机与节奏

- 目标时区美东晚间（北京时间 21:00–01:00）发帖曝光最好。
- 每周不超过 1–2 条自推帖；中间穿插正常参与。

## 二、资源导航站与列表页

| 渠道 | 方式 | 状态 |
|---|---|---|
| [Planet Minecraft](https://www.planetminecraft.com) | 注册后 "Post Article/Blog"，把圆图表或逐层指南改写成社区帖（附链接） | 可立即执行 |
| [awesomeminecraft.com](https://github.com/uberswe/awesomeminecraft.com)（263+ 资源的集合站，GitHub 仓库收 PR） | 提交 PR 把工具站加进 community sites/tools 分类 | 需 GitHub 账号 |
| Minecraft 相关 awesome lists（如 [Incendo/awesome-minecraft](https://github.com/Incendo/awesome-minecraft)） | 注意：该列表只收开源软件，本站不适用；遇到收"网站/工具"的列表再提交 | 筛选中 |
| Minecraft 服务端/建筑 Discord 社区 | 在建筑频道分享蓝图图表（先活跃后分享） | 长期 |

## 三、外联邮件（博客主/列表页作者）

很多 "minecraft circle chart" 类博客文章已经链接了 donatstudios 和 plotz——这些页面是最精准的外联对象（它们已经愿意链接这类工具）。

**找候选的方法**：Google 搜 `minecraft circle chart`、`minecraft circle templates`、`minecraft sphere generator`，跳过你自己的竞品首页，收集**汇总类文章和博客**（不是工具页本身）。

**邮件模板**：

> Subject: Circle chart with exact block counts — worth adding to your Minecraft tools list?
>
> Hi [name], I noticed your [article] lists [donatstudios/plotz] for circle charts. I run minecraftcirclegen.com — a circle generator with a printable chart library covering every common diameter (7–101 blocks) with exact outline AND filled block counts, plus layer-by-layer sphere and dome plans. All block counts are computed, not hand-typed.
>
> If it fits your list, here's the chart page: https://minecraftcirclegen.com/minecraft-circle-chart
>
> Either way, thanks for maintaining the list.

**节奏**：每周 5–10 封，个性化第一句（提到对方列表里已有的具体条目），转化率预期 5–10%。

## 四、衡量

- GSC → 链接报告：跟踪外部链接的 referring domains 数量变化（当前几乎为零，这是主要瓶颈）。
- 每次发帖/外联记录日期与 URL，4 周后对照 GSC 曝光。
