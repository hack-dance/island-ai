#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FIXTURE="$ROOT/tests/packed-consumer"
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT
export npm_config_cache="$TEMP_DIR/npm-cache"

mkdir -p "$TEMP_DIR/packages/schema-stream" "$TEMP_DIR/packages/zod-stream" "$TEMP_DIR/packages/stream-hooks" "$TEMP_DIR/tarballs" "$TEMP_DIR/consumer" "$TEMP_DIR/schema-consumer"

for package in schema-stream zod-stream stream-hooks; do
  source_dir="$ROOT/public-packages/$package"
  if [[ "$package" == "schema-stream" ]]; then
    source_dir="$ROOT/public-packages/schemaStream"
  elif [[ "$package" == "stream-hooks" ]]; then
    source_dir="$ROOT/public-packages/hooks"
  fi
  cp "$source_dir/package.json" "$TEMP_DIR/packages/$package/package.json"
  cp -R "$source_dir/dist" "$TEMP_DIR/packages/$package/dist"
done

node -e 'const fs=require("node:fs"); for (const name of ["schema-stream","zod-stream","stream-hooks"]) { const path=process.argv[1]+"/packages/"+name+"/package.json"; const pkg=JSON.parse(fs.readFileSync(path,"utf8")); pkg.version="4.0.0"; if (name === "stream-hooks") pkg.peerDependencies["zod-stream"]="^4.0.0"; delete pkg.devDependencies; fs.writeFileSync(path,JSON.stringify(pkg,null,2)+"\n"); }' "$TEMP_DIR"

npm pack "$TEMP_DIR/packages/schema-stream" --pack-destination "$TEMP_DIR/tarballs" >/dev/null
SCHEMA_TARBALL="$TEMP_DIR/tarballs/schema-stream-4.0.0.tgz"
node -e 'const fs=require("node:fs"); const path=process.argv[1]; const pkg=JSON.parse(fs.readFileSync(path,"utf8")); pkg.dependencies["schema-stream"]="file:"+process.argv[2]; fs.writeFileSync(path,JSON.stringify(pkg,null,2)+"\n");' "$TEMP_DIR/packages/zod-stream/package.json" "$SCHEMA_TARBALL"
npm pack "$TEMP_DIR/packages/zod-stream" --pack-destination "$TEMP_DIR/tarballs" >/dev/null
npm pack "$TEMP_DIR/packages/stream-hooks" --pack-destination "$TEMP_DIR/tarballs" >/dev/null

cp "$FIXTURE/consumer.ts" "$FIXTURE/consumer.cjs" "$FIXTURE/tsconfig.json" "$TEMP_DIR/consumer/"
node -e 'require("node:fs").writeFileSync(process.argv[1], JSON.stringify({name:"packed-consumer",private:true,type:"module"},null,2)+"\n")' "$TEMP_DIR/consumer/package.json"

cd "$TEMP_DIR/consumer"
npm install --ignore-scripts --no-audit --no-fund \
  "$SCHEMA_TARBALL" \
  "$TEMP_DIR/tarballs/zod-stream-4.0.0.tgz" \
  "$TEMP_DIR/tarballs/stream-hooks-4.0.0.tgz" \
  zod@4.4.3 openai@6.46.0 @openai/agents@0.13.1 ai@7.0.19 \
  react@19.2.7 @types/react@19.2.17 @types/node@24 @types/json-schema@7.0.15 \
  typescript@5.9.3 >/dev/null

./node_modules/.bin/tsc -p tsconfig.json
node dist/consumer.js
node consumer.cjs

npm install --ignore-scripts --no-audit --no-fund react@18.3.1 @types/react@18.3.31 >/dev/null
./node_modules/.bin/tsc -p tsconfig.json
node dist/consumer.js
node consumer.cjs
echo "packed consumer React 18 and React 19 peer matrices passed"

cp "$FIXTURE/consumer-zod3.ts" "$FIXTURE/tsconfig-zod3.json" "$TEMP_DIR/schema-consumer/"
node -e 'require("node:fs").writeFileSync(process.argv[1], JSON.stringify({name:"packed-schema-consumer",private:true,type:"module"},null,2)+"\n")' "$TEMP_DIR/schema-consumer/package.json"
cd "$TEMP_DIR/schema-consumer"
npm install --ignore-scripts --no-audit --no-fund "$SCHEMA_TARBALL" zod@3.25.76 typescript@5.9.3 >/dev/null
./node_modules/.bin/tsc -p tsconfig-zod3.json
node dist/consumer-zod3.js
