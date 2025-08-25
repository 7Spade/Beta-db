starting build "0d6099b5-10fe-4bc0-9457-ff6bb6546fb9"
FETCHSOURCE
hint: Using 'master' as the name for the initial branch. This default branch name
hint: is subject to change. To configure the initial branch name to use in all
hint: of your new repositories, which will suppress this warning, call:
hint: 
hint: 	git config --global init.defaultBranch <name>
hint: 
hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
hint: 'development'. The just-created branch can be renamed via this command:
hint: 
hint: 	git branch -m <name>
Initialized empty Git repository in /workspace/.git/
From https://github.com/7Spade/Beta-db
 * branch            cbf200c7795a0ddd28659fdf8dd778427f7edda2 -> FETCH_HEAD
HEAD is now at cbf200c 我們是不是安裝firebase-admin 然後再Genkit Flow 中整合 Firebase Storage
GitCommit:
cbf200c7795a0ddd28659fdf8dd778427f7edda2
BUILD
Starting Step #0 - "ubuntu"
Pulling image: ubuntu
Using default tag: latest
latest: Pulling from library/ubuntu
Digest: sha256:7c06e91f61fa88c08cc74f7e1b7c69ae24910d745357e0dfe1d2c0322aaf20f9
Status: Downloaded newer image for ubuntu:latest
docker.io/library/ubuntu:latest
Finished Step #0 - "ubuntu"
Starting Step #1 - "preparer"
Pulling image: asia-east1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250720_18_04_RC00
base_20250720_18_04_RC00: Pulling from serverless-runtimes/utilities/preparer
233097d7ab8a: Pulling fs layer
233097d7ab8a: Download complete
233097d7ab8a: Pull complete
Digest: sha256:964a19c1824055badf7f3c71a7614bfda1b22428a9aae44fc3d3ea3b373d8fef
Status: Downloaded newer image for asia-east1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250720_18_04_RC00
asia-east1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250720_18_04_RC00
2025/08/25 12:15:50 GEMINI_API_KEY has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/08/25 12:15:50 FIREBASE_CONFIG has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/08/25 12:15:50 Pinned secret projects/elite-chiller-455712-c4/secrets/GEMINI_API_KEY/versions/latest to projects/7807661688/secrets/GEMINI_API_KEY/versions/1 for the rest of the current build and run
2025/08/25 12:15:50 Accessed secret projects/7807661688/secrets/GEMINI_API_KEY/versions/1 for the rest of the current build
2025/08/25 12:15:50 Final app hosting schema:
runConfig:
  cpu: null
  memoryMiB: null
  concurrency: null
  maxInstances: null
  minInstances: 1
  vpcAccess: null
env:
- variable: GEMINI_API_KEY
  secret: projects/7807661688/secrets/GEMINI_API_KEY/versions/1
  availability:
  - BUILD
  - RUNTIME
- variable: FIREBASE_CONFIG
  value: '{"databaseURL":"","projectId":"elite-chiller-455712-c4","storageBucket":"elite-chiller-455712-c4.firebasestorage.app"}'
  availability:
  - BUILD
  - RUNTIME
- variable: FIREBASE_WEBAPP_CONFIG
  value: '{"apiKey":"AIzaSyCJ-eayGjJwBKsNIh3oEAG2GjbfTrvAMEI","appId":"1:7807661688:web:cbf779797bd21f5a1d1f8d","authDomain":"elite-chiller-455712-c4.firebaseapp.com","databaseURL":"","messagingSenderId":"7807661688","projectId":"elite-chiller-455712-c4","storageBucket":"elite-chiller-455712-c4.firebasestorage.app"}'
  availability:
  - BUILD
2025/08/25 12:15:50 Final app hosting schema:
runConfig:
  cpu: null
  memoryMiB: null
  concurrency: null
  maxInstances: null
  minInstances: 1
  vpcAccess: null
env:
- variable: GEMINI_API_KEY
  secret: projects/7807661688/secrets/GEMINI_API_KEY/versions/1
  availability:
  - BUILD
  - RUNTIME
- variable: FIREBASE_CONFIG
  value: '{"databaseURL":"","projectId":"elite-chiller-455712-c4","storageBucket":"elite-chiller-455712-c4.firebasestorage.app"}'
  availability:
  - BUILD
  - RUNTIME
- variable: FIREBASE_WEBAPP_CONFIG
  value: '{"apiKey":"AIzaSyCJ-eayGjJwBKsNIh3oEAG2GjbfTrvAMEI","appId":"1:7807661688:web:cbf779797bd21f5a1d1f8d","authDomain":"elite-chiller-455712-c4.firebaseapp.com","databaseURL":"","messagingSenderId":"7807661688","projectId":"elite-chiller-455712-c4","storageBucket":"elite-chiller-455712-c4.firebasestorage.app"}'
  availability:
  - BUILD
Finished Step #1 - "preparer"
Starting Step #2 - "pack"
Pulling image: gcr.io/k8s-skaffold/pack
Using default tag: latest
latest: Pulling from k8s-skaffold/pack
396c31837116: Pulling fs layer
9776b10d5c8c: Pulling fs layer
52cb9ac3197f: Pulling fs layer
9776b10d5c8c: Verifying Checksum
9776b10d5c8c: Download complete
396c31837116: Verifying Checksum
396c31837116: Download complete
52cb9ac3197f: Verifying Checksum
52cb9ac3197f: Download complete
396c31837116: Pull complete
9776b10d5c8c: Pull complete
52cb9ac3197f: Pull complete
Digest: sha256:221c0c0d9a90f46f108bb888a1da9e99c82ff631e8b1c63b0223ea951752bd53
Status: Downloaded newer image for gcr.io/k8s-skaffold/pack:latest
gcr.io/k8s-skaffold/pack:latest
nodejs_20250824_RC00: Pulling from serverless-runtimes/google-22-full/builder/nodejs
e27d8d14a9d0: Already exists
7d81b642fead: Already exists
0b38282098db: Already exists
dfdcb03aeaa7: Pulling fs layer
f3dcda0715aa: Pulling fs layer
7e5abc1a0bbc: Pulling fs layer
a8e293aca4ad: Pulling fs layer
f591a5858883: Pulling fs layer
7871131dbcb3: Pulling fs layer
fe0a88c014e5: Pulling fs layer
1a82443b3661: Pulling fs layer
7259ba11a030: Pulling fs layer
c8af7adec7b7: Pulling fs layer
bd717009a605: Pulling fs layer
2f1b06e6babc: Pulling fs layer
707675a737ab: Pulling fs layer
4304d584e037: Pulling fs layer
f9ac1f806259: Pulling fs layer
91e9f14f0b0c: Pulling fs layer
13426d5673fc: Pulling fs layer
ce35c9977772: Pulling fs layer
8a9373d8c8eb: Pulling fs layer
5b874d7cdf8f: Pulling fs layer
f0c0908dc16e: Pulling fs layer
a8adb40b7f91: Pulling fs layer
3c56c68a1812: Pulling fs layer
f0daa4e4c414: Pulling fs layer
26be9f471823: Pulling fs layer
34ce8ba30961: Pulling fs layer
e6178d2c0976: Pulling fs layer
4f4fb700ef54: Pulling fs layer
a8e293aca4ad: Waiting
f591a5858883: Waiting
7871131dbcb3: Waiting
fe0a88c014e5: Waiting
1a82443b3661: Waiting
7259ba11a030: Waiting
c8af7adec7b7: Waiting
bd717009a605: Waiting
2f1b06e6babc: Waiting
707675a737ab: Waiting
4304d584e037: Waiting
f9ac1f806259: Waiting
91e9f14f0b0c: Waiting
13426d5673fc: Waiting
ce35c9977772: Waiting
8a9373d8c8eb: Waiting
5b874d7cdf8f: Waiting
f0c0908dc16e: Waiting
a8adb40b7f91: Waiting
3c56c68a1812: Waiting
f0daa4e4c414: Waiting
26be9f471823: Waiting
34ce8ba30961: Waiting
e6178d2c0976: Waiting
4f4fb700ef54: Waiting
dfdcb03aeaa7: Verifying Checksum
dfdcb03aeaa7: Download complete
7e5abc1a0bbc: Verifying Checksum
7e5abc1a0bbc: Download complete
a8e293aca4ad: Download complete
f3dcda0715aa: Verifying Checksum
f3dcda0715aa: Download complete
dfdcb03aeaa7: Pull complete
f591a5858883: Verifying Checksum
f591a5858883: Download complete
fe0a88c014e5: Verifying Checksum
fe0a88c014e5: Download complete
f3dcda0715aa: Pull complete
7871131dbcb3: Verifying Checksum
7871131dbcb3: Download complete
7259ba11a030: Verifying Checksum
7259ba11a030: Download complete
c8af7adec7b7: Verifying Checksum
c8af7adec7b7: Download complete
1a82443b3661: Verifying Checksum
1a82443b3661: Download complete
2f1b06e6babc: Verifying Checksum
2f1b06e6babc: Download complete
7e5abc1a0bbc: Pull complete
bd717009a605: Verifying Checksum
bd717009a605: Download complete
707675a737ab: Download complete
a8e293aca4ad: Pull complete
4304d584e037: Verifying Checksum
4304d584e037: Download complete
f9ac1f806259: Verifying Checksum
f9ac1f806259: Download complete
91e9f14f0b0c: Verifying Checksum
91e9f14f0b0c: Download complete
13426d5673fc: Verifying Checksum
13426d5673fc: Download complete
ce35c9977772: Verifying Checksum
ce35c9977772: Download complete
8a9373d8c8eb: Verifying Checksum
8a9373d8c8eb: Download complete
5b874d7cdf8f: Verifying Checksum
5b874d7cdf8f: Download complete
f0c0908dc16e: Verifying Checksum
f0c0908dc16e: Download complete
f591a5858883: Pull complete
a8adb40b7f91: Download complete
3c56c68a1812: Verifying Checksum
3c56c68a1812: Download complete
f0daa4e4c414: Verifying Checksum
f0daa4e4c414: Download complete
26be9f471823: Verifying Checksum
26be9f471823: Download complete
34ce8ba30961: Verifying Checksum
34ce8ba30961: Download complete
e6178d2c0976: Verifying Checksum
e6178d2c0976: Download complete
4f4fb700ef54: Verifying Checksum
4f4fb700ef54: Download complete
7871131dbcb3: Pull complete
fe0a88c014e5: Pull complete
1a82443b3661: Pull complete
7259ba11a030: Pull complete
c8af7adec7b7: Pull complete
bd717009a605: Pull complete
2f1b06e6babc: Pull complete
707675a737ab: Pull complete
4304d584e037: Pull complete
f9ac1f806259: Pull complete
91e9f14f0b0c: Pull complete
13426d5673fc: Pull complete
ce35c9977772: Pull complete
8a9373d8c8eb: Pull complete
5b874d7cdf8f: Pull complete
f0c0908dc16e: Pull complete
a8adb40b7f91: Pull complete
3c56c68a1812: Pull complete
f0daa4e4c414: Pull complete
26be9f471823: Pull complete
34ce8ba30961: Pull complete
e6178d2c0976: Pull complete
4f4fb700ef54: Pull complete
Digest: sha256:6643e33f6953607b9cd27fb65953807927034dd266fc367cf570798b5e68650b
Status: Downloaded newer image for asia-east1-docker.pkg.dev/serverless-runtimes/google-22-full/builder/nodejs:nodejs_20250824_RC00
public-image-next: Pulling from serverless-runtimes/google-22/run/base
e27d8d14a9d0: Already exists
2c4b3deb4e6f: Pulling fs layer
7dc6fd285c84: Pulling fs layer
2c4b3deb4e6f: Download complete
2c4b3deb4e6f: Pull complete
7dc6fd285c84: Verifying Checksum
7dc6fd285c84: Download complete
7dc6fd285c84: Pull complete
Digest: sha256:89efa74de89f4d203917e86961451946e232fcb5c413cc8e53c88107bd9d8d72
Status: Downloaded newer image for asia-east1-docker.pkg.dev/serverless-runtimes/google-22/run/base:public-image-next
===> ANALYZING
Image with name "asia-east1-docker.pkg.dev/elite-chiller-455712-c4/firebaseapphosting-images/beta-db:build-2025-08-25-025" not found
===> DETECTING
target distro name/version labels not found, reading /etc/os-release file
4 of 6 buildpacks participating
google.nodejs.runtime        1.0.0
google.nodejs.firebasenextjs 0.0.1
google.nodejs.npm            1.1.0
google.nodejs.firebasebundle 0.0.1
===> RESTORING
===> BUILDING
target distro name/version labels not found, reading /etc/os-release file
=== Node.js - Runtime (google.nodejs.runtime@1.0.0) ===
2025/08/25 12:16:04 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
Adding image label google.runtime-version: nodejs22
2025/08/25 12:16:04 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
Installing Node.js v22.18.0.
2025/08/25 12:16:04 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/nodejs-22.18.0.tar.gz
=== Node.js - Firebasenextjs (google.nodejs.firebasenextjs@0.0.1) ===
***** CACHE MISS: "npm_modules"
Installing nextjs adaptor 14.0.18
=== Node.js - Npm (google.nodejs.npm@1.1.0) ===
***** CACHE MISS: "npm_modules"
Installing application dependencies.
--------------------------------------------------------------------------------
Running "npm ci --quiet --no-fund --no-audit (NODE_ENV=development)"
npm warn deprecated rimraf@2.7.1: Rimraf versions prior to v4 are no longer supported
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated @types/handlebars@4.1.0: This is a stub types definition. handlebars provides its own type definitions, so you do not need this installed.
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
added 898 packages in 40s
Done "npm ci --quiet --no-fund --no-audit (NODE_ENV=development)" (39.769993839s)
--------------------------------------------------------------------------------
Running "npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_modules apphosting-adapter-nextjs-build"
Overriding Next Config to add configs optmized for Firebase App Hosting
Successfully created next.config.ts with Firebase App Hosting overrides
> nextn@0.1.0 build
> next build
   ▲ Next.js 15.3.3
   Creating an optimized production build ...
 ⚠ Compiled with warnings in 41s
./node_modules/@opentelemetry/sdk-node/build/src/TracerProviderWithEnvExporter.js
Module not found: Can't resolve '@opentelemetry/exporter-jaeger' in '/workspace/node_modules/@opentelemetry/sdk-node/build/src'
Import trace for requested module:
./node_modules/@opentelemetry/sdk-node/build/src/TracerProviderWithEnvExporter.js
./node_modules/@opentelemetry/sdk-node/build/src/sdk.js
./node_modules/@opentelemetry/sdk-node/build/src/index.js
./node_modules/@genkit-ai/core/lib/tracing.js
./node_modules/genkit/lib/tracing.js
./node_modules/genkit/lib/genkit.js
./node_modules/genkit/lib/index.mjs
./src/ai/genkit.ts
./src/ai/flows/generate-skill-flow.ts
./node_modules/handlebars/lib/index.js
require.extensions is not supported by webpack. Use a loader instead.
Import trace for requested module:
./node_modules/handlebars/lib/index.js
./node_modules/dotprompt/dist/index.js
./node_modules/@genkit-ai/core/lib/registry.js
./node_modules/genkit/lib/registry.js
./node_modules/genkit/lib/genkit.js
./node_modules/genkit/lib/index.mjs
./src/ai/genkit.ts
./src/ai/flows/generate-skill-flow.ts
./node_modules/handlebars/lib/index.js
require.extensions is not supported by webpack. Use a loader instead.
Import trace for requested module:
./node_modules/handlebars/lib/index.js
./node_modules/dotprompt/dist/index.js
./node_modules/@genkit-ai/core/lib/registry.js
./node_modules/genkit/lib/registry.js
./node_modules/genkit/lib/genkit.js
./node_modules/genkit/lib/index.mjs
./src/ai/genkit.ts
./src/ai/flows/generate-skill-flow.ts
./node_modules/handlebars/lib/index.js
require.extensions is not supported by webpack. Use a loader instead.
Import trace for requested module:
./node_modules/handlebars/lib/index.js
./node_modules/dotprompt/dist/index.js
./node_modules/@genkit-ai/core/lib/registry.js
./node_modules/genkit/lib/registry.js
./node_modules/genkit/lib/genkit.js
./node_modules/genkit/lib/index.mjs
./src/ai/genkit.ts
./src/ai/flows/generate-skill-flow.ts
./node_modules/@genkit-ai/core/lib/tracing.js
Module not found: Can't resolve '@genkit-ai/firebase' in '/workspace/node_modules/@genkit-ai/core/lib'
Import trace for requested module:
./node_modules/@genkit-ai/core/lib/tracing.js
./node_modules/genkit/lib/tracing.js
./node_modules/genkit/lib/genkit.js
./node_modules/genkit/lib/index.mjs
./src/ai/genkit.ts
./src/ai/flows/generate-skill-flow.ts
Failed to compile.
./node_modules/farmhash-modern/bin/bundler/farmhash_modern_bg.wasm
Module parse failed: Unexpected character '' (1:0)
The module seem to be a WebAssembly module, but module is not flagged as WebAssembly module for webpack.
BREAKING CHANGE: Since webpack 5 WebAssembly is not enabled by default and flagged as experimental feature.
You need to enable one of the WebAssembly experiments via 'experiments.asyncWebAssembly: true' (based on async modules) or 'experiments.syncWebAssembly: true' (like webpack 4, deprecated).
For files that transpile to WebAssembly, make sure to set the module type in the 'module.rules' section of the config (e. g. 'type: "webassembly/async"').
(Source code omitted for this binary file)
Import trace for requested module:
./node_modules/farmhash-modern/bin/bundler/farmhash_modern_bg.wasm
./node_modules/farmhash-modern/bin/bundler/farmhash_modern.js
./node_modules/farmhash-modern/lib/browser.js
./node_modules/firebase-admin/lib/remote-config/condition-evaluator-internal.js
./node_modules/firebase-admin/lib/remote-config/remote-config.js
./node_modules/firebase-admin/lib/app/firebase-namespace.js
./node_modules/firebase-admin/lib/default-namespace.js
./node_modules/firebase-admin/lib/index.js
./src/lib/firebase.ts
./src/context/ProjectContext.tsx
./node_modules/agent-base/dist/index.js
Module not found: Can't resolve 'net'
https://nextjs.org/docs/messages/module-not-found
Import trace for requested module:
./node_modules/https-proxy-agent/dist/index.js
./node_modules/gaxios/build/src/gaxios.js
./node_modules/gaxios/build/src/index.js
./node_modules/@google-cloud/storage/build/cjs/src/resumable-upload.js
./node_modules/@google-cloud/storage/build/cjs/src/file.js
./node_modules/@google-cloud/storage/build/cjs/src/index.js
./node_modules/firebase-admin/lib/storage/storage.js
./node_modules/firebase-admin/lib/app/firebase-namespace.js
./node_modules/firebase-admin/lib/default-namespace.js
./node_modules/firebase-admin/lib/index.js
./src/lib/firebase.ts
./src/context/ProjectContext.tsx
./node_modules/firebase-admin/lib/app/credential-internal.js
Module not found: Can't resolve 'fs'
https://nextjs.org/docs/messages/module-not-found
Import trace for requested module:
./node_modules/firebase-admin/lib/app/lifecycle.js
./node_modules/firebase-admin/lib/app/firebase-namespace.js
./node_modules/firebase-admin/lib/default-namespace.js
./node_modules/firebase-admin/lib/index.js
./src/lib/firebase.ts
./src/context/ProjectContext.tsx
./node_modules/firebase-admin/lib/app/lifecycle.js
Module not found: Can't resolve 'fs'
https://nextjs.org/docs/messages/module-not-found
Import trace for requested module:
./node_modules/firebase-admin/lib/app/firebase-namespace.js
./node_modules/firebase-admin/lib/default-namespace.js
./node_modules/firebase-admin/lib/index.js
./src/lib/firebase.ts
./src/context/ProjectContext.tsx
./node_modules/firebase-admin/lib/utils/api-request.js
Module not found: Can't resolve 'http2'
https://nextjs.org/docs/messages/module-not-found
Import trace for requested module:
./node_modules/firebase-admin/lib/messaging/messaging.js
./node_modules/firebase-admin/lib/app/firebase-namespace.js
./node_modules/firebase-admin/lib/default-namespace.js
./node_modules/firebase-admin/lib/index.js
./src/lib/firebase.ts
./src/context/ProjectContext.tsx
> Build failed because of webpack errors
Restoring original next config in project root
/layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:61
                reject(new Error(`Build process exited with error code ${code}.`));
                       ^
Error: Build process exited with error code 1.
    at ChildProcess.<anonymous> (/layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:61:24)
    at ChildProcess.emit (node:events:518:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)
Node.js v22.18.0
Done "npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_m..." (1m27.876364584s)
--------------------------------------------------------------------------------
failed to build: (error ID: ef15d274):
{"reason":"Failed Framework Build","code":"fah/failed-framework-build","userFacingMessage":"Your application failed to run the framework build command 'npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_modules apphosting-adapter-nextjs-build' successfully. Please check the raw log to address the error and confirm that your application builds locally before redeploying.","rawLog":"(error ID: d0a693a9):
Overriding Next Config to add configs optmized for Firebase App Hosting
Successfully created next.config.ts with Firebase App Hosting overrides
> nextn@0.1.0 build
> next build
   ▲ Next.js 15.3.3
   Creating an optimized production build ...
 ⚠ Compiled with warnings in 41s
./node_modules/@opentelemetry/sdk-node/build/src/TracerProviderWithEnvExporter.js
Module not found: Can't resolve '@opentelemetry/exporter-jaeger' in '/workspace/node_modules/@opentelemetry/sdk-node/build/src'
Import trace for requested module:
./node_modules/@opentelemetry/sdk-node/build/src/TracerProviderWithEnvExporter.js
./node_modules/@opentelemetry/sdk-node/build/src/sdk.js
./node_modules/@opentelemetry/sdk-node/build/src/index.js
./node_modules/@genkit-ai/core/lib/tracing.js
./node_modules/genkit/lib/tracing.js
./node_modules/genkit/lib/genkit.js
./node_modules/genkit/lib/index.mjs
./src/ai/genkit.ts
./src/ai/flows/generate-skill-flow.ts
./node_modules/handlebars/lib/index.js
require.extensions is not supported by webpack. Use a loader instead.
Import trace for requested module:
./node_modules/handlebars/lib/index.js
./node_modules/dotprompt/dist/index.js
./node_modules/@genkit-ai/core/lib/registry.js
./node_modules/genkit/lib/registry.js
./node_modules/genkit/lib/genkit.js
./node_modules/genkit/lib/index.mjs
./src/ai/genkit.ts
./src/ai/flows/generate-skill-flow.ts
./node_modules/handlebars/lib/index.js
require.extensions is not supported by webpack. Use a loader instead.
Import trace for requested module:
./node_modules/handlebars/lib/index.js
./node_modules/dotprompt/dist/index.js
./node_modules/@genkit-ai/core/lib/registry.js
./node_modules/genkit/lib/registry.js
./node_modules/genkit/lib/genkit.js
./node_modules/genkit/lib/index.mjs
./src/ai/genkit.ts
./src/ai/flows/generate-skill-flow.ts
./node_modules/handlebars/lib/index.js
require.extensions is not supported by webpack. Use a loader instead.
Import trace for requested module:
./node_modules/handlebars/lib/index.js
./node_modules/dotprompt/dist/index.js
./node_modules/@genkit-ai/core/lib/registry.js
./node_modules/genkit/lib/registry.js
./node_modules/genkit/lib/genkit.js
./node_modules/genkit/lib/index.mjs
./src/ai/genkit.ts
./src/ai/flows/generate-skill-flow.ts
./node_modules/@genkit-ai/core/lib/tracing.js
Module not found: Can't resolve '@genkit-ai/firebase' in '/workspace/node_modules/@genkit-ai/core/lib'
Import trace for requested module:
./node_modules/@genkit-ai/core/lib/tracing.js
./node_modules/genkit/lib/tracing.js
./node_modules/genkit/lib/genkit.js
./node_modules/genkit/lib/index.mjs
./src/ai/genkit.ts
./src/ai/flows/generate-skill-flow.ts
Failed to compile.
./node_modules/farmhash-modern/bin/bundler/farmhash_modern_bg.wasm
Module parse failed: Unexpected character '' (1:0)
The module seem to be a WebAssembly module, but module is not flagged as WebAssembly module for webpack.
BREAKING CHANGE: Since webpack 5 WebAssembly is not enabled by default and flagged as experimental feature.
You need to enable one of the WebAssembly experiments via 'experiments.asyncWebAssembly: true' (based on async modules) or 'experiments.syncWebAssembly: true' (like webpack 4, deprecated).
For files that transpile to WebAssembly, make sure to set the module type in the 'module.rules' section of the config (e. g. 'type: "webassembly/async"').
(Source code omitted for this binary file)
Import trace for requested module:
./node_modules/farmhash-modern/bin/bundler/farmhash_modern_bg.wasm
./node_modules/farmhash-modern/bin/bundler/farmhash_modern.js
./node_modules/farmhash-modern/lib/browser.js
./node_modules/firebase-admin/lib/remote-config/condition-evaluator-internal.js
./node_modules/firebase-admin/lib/remote-config/remote-config.js
./node_modules/firebase-admin/lib/app/firebase-namespace.js
./node_modules/firebase-admin/lib/default-namespace.js
./node_modules/firebase-admin/lib/index.js
./src/lib/firebase.ts
./src/context/ProjectContext.tsx
./node_modules/agent-base/dist/index.js
Module not found: Can't resolve 'net'
https://nextjs.org/docs/messages/module-not-found
Import trace for requested module:
./node_modules/https-proxy-agent/dist/index.js
./node_modules/gaxios/build/src/gaxios.js
./node_modules/gaxios/build/src/index.js
./node_modules/@google-cloud/storage/build/cjs/src/resumable-upload.js
./node_modules/@google-cloud/storage/build/cjs/src/file.js
./node_modules/@google-cloud/storage/build/cjs/src/index.js
./node_modules/firebase-admin/lib/storage/storage.js
./node_modules/firebase-admin/lib/app/firebase-namespace.js
./node_modules/firebase-admin/lib/default-namespace.js
./node_modules/firebase-admin/lib/index.js
./src/lib/firebase.ts
./src/context/ProjectContext.tsx
./node_modules/firebase-admin/lib/app/credential-internal.js
Module not found: Can't resolve 'fs'
https://nextjs.org/docs/messages/module-not-found
Import trace for requested module:
./node_modules/firebase-admin/lib/app/lifecycle.js
./node_modules/firebase-admin/lib/app/firebase-namespace.js
./node_modules/firebase-admin/lib/default-namespace.js
./node_modules/firebase-admin/lib/index.js
./src/lib/firebase.ts
./src/context/ProjectContext.tsx
./node_modules/firebase-admin/lib/app/lifecycle.js
Module not found: Can't resolve 'fs'
https://nextjs.org/docs/messages/module-not-found
Import trace for requested module:
./node_modules/firebase-admin/lib/app/firebase-namespace.js
./node_modules/firebase-admin/lib/default-namespace.js
./node_modules/firebase-admin/lib/index.js
./src/lib/firebase.ts
./src/context/ProjectContext.tsx
./node_modules/firebase-admin/lib/utils/api-request.js
Module not found: Can't resolve 'http2'
https://nextjs.org/docs/messages/module-not-found
Import trace for requested module:
./node_modules/firebase-admin/lib/messaging/messaging.js
./node_modules/firebase-admin/lib/app/firebase-namespace.js
./node_modules/firebase-admin/lib/default-namespace.js
./node_modules/firebase-admin/lib/index.js
./src/lib/firebase.ts
./src/context/ProjectContext.tsx
> Build failed because of webpack errors
Restoring original next config in project root
/layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:61
                reject(new Error(`Build process exited with error code ${code}.`));
                       ^
Error: Build process exited with error code 1.
    at ChildProcess.<anonymous> (/layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:61:24)
    at ChildProcess.emit (node:events:518:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)
Node.js v22.18.0"}
ERROR: failed to build: exit status 1
ERROR: failed to build: executing lifecycle: failed with status code: 51
Finished Step #2 - "pack"
ERROR
ERROR: build step 2 "gcr.io/k8s-skaffold/pack" failed: step exited with non-zero status: 1
