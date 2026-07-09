#!/usr/bin/env bash
# 生成自签名证书用于本地 HTTPS 调试。
# 生产/决赛真机请换用可信证书(Caddy 自动证书 / 云厂商证书)。
set -e
DIR="$(cd "$(dirname "$0")" && pwd)/certs"
mkdir -p "$DIR"

# 支持通过 SAN 指定局域网 IP,方便模拟器/真机访问宿主机。
# 用法:  HOST_IP=192.168.1.10 bash server/gen-cert.sh
HOST_IP="${HOST_IP:-127.0.0.1}"

cat > "$DIR/openssl.cnf" <<EOF
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no
[req_distinguished_name]
CN = who-is-undercover-dev
[v3_req]
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
IP.2 = ${HOST_IP}
EOF

openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout "$DIR/key.pem" -out "$DIR/cert.pem" \
  -days 825 -config "$DIR/openssl.cnf"

echo ""
echo "证书已生成到 $DIR"
echo "  cert.pem / key.pem"
echo "SAN 包含: localhost, 127.0.0.1, ${HOST_IP}"
echo "启动服务端:  node server/game-server.js"
