# Minecraft Circle Gen 审查记录

审查日期：2026-09-09。以下正文保留首次审查时的问题与证据；当时未修改产品代码、未部署。

**修复更新：本报告列出的 10 项问题已在本地修复，验证结果见 [修复记录](./fixes.md)。以下“未修复”“浏览器受阻”等描述仅代表首次审查时的状态。**

**结论：基础工程检查通过，但有会影响实际建造、命令执行和复制导出的错误。优先修复下列 4 项 P1，再处理 6 项 P2。**

## 检查覆盖与证据边界

- 原有 38 个测试文件、229 项测试通过；ESLint、TypeScript、Next.js 生产构建通过。
- 另编写 8 个审查复现用例，全部复现预期问题。它们断言的是当前错误行为，不能作为“功能已修好”的证明。
- 检查 32 个静态业务页面的构建 HTML，均有单一 H1、canonical 和主内容锚点；本次检查未发现无法解析的 JSON-LD、重复 ID、无法匹配本地路由/资源的站内链接或无效静态锚点。
- 另有 Name Checker、UUID Lookup、Enchanting Translator 三个动态业务页面，检查了源码和组件测试，未将其计入上述 32 页 HTML 检查。
- 16 个工具均纳入代码、现有测试和说明文案审阅；不是所有工具都完成了真实浏览器操作，也没有进行 Minecraft 客户端/服务端实机验证。
- **没有取得有效页面截图，不能评价实际桌面/移动端布局、遮挡、像素样式、触摸操作或真实浏览器下载结果，也不能声称完成了视觉审查或完整无障碍审查。**
- 内置浏览器及 Chrome 标签页连接均超时。随后读取 Chrome 原生应用界面被自动审批拒绝，理由是可能暴露与本站无关的私人标签页。已停止该路径。
- web 页面读取可用于文案核对；其中部分结果带缓存时间，不作为实时页面交互或可用性证明。robots/sitemap 的线上抓取未成功，不据此判定站点故障。未取得 Search Console、真实用户性能指标或索引数据。

## 已确认问题

### 1. P1：房屋材料表与逐层蓝图不一致

位置：[blueprints.ts](/Users/wanggang/Documents/Codex/minecraftcirclegen/content/houses/blueprints.ts:13)、[blueprint-builder.ts](/Users/wanggang/Documents/Codex/minecraftcirclegen/content/houses/blueprint-builder.ts:99)。

`blockCount` 仅对手写材料表求和，蓝图由另一套算法生成，两者没有共同数据源。8 套房屋都使用这一结构，逐项统计能发现不一致。

7×7 Starter House 的具体对比：

| 材料 | 蓝图格子数 | 材料表 |
| --- | ---: | ---: |
| 屋顶 R | 112 | Oak stairs/slabs：48 |
| 地基 S | 24 | Cobblestone：48 |
| 框架 L | 12 | Oak logs：16 |
| 玻璃 G | 4 | Glass panes：8 |

这不是简单多备材料：屋顶明显不足。门的上下半部与物品数量应单独处理，因此没有用门格子直接判断材料错误。楼梯、台阶也需要明确具体方块类型和放置状态，不能笼统合并为可精确执行的材料清单。

建议：从实际蓝图方块数据计算用量，另列可选装饰与预备材料；同时检查两层房屋的楼梯路线、楼梯朝向、台阶上下半块和屋顶结构。在一致性修复前，将 “exact material counts” 改为明确的估算说明。

现有房屋测试只验证“总数等于材料表相加”，没有验证“材料表等于蓝图用量”，因此全部通过仍会漏掉问题。

### 2. P1：Shape 工具的偶数直径 Dome 层序错误

位置：[generate-shape.ts](/Users/wanggang/Documents/Codex/minecraftcirclegen/lib/shape/generate-shape.ts:198)。

选择 Dome、直径 20、空心：Shape 总数为 **508**，独立 Dome 工具为 **484**。直径 4 时分别为 16 和 12；直径 10 时分别为 132 和 120。直径 21 的两个结果一致。

通用工具从 `floor((width - 1) / 2)` 开始递增取层，偶数直径时重复了两个对称中间层，漏掉最外侧顶层。会影响预览、坐标导出和备料。

建议：统一两处球体/半球取层逻辑，补齐奇偶尺寸、空心/实心和每层轮廓的交叉验证。

### 3. P1：下载的 .mcfunction 带有不应存在的开头斜杠

位置：[give-command-generator.tsx](/Users/wanggang/Documents/Codex/minecraftcirclegen/components/give-command-generator/give-command-generator.tsx:201)。

默认点击 `.mcfunction`，Blob 内容为 `/give @p minecraft:diamond_sword 1` 加换行。函数文件应使用 `give ...`；聊天复制可以保留 `/give ...`。目前函数文件导出与聊天命令共用原始字符串。

建议：单独序列化函数文件，移除首个 `/`，保留末尾换行；在相应 Java 版本的数据包内验证加载和执行。[Minecraft 官方函数格式说明](https://www.minecraft.net/en-us/article/minecraft-112-pre-release-3)

### 4. P1：Give 的版本分支只处理了结构，未完整处理注册 ID

位置：[give-command.ts](/Users/wanggang/Documents/Codex/minecraftcirclegen/lib/minecraft/give-command.ts:300)、[legacyNbt](/Users/wanggang/Documents/Codex/minecraftcirclegen/lib/minecraft/give-command.ts:349)。

已复现：

- 选择 legacy、钻石剑、Sweeping Edge III，输出使用 `minecraft:sweeping_edge`，且 `errors` 为空。1.20.4 应使用旧 ID `minecraft:sweeping`。
- 选择 components、属性子版本 1.20.5、Jump Strength，输出使用 `minecraft:horse.jump_strength`。该版本已改名为 `minecraft:generic.jump_strength`。1.21–1.21.1 分支也沿用相同旧映射。

官方 1.20.5 更新说明明确记录了上述两次改名。[Minecraft 1.20.5 更新说明](https://feedback.minecraft.net/hc/en-us/articles/26136167989005-Minecraft-Java-Edition-1-20-5-Armored-Paws)

建议：按具体版本维护属性和附魔 ID 映射以及可用范围，再生成命令。附魔书目前可选 Wind Burst 等较新附魔，也应补充版本过滤。页面 “Java 1.20.4 and earlier” 范围过宽：1.20.4 物品目录不能保证在任意更早版本存在。应收窄到已验证版本，或增加对应版本的数据表。

### 5. P2：MOTD 未转义正文换行和反斜杠

位置：[formatting.ts](/Users/wanggang/Documents/Codex/minecraftcirclegen/lib/minecraft-text/formatting.ts:72)。

输入两行 `Hello`、`World`，生成结果仍含实际换行；输入字面文本 `C:\new`，反斜杠也原样保留。复制到 `server.properties` 后，前者会分成不同属性行，后者的 `\n` 会被解释为换行。

建议：先转义正文中的反斜杠及控制字符，再拼接颜色代码；补齐多行、字面 `\n`、制表符和非 ASCII 文本的 properties 往返验证。说明中提供完整的 `motd=...` 示例。[Java Properties 格式](https://docs.oracle.com/en/java/javase/24/docs/api/java.base/java/util/Properties.html)

### 6. P2：文本渐变的预览和 MiniMessage 导出可能不一致

位置：[text-gradient-generator.tsx](/Users/wanggang/Documents/Codex/minecraftcirclegen/components/gradient-generator/text-gradient-generator.tsx:44)、[generate-text-gradient.ts](/Users/wanggang/Documents/Codex/minecraftcirclegen/lib/gradient/generate-text-gradient.ts:6)。

手动把起始 HEX 改成 `#55`：输入接受并保存此不完整值。预览计算回退到白色，但 MiniMessage 直接输出 `<gradient:#55:#55FFFF>Hi</gradient>`。用户可以复制一个包含无效色值的结果。

建议：区分编辑中的文本与已验证色值；失焦时校验六位 HEX，错误时禁用复制或明确提示；所有格式从同一份规范化色值生成。

### 7. P2：玩家查询的旧请求会覆盖新结果

位置：[player-lookup-tool.tsx](/Users/wanggang/Documents/Codex/minecraftcirclegen/components/player-lookup/player-lookup-tool.tsx:27)。

组件复现：提交 FirstUser → 请求未完成时修改为 SecondUser 并提交 → 第二次请求先返回 → 第一次请求后返回。最终输入框和分享 URL 为 SecondUser，结果卡却显示 FirstUser。

输入修改会将 loading 重置为 idle，因此提交按钮重新可用；响应没有检查请求编号，也没有取消之前的请求。Name Checker 与 UUID Lookup 共用该组件。

建议：使用请求序号或 AbortController，切换查询方向及修改值时使旧请求失效；分享链接应来自已展示结果对应的查询。

### 8. P2：Color Codes 的 Tailwind v3 导出可能生成语法错误

位置：[color-codes-tool.tsx](/Users/wanggang/Documents/Codex/minecraftcirclegen/components/color-codes/color-codes-tool.tsx:120)。

导出选 Tailwind v3，Prefix 填 `my-brand`，得到未加引号的 `my-brand: { ... }`。已用 JavaScript 解析器复现 SyntaxError。以数字开头等输入也需考虑。

建议：为对象键使用 `JSON.stringify(safePrefix)`，CSS 变量的命名规则与 JavaScript 对象键规则分开处理。

### 9. P2：调色板导出弹窗缺少焦点管理

位置：[color-codes-tool.tsx](/Users/wanggang/Documents/Codex/minecraftcirclegen/components/color-codes/color-codes-tool.tsx:168)、[dialog](/Users/wanggang/Documents/Codex/minecraftcirclegen/components/color-codes/color-codes-tool.tsx:264)。

组件测试确认：先聚焦导出按钮，再打开弹窗，焦点仍停在弹窗外的触发按钮。源码只有滚动锁和 Escape 关闭，没有自动移入焦点、Tab 焦点约束、背景 inert 或关闭后焦点恢复。`aria-modal=true` 本身不实现这些行为。

建议：补齐上述焦点管理，并以真实键盘和屏幕阅读器验证。另有多个 `role=tab` 组件未提供完整方向键/tabPanel 关联；目前只列为后续无障碍专项检查项，不据截图判定合规。

### 10. P2：大部分工具页面没有社交分享图片元数据

证据：[构建 HTML 检查结果](/Users/wanggang/Documents/Codex/minecraftcirclegen/artifacts/site-audit-2026-09-09/seo-build-check.json)。

32 个静态业务页面中，16 个没有 `og:image`，包括 12 个非首页静态工具页、工具目录和 3 个站点说明页。三个动态工具页的 metadata 源码同样未配置图片。首页及房屋页有图片；根 layout 没有提供通用 OG 图片。

这属于分享卡片完整性问题，不等于页面不能收录，也不能据此断言排名下降。部分页面声明了 `summary_large_image` 却没有对应图片。

建议：为每个工具配置与工具对应的分享图，短期至少提供 `/og.png` 默认回退；确认最终输出包含绝对图片 URL、宽高和描述。

## 各工具检查结果

“未发现新问题”仅指本轮代码、单元/组件测试范围，不代表真实游戏、浏览器、移动端已全面通过。SEO 图片问题统一见第 10 项。

| 工具 | 本轮功能状态 | 依据或未验证事项 |
| --- | --- | --- |
| Circle | 未发现新计算问题 | 现有圆算法、URL、控件及导出测试通过；首页实际复用 GeometryGenerator |
| Oval | 未发现新计算问题 | 宽高、空心/实心、URL 控件测试通过 |
| Sphere | 未发现新计算问题 | 球体分层和计数测试通过；大尺寸设备性能待测 |
| Dome（独立页） | 本轮交叉核对通过 | 与通用 Shape 的偶数直径结果存在差异，错误定位在通用实现 |
| Shape | 有错误 | 偶数直径 Dome 取层，见第 2 项 |
| Pixel Art | 基础转换测试通过 | 透明像素、缩放、材料统计有测试；真实图片上传/下载、纹理与实际建造一致性待测 |
| Map Art | 数组转换测试通过，色彩真实性待验 | 32 色手写映射缺少可追溯版本数据；需核对实际平面地图色、明暗变化与方块对应关系 |
| Font | 基础测试通过 | 排版、描边、阴影和导出测试通过；真实浏览器极长文本/特殊字符体验待测 |
| Banner | 数据/组件测试通过，视觉待验 | 本地保存、图层顺序及命令字符串有测试；13 种 SVG 图案与游戏纹理的比例/方向未完成对照 |
| Text | 有错误 | 多行和反斜杠 MOTD，见第 5 项 |
| Gradient | 文本模式有错误 | 不完整 HEX 导出，见第 6 项；方块渐变现有测试通过 |
| Color Codes | 有错误 | Tailwind v3 导出与弹窗焦点，见第 8、9 项 |
| Enchanting Translator | 未发现新映射问题 | A–Z 和双向转换测试通过；采用 Unicode 近似字符，不能当作原生 SGA 字体 |
| Give Command | 有错误 | 函数导出、版本 ID，见第 3、4 项 |
| Name Checker | 有错误 | 异步竞态，见第 7 项；“未找到不代表可注册”的提示是正确的 |
| UUID Lookup | 有错误 | 与 Name Checker 共用请求状态组件；真实 Mojang 网络调用未验证 |

## 页面、SEO 和工具说明的改进建议

这些是补全或表达改进，不应与已确认的功能错误混为一谈。

1. **先让文案与结果一致。** 房屋页的 exact、Give 页的 ready to run 都应以真实可执行验证为前提。当前房屋人工材料表、自动层图与插图之间需要建立对应关系。
2. **Map Art 补齐建造前提。** 将 “standard map” 写成 “scale-0 / unzoomed map”；说明地图格子边界对齐、北向与放置平面要求。建议明确适用版本及平面配色限制。玩家完成上万块建造后才发现地图错位，返工成本很高。[当前页面](https://minecraftcirclegen.com/minecraft-map-art-generator)
3. **区分字体输出类型。** Font 说明应在靠近输入的位置明确：这是像素字 PNG/建筑网格，不是安装字体文件；当前主要支持大写拉丁字母、数字与有限标点，其他字符会替换为问号。
4. **让导出按钮表达实际输出。** Shape 在 3D 视图下载当前画布，在 2D 视图下载当前层，复制坐标也只复制当前层。建议按钮使用 “Download current view” / “Copy current-layer coordinates”，避免被理解为整套蓝图导出。
5. **内容页补实际示例。** 每个工具至少给一组可复现输入、输出示例和用途说明；对命令列明复制到聊天、命令方块、函数文件各自的要求。不要只增加重复的关键词段落。
6. **SEO 基础已具备。** 标题、描述、canonical、结构化数据及 sitemap 源码齐备。当前没有证据支持全站标题重写、额外堆 FAQ 或批量创建近似工具页。
7. **不要将结构化数据等同于富结果资格。** JSON 可解析不代表 Google 会展示富结果；普通工具站不应把 FAQ 富结果作为主要流量预期，也不要为了软件评分字段编造评论。[Google FAQ 变更说明](https://developers.google.com/search/blog/2023/08/howto-faq-changes?hl=en)

## 本次执行步骤及状态

1. 工具、路由与现有实现盘点：完成，覆盖 16 个工具、房屋和站点说明页。
2. 原有测试、lint、类型及生产构建：通过。
3. 功能边界和跨工具结果验证：完成本轮定向检查，8 个用例复现问题。
4. 页面 HTML、SEO 和说明文案：完成本地静态页检查，线上部分文案可读取。
5. 桌面/移动端 UI、截图、真实下载及辅助技术：受阻，尚未完成。

建议修复顺序：房屋蓝图一致性 → Dome → Give 命令与函数导出 → MOTD/渐变/查询/色板导出 → 焦点和分享卡片 → 浏览器及 Minecraft 实测。

## 如何重新运行证据用例

在仓库根目录运行：

```bash
npx vitest run --config artifacts/site-audit-2026-09-09/vitest.config.ts
```

原始复现代码保存在 `original-repro.test.tsx.txt`，作为历史证据，不再执行。上述命令现运行正式回归测试 `tests/components/audit-fixes.test.tsx`，断言修复后的正确行为，也已纳入默认测试。
