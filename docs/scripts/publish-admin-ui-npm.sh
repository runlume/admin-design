#!/usr/bin/env bash
# Publish @runlume/admin-ui through the workspace-wide npm release flow.
set -euo pipefail

PACKAGE_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PUBLISHER="$(cd "$(dirname "$0")/../../../docs/scripts" && pwd)/publish-npm-package.sh"
exec "$PUBLISHER" "$PACKAGE_ROOT" "$@"
