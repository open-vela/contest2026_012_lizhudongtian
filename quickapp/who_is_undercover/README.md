# 腕上谁是卧底 (who-is-undercover)

基于 openvela 快应用框架的智能手表多人派对游戏《谁是卧底》。把经典桌游搬到腕上,4–8 名玩家用手表完成「发牌 → 私密看词 → 轮流描述 → 投票 → 公布」的完整对局,主打随时随地、轻量社交的腕上娱乐场景。

> 本目录通过 `contest2026_012_lizhudongtian.xml` 的 `<linkfile>` 软链到 openvela 编译树 `packages/apps/contest2026_012_who_is_undercover`。

技术方案详见 [docs/tech-design.md](docs/tech-design.md)。

## 交付阶段

- **P0(已完成,可单机演示)**:单机版「一块表轮流看」。发牌/身份/回合/投票/词库 + 腕上交互(长按私密看词、震动、计时),单模拟器即可跑完整对局。
- **P1(进行中)**:服务端中转的多端轮询同步 + AI 出题。手表端用 `@system.fetch` 短轮询连自建 HTTPS 服务端(快应用无 WebSocket),服务端权威、按玩家裁剪响应防剧透。
- **P2**:真机多表联机、外壳样机。

## 页面与模块

```
src/
├── manifest.json            # 应用配置(路由/features)
├── app.ux
├── common/
│   ├── game.js              # 本地游戏引擎(状态机/发牌/投票/胜负判定)
│   ├── words.js             # 内置词库(多主题,分难度)
│   └── api.js               # P1 用:fetch 轮询网络模块
└── pages/
    ├── setup/               # 选人数(4–8)+ 难度
    ├── deal/                # 传表发牌:长按私密看词
    ├── play/                # 回合流:描述 → 投票 → 公布 → 结算
    └── conncheck/           # 第0周连通性验证页(P1 联调用)
```

游戏服务端(P1)在 [server/](server/),零第三方依赖,`node server/game-server.js` 启动,详见 [server/README.md](server/README.md)。

## 快速上手

```bash
npm install
npm run start    # 开发 + watch
npm run build    # 构建
npm run release  # 打包发布
```

## 平台约束

- 组件/API 仅用 openvela 白名单;无第三方库;构建用 aiot-toolkit。
- 手表端网络仅 `@system.fetch`(HTTPS),不使用 WebSocket。
