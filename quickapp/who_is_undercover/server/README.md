# 《谁是卧底》游戏服务端(最小验证版)

零第三方依赖,仅用 Node 内置模块。实现 [../docs/tech-design.md](../docs/tech-design.md) 第七节的 HTTPS 轮询协议。

## 快速开始

```bash
# 1. 生成自签名证书(本地调试用)
bash server/gen-cert.sh
# 若要让局域网内的模拟器/真机访问宿主机,带上宿主机 IP:
#   HOST_IP=192.168.1.10 bash server/gen-cert.sh

# 2. 启动 HTTPS 服务端(默认端口 8443)
node server/game-server.js

# 或临时用明文 HTTP 本地调试(手表端连不了,仅供 curl):
PROTO=http node server/game-server.js
```

## 冒烟测试(curl)

```bash
BASE=https://localhost:8443    # 自签名证书用 curl -k 跳过校验

curl -k $BASE/health
curl -k -X POST $BASE/room -d '{"name":"小明"}'          # -> {roomId, playerId}
curl -k -X POST $BASE/room/8421/join -d '{"name":"小红"}' # -> {playerId}
curl -k "$BASE/room/8421/state?playerId=p_1&since=0"     # -> 本视角快照
curl -k -X POST $BASE/room/8421/start -d '{"playerId":"p_1"}'
```

## 协议一览

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET  | `/health` | 健康探针 |
| POST | `/room` | 创建房间 → `{roomId, playerId}` |
| POST | `/room/{id}/join` | 加入 → `{playerId}` |
| POST | `/room/{id}/start` | 房主开局(发词+分身份) |
| POST | `/room/{id}/vote` | 投票 `{playerId, targetId}` |
| POST | `/room/{id}/next` | 房主推进阶段 |
| GET  | `/room/{id}/state?playerId=X&since=N` | 轮询本视角快照 |

**防剧透**:`wordPair`/`assignments` 永不下发;`yourWord` 只在响应里给请求者本人;`votes` 仅 `revealed` 阶段公开。

## 注意

- 状态在内存,进程重启即清空(验证/演示足够;P1 后可换持久化)。
- 手表端必须走 **HTTPS**,明文 HTTP 会被快应用拦截。
- 自签名证书在部分真机上可能不被信任,决赛真机建议用可信证书。
