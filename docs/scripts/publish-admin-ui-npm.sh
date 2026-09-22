#!/usr/bin/env bash
# 发布 @runlume/admin-ui：凭据只存在于本次进程和临时 npmrc 中。
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
REGISTRY="https://registry.npmjs.org/"
TOKEN=""
NPMRC=""

cleanup() {
  unset TOKEN || true
  if [ -n "$NPMRC" ]; then
    rm -f "$NPMRC"
  fi
}
trap cleanup EXIT

TOKEN="$(osascript <<'APPLESCRIPT'
set answer to display dialog "请输入 npm Granular Access Token（Read and write，授权 @runlume，勾选 Bypass 2FA）" default answer "" with hidden answer buttons {"取消", "发布"} default button "发布" with title "发布 @runlume/admin-ui"
return text returned of answer
APPLESCRIPT
)"

if [ -z "$TOKEN" ]; then
  echo "未输入 Token，终止。" >&2
  exit 2
fi

NPMRC="$(mktemp)"
chmod 600 "$NPMRC"
printf '@runlume:registry=%s\n//registry.npmjs.org/:_authToken=%s\n' "$REGISTRY" "$TOKEN" > "$NPMRC"

echo "== 1) 凭据自检 =="
npm whoami --registry "$REGISTRY" --userconfig "$NPMRC"

echo "== 2) 项目门禁 =="
(cd "$ROOT_DIR" && pnpm check)

echo "== 3) 打包检查 =="
(cd "$ROOT_DIR" && npm pack --dry-run --registry "$REGISTRY" --userconfig "$NPMRC")

echo "== 4) 公开内容扫描 =="
if grep -rInE '(_authToken=|BEGIN [A-Z ]*PRIVATE KEY|nexus\.runlume\.app|myhost|treedeep\.cn)' \
  "$ROOT_DIR/dist-package" "$ROOT_DIR/README.md" "$ROOT_DIR/README.en.md" \
  "$ROOT_DIR/LICENSE" "$ROOT_DIR/NOTICE" "$ROOT_DIR/package.json"; then
  echo "拒绝发布：包内容命中凭据或内部地址。" >&2
  exit 2
fi

PACKAGE="$(node -p "const p=require('${ROOT_DIR}/package.json'); p.name+'@'+p.version")"
echo "== 5) 发布 ${PACKAGE} =="
(cd "$ROOT_DIR" && npm publish --registry "$REGISTRY" --userconfig "$NPMRC" --access public)

echo "== 6) 注册表回查 =="
for attempt in $(seq 1 12); do
  if npm view "$PACKAGE" version --registry "$REGISTRY" --userconfig "$NPMRC" 2>/dev/null; then
    echo "已发布：${PACKAGE}"
    exit 0
  fi
  echo "第 ${attempt} 次尚不可读，10 秒后重试…"
  sleep 10
done

echo "发布已提交，但注册表暂未可读；请稍后复查，不要重复发布相同版本。" >&2
