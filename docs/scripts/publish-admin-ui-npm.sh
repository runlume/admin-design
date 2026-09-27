#!/usr/bin/env bash
# Publish @runlume/admin-ui through the workspace-wide npm release flow.
set -euo pipefail

PACKAGE_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# 工作区的发布脚本在 runlume-all/docs/scripts：本仓库位于 admin-design/admin-ui，向上四层才是工作区根。
PUBLISHER="$(cd "$(dirname "$0")/../../../../docs/scripts" && pwd)/publish-npm-package.sh"
exec "$PUBLISHER" "$PACKAGE_ROOT" "$@"
