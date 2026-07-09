# 《腕上谁是卧底》—— AI 编程使用情况报告

> 本报告说明本作品在开发全流程中如何使用 AI 编程能力,并列出可在工程内直接核验的证据路径,供评委查阅。所有描述均以仓库现存文件为准,未做夸大。

## 一、概述

本作品从需求、技术方案、编码到模拟器调试,全程借助 **基于 Claude 的 AI 编程助手(Claude Code)** 完成,并非「AI 一次性生成」,而是采用一套**规则驱动、分阶段、人审确认**的工程化 AI 开发工作流:

- AI 在**平台硬约束**(openvela 组件/API 白名单、禁第三方库、CSS 规范等)下生成代码;
- 关键节点由**人工审阅确认**(Checkpoint),再进入下一阶段;
- 用 **MCP 工具**驱动真实模拟器完成调试验证,而非仅凭静态生成。

## 二、AI 工具链

| 工具 | 用途 | 工程内证据 |
| :--- | :--- | :--- |
| Claude Code(Claude 模型) | 对话式生成 PRD / 技术方案 / 代码 / 调试 | `.claude/` 全套配置 |
| velajs-mcp(MCP Server) | 驱动手表模拟器:启动、推送 rpk、截图、点击、读日志 | `who-is-undercover/.claude/settings.local.json` |
| aiot-toolkit | openvela 快应用构建(禁用 hap-toolkit) | `package.json` devDependencies |
| mcp-figma(MCP,可选) | 设计稿驱动开发时导出节点/图片 | `.claude/rules/vela-figma-mcp.md` |

## 三、规则驱动的 AI 开发工作流

项目在 `.claude/` 目录下沉淀了一套可复用的 AI 开发工作流配置,这是本作品「AI 编程工程化」的核心。

### 3.1 四阶段自动化工作流(Skills)

位于 `.claude/skills/`,由 `/vela-workflow` 命令或关键词触发:

| 阶段 | 名称 | 产出 | Skill 定义 |
| :--- | :--- | :--- | :--- |
| S1 | PRD 生成 | 需求文档 | `.claude/skills/vela-s1-prd/SKILL.md` |
| S2 | 技术方案 | 技术设计 | `.claude/skills/vela-s2-tech/SKILL.md` |
| S3 | 功能研发 | 工程代码 | `.claude/skills/vela-s3-coding/SKILL.md` |
| S4 | 模拟器调试 | 调试报告 + 修复 | `.claude/skills/vela-s4-simulator/SKILL.md` |

工作流由 `.claude/skills/vela-workflow/SKILL.md` 协调,支持**完整模式**(S1→S2→S3→S4)与**快速模式**(直接 S3),每个 Checkpoint 以 `y`(确认)/`e`(编辑)/`n`(重做)阻塞等待人工确认,保证 AI 产出经人审后才落地。

### 3.2 平台约束规则(Rules)

位于 `.claude/rules/`,共 9 份,作为 AI 生成代码时**无条件遵守**的硬约束:

| 规则文件 | 约束内容 |
| :--- | :--- |
| `vela-platform.md` | 组件/API 白名单、禁止第三方库 |
| `vela-quality.md` | 错误处理、资源清理、代码自检清单 |
| `vela-css.md` | 仅 class 选择器、禁嵌套、禁 Less/Sass |
| `vela-layout.md` | Flexbox、圆屏安全区、字体色值规范 |
| `vela-format.md` | .ux 三段式、manifest 字段 |
| `vela-coding-convention.md` | 组件导入、数据绑定、生命周期 |
| `project-init.md` | 仅用 create-aiot 初始化 |
| `vela-design-driven.md` | 设计稿驱动开发流程 |
| `vela-figma-mcp.md` | Figma / velajs MCP 分阶段使用规范 |

### 3.3 知识库与提示词(Knowledge / Prompts)

- `.claude/knowledge/vela-js-app.md` —— openvela 快应用核心开发指南;
- `.claude/prompts/` —— 组件、API、最佳实践、开发指南四份参考提示词。

AI 在生成代码前自动加载这些上下文,确保输出贴合平台能力边界。

### 3.4 安全护栏(Hooks)

位于 `.claude/hooks/`,为 AI 操作加装自动化护栏:

| Hook | 触发时机 | 作用 |
| :--- | :--- | :--- |
| `guard-dangerous-cmd.sh` | 命令执行前 | 拦截危险 `rm`、未授权 `npm install` 等 |
| `validate-write.sh` | 文件写入后 | 目录白名单校验 |
| `prompt-vela-workflow.sh` | 用户提交时 | 识别快应用需求,提示补充需求/设计稿 |

## 四、AI 生成成果的工程痕迹

AI 并非「黑箱产出」,生成的代码**显式标注了设计与规范来源**,可逐条回溯。以下为源码注释中引用技术方案章节 / 规则 / 知识库的实例(共 12 处):

| 文件 | 注释痕迹 |
| :--- | :--- |
| `src/common/game.js:4` | 「设计与服务端状态机同构(见 docs/tech-design.md 第八节)」 |
| `src/common/game.js:18` | 「必须用 global 作为跨页面唯一状态源(见 vela-js-app 知识库)」 |
| `src/common/api.js:26` | 「fail 回调一律 reject……(禁止静默失败,见 vela-quality 规则)」 |
| `src/pages/deal/deal.ux:35` | 「自动隐藏兜底:防止 touchend 丢失(见 vela 长按触摸隐患)」 |
| `src/pages/conncheck/conncheck.ux:63` | 「原地修改数组(避免整体重新赋值,见 vela-quality Q5)」 |
| `server/game-server.js:6` | 「实现 docs/tech-design.md 第七节协议」 |

这种「代码 ↔ 方案 ↔ 规则」的可追溯性,是规则驱动 AI 开发的直接体现。

## 五、AI 辅助调试(MCP 实测)

P0 单机版的功能验证由 AI 通过 **velajs-mcp** 驱动手表模拟器完成:AI 自动构建并推送 rpk、逐屏截图、模拟点击/长按、读取运行日志,完整走完一局对局并核对每一步渲染与状态迁移。

- 调试权限声明:`who-is-undercover/.claude/settings.local.json`(velajs 日志读取权限);
- 完整验证过程与结论:见 [test-report.md](test-report.md)。

调试中 AI 还如实记录了两项环境问题(某模拟器缺系统镜像、调试会话点击偶发失效)并给出规避方案,而非只报告成功结果。

## 六、代码规模(AI 参与产出)

| 模块 | 文件 | 行数 |
| :--- | :--- | ---: |
| 手表端页面 | setup / deal / play / conncheck (.ux) | 977 |
| 手表端公共模块 | game.js / api.js / words.js | 401 |
| 游戏服务端 | server/game-server.js | 351 |
| 技术文档 | tech-design.md / test-report.md | 324 |
| 应用入口 | app.ux | 9 |
| **合计** | | **约 2000+ 行** |

## 七、真实性说明

为便于评委核验,特此说明证据边界:

- 本报告所述配置与代码**均可在仓库内直接打开核对**,路径已逐一标注;
- `.claude/hooks/` 与 `.claude/skills/` 为可复用的 AI 工作流模板,当前工程已具备该套配置;其中 `validate-write.sh` 内的项目根路径为模板默认值,实际以 `.claude/` 所在工程为准;
- 本作品当前未纳入 git 版本管理,故不以提交历史作为证据,一切以现存文件与可复现的调试过程为准;
- 模拟器调试过程可按 [test-report.md](test-report.md) 第八节步骤复现。

## 八、小结

本作品体现了**工程化的 AI 编程实践**:以规则与知识库约束 AI 输出、以分阶段人审确认控制质量、以 MCP 工具驱动真实设备验证。AI 既是编码主力,也在平台约束护栏与人工 Checkpoint 之下运行,兼顾效率与可靠性。
