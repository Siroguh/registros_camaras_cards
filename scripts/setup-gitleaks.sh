#!/bin/sh
set -eu

cd "$(dirname "$0")/.."
version=8.30.1
target=.local/bin/gitleaks

if [ -x "$target" ] && [ "$("$target" version)" = "$version" ]; then
  exit 0
fi

case "$(uname -s)-$(uname -m)" in
  Linux-x86_64)
    platform=linux_x64
    checksum=551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb
    ;;
  Linux-aarch64)
    platform=linux_arm64
    checksum=e4a487ee7ccd7d3a7f7ec08657610aa3606637dab924210b3aee62570fb4b080
    ;;
  *)
    echo 'Gitleaks setup requires Linux x86_64 or aarch64.' >&2
    exit 1
    ;;
esac

mkdir -p .local/bin
temporary=$(mktemp -d .local/gitleaks.XXXXXX)
trap 'rm -rf "$temporary"' EXIT
archive="$temporary/gitleaks.tar.gz"
curl --fail --location --silent --show-error --retry 2 \
  "https://github.com/gitleaks/gitleaks/releases/download/v$version/gitleaks_${version}_${platform}.tar.gz" \
  --output "$archive"
printf '%s  %s\n' "$checksum" "$archive" | sha256sum --check
tar -xzf "$archive" -C "$temporary" gitleaks
install -m 755 "$temporary/gitleaks" "$target"
