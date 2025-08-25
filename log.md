starting build "df333f24-113e-4aeb-b74b-ac662313fac0"
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
 * branch            43c4664bdb6054e1f786f58b6f41e355d62bc778 -> FETCH_HEAD
HEAD is now at 43c4664 1
GitCommit:
43c4664bdb6054e1f786f58b6f41e355d62bc778
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
233097d7ab8a: Verifying Checksum
233097d7ab8a: Download complete
233097d7ab8a: Pull complete
Digest: sha256:964a19c1824055badf7f3c71a7614bfda1b22428a9aae44fc3d3ea3b373d8fef
Status: Downloaded newer image for asia-east1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250720_18_04_RC00
asia-east1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250720_18_04_RC00
2025/08/25 08:05:20 GEMINI_API_KEY has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/08/25 08:05:20 FIREBASE_CONFIG has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/08/25 08:05:21 Pinned secret projects/elite-chiller-455712-c4/secrets/GEMINI_API_KEY/versions/latest to projects/7807661688/secrets/GEMINI_API_KEY/versions/1 for the rest of the current build and run
2025/08/25 08:05:21 Accessed secret projects/7807661688/secrets/GEMINI_API_KEY/versions/1 for the rest of the current build
2025/08/25 08:05:21 Final app hosting schema:
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
2025/08/25 08:05:21 Final app hosting schema:
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
nodejs_20250817_RC00: Pulling from serverless-runtimes/google-22-full/builder/nodejs
e27d8d14a9d0: Already exists
7d81b642fead: Already exists
0b38282098db: Already exists
41bbe81139bf: Pulling fs layer
d3d1a1487ac4: Pulling fs layer
50c408d125fb: Pulling fs layer
77578dcf7512: Pulling fs layer
efc084e41e4e: Pulling fs layer
fc23839b7c10: Pulling fs layer
fe0a88c014e5: Pulling fs layer
1a82443b3661: Pulling fs layer
0835b07b56bd: Pulling fs layer
eb96dc6a4490: Pulling fs layer
3bf07d536922: Pulling fs layer
5e67d63628c9: Pulling fs layer
165dc5423134: Pulling fs layer
252789b878c7: Pulling fs layer
3c75447a2c8c: Pulling fs layer
7b7eb5a6d663: Pulling fs layer
64a79f466fbc: Pulling fs layer
394073e76ca1: Pulling fs layer
bd77de5e24ac: Pulling fs layer
7f4a2804951b: Pulling fs layer
2e204641bd22: Pulling fs layer
557356969da2: Pulling fs layer
d714bce515d6: Pulling fs layer
3ffc01b466e2: Pulling fs layer
26be9f471823: Pulling fs layer
34ce8ba30961: Pulling fs layer
e6178d2c0976: Pulling fs layer
4f4fb700ef54: Pulling fs layer
77578dcf7512: Waiting
efc084e41e4e: Waiting
fc23839b7c10: Waiting
fe0a88c014e5: Waiting
1a82443b3661: Waiting
0835b07b56bd: Waiting
eb96dc6a4490: Waiting
3bf07d536922: Waiting
5e67d63628c9: Waiting
165dc5423134: Waiting
252789b878c7: Waiting
3c75447a2c8c: Waiting
7b7eb5a6d663: Waiting
64a79f466fbc: Waiting
394073e76ca1: Waiting
bd77de5e24ac: Waiting
7f4a2804951b: Waiting
2e204641bd22: Waiting
557356969da2: Waiting
d714bce515d6: Waiting
3ffc01b466e2: Waiting
26be9f471823: Waiting
34ce8ba30961: Waiting
e6178d2c0976: Waiting
4f4fb700ef54: Waiting
41bbe81139bf: Verifying Checksum
41bbe81139bf: Download complete
d3d1a1487ac4: Download complete
50c408d125fb: Verifying Checksum
50c408d125fb: Download complete
77578dcf7512: Verifying Checksum
77578dcf7512: Download complete
efc084e41e4e: Verifying Checksum
efc084e41e4e: Download complete
fc23839b7c10: Verifying Checksum
fc23839b7c10: Download complete
41bbe81139bf: Pull complete
fe0a88c014e5: Verifying Checksum
fe0a88c014e5: Download complete
d3d1a1487ac4: Pull complete
eb96dc6a4490: Verifying Checksum
eb96dc6a4490: Download complete
0835b07b56bd: Verifying Checksum
0835b07b56bd: Download complete
1a82443b3661: Verifying Checksum
1a82443b3661: Download complete
50c408d125fb: Pull complete
3bf07d536922: Verifying Checksum
3bf07d536922: Download complete
77578dcf7512: Pull complete
165dc5423134: Verifying Checksum
165dc5423134: Download complete
5e67d63628c9: Verifying Checksum
5e67d63628c9: Download complete
252789b878c7: Verifying Checksum
252789b878c7: Download complete
3c75447a2c8c: Verifying Checksum
3c75447a2c8c: Download complete
7b7eb5a6d663: Verifying Checksum
7b7eb5a6d663: Download complete
64a79f466fbc: Verifying Checksum
64a79f466fbc: Download complete
bd77de5e24ac: Verifying Checksum
bd77de5e24ac: Download complete
394073e76ca1: Verifying Checksum
394073e76ca1: Download complete
efc084e41e4e: Pull complete
7f4a2804951b: Verifying Checksum
7f4a2804951b: Download complete
2e204641bd22: Verifying Checksum
2e204641bd22: Download complete
557356969da2: Verifying Checksum
557356969da2: Download complete
3ffc01b466e2: Verifying Checksum
3ffc01b466e2: Download complete
d714bce515d6: Verifying Checksum
d714bce515d6: Download complete
26be9f471823: Verifying Checksum
26be9f471823: Download complete
34ce8ba30961: Verifying Checksum
34ce8ba30961: Download complete
4f4fb700ef54: Verifying Checksum
4f4fb700ef54: Download complete
e6178d2c0976: Verifying Checksum
e6178d2c0976: Download complete
fc23839b7c10: Pull complete
fe0a88c014e5: Pull complete
1a82443b3661: Pull complete
0835b07b56bd: Pull complete
eb96dc6a4490: Pull complete
3bf07d536922: Pull complete
5e67d63628c9: Pull complete
165dc5423134: Pull complete
252789b878c7: Pull complete
3c75447a2c8c: Pull complete
7b7eb5a6d663: Pull complete
64a79f466fbc: Pull complete
394073e76ca1: Pull complete
bd77de5e24ac: Pull complete
7f4a2804951b: Pull complete
2e204641bd22: Pull complete
557356969da2: Pull complete
d714bce515d6: Pull complete
3ffc01b466e2: Pull complete
26be9f471823: Pull complete
34ce8ba30961: Pull complete
e6178d2c0976: Pull complete
4f4fb700ef54: Pull complete
Digest: sha256:9479da1b1874c2a54cd13e99f8d37b400107b97b62a427845af0d8cf19a36590
Status: Downloaded newer image for asia-east1-docker.pkg.dev/serverless-runtimes/google-22-full/builder/nodejs:nodejs_20250817_RC00
public-image-next: Pulling from serverless-runtimes/google-22/run/base
e27d8d14a9d0: Already exists
2c4b3deb4e6f: Pulling fs layer
7dc6fd285c84: Pulling fs layer
2c4b3deb4e6f: Verifying Checksum
2c4b3deb4e6f: Download complete
2c4b3deb4e6f: Pull complete
7dc6fd285c84: Verifying Checksum
7dc6fd285c84: Download complete
7dc6fd285c84: Pull complete
Digest: sha256:89efa74de89f4d203917e86961451946e232fcb5c413cc8e53c88107bd9d8d72
Status: Downloaded newer image for asia-east1-docker.pkg.dev/serverless-runtimes/google-22/run/base:public-image-next
===> ANALYZING
Image with name "asia-east1-docker.pkg.dev/elite-chiller-455712-c4/firebaseapphosting-images/beta-db:build-2025-08-25-018" not found
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
2025/08/25 08:05:35 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
Adding image label google.runtime-version: nodejs22
2025/08/25 08:05:35 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
Installing Node.js v22.18.0.
2025/08/25 08:05:35 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/nodejs-22.18.0.tar.gz
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
added 781 packages in 40s
Done "npm ci --quiet --no-fund --no-audit (NODE_ENV=development)" (39.704352487s)
--------------------------------------------------------------------------------
Running "npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_modules apphosting-adapter-nextjs-build"
Overriding Next Config to add configs optmized for Firebase App Hosting
Successfully created next.config.ts with Firebase App Hosting overrides
> nextn@0.1.0 build
> next build
   ▲ Next.js 15.3.3
   Creating an optimized production build ...
 ⚠ Compiled with warnings in 37.0s
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
./src/ai/flows/generate-subtasks-flow.ts
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
./src/ai/flows/generate-subtasks-flow.ts
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
./src/ai/flows/generate-subtasks-flow.ts
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
./src/ai/flows/generate-subtasks-flow.ts
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
Attempted import error: 'db' is not exported from '@/lib/firebase' (imported as 'db').
Import trace for requested module:
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
Attempted import error: 'db' is not exported from '@/lib/firebase' (imported as 'db').
Import trace for requested module:
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
Attempted import error: 'db' is not exported from '@/lib/firebase' (imported as 'db').
Import trace for requested module:
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
Attempted import error: 'db' is not exported from '@/lib/firebase' (imported as 'db').
Import trace for requested module:
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
Attempted import error: 'db' is not exported from '@/lib/firebase' (imported as 'db').
Import trace for requested module:
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
./node_modules/@genkit-ai/core/lib/tracing.js
Module not found: Can't resolve '@genkit-ai/firebase' in '/workspace/node_modules/@genkit-ai/core/lib'
Import trace for requested module:
./node_modules/@genkit-ai/core/lib/tracing.js
./node_modules/genkit/lib/tracing.js
./node_modules/genkit/lib/genkit.js
./node_modules/genkit/lib/index.mjs
./src/ai/genkit.ts
./src/ai/flows/generate-subtasks-flow.ts
 ✓ Compiled successfully in 60s
   Skipping validation of types
   Skipping linting
   Collecting page data ...
   Generating static pages (0/25) ...
Error occurred prerendering page "/login". Read more: https://nextjs.org/docs/messages/prerender-error
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
    at nH (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:64717)
    at nW (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:67762)
    at nz (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:65337)
    at nY (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:71193)
    at nX (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:69876)
    at nW (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:68029)
    at nz (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:65337)
    at nH (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:61531)
    at nW (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:67762)
    at nz (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:65337)
Export encountered an error on /(auth)/login/page: /login, exiting the build.
 ⨯ Next.js build worker exited with code: 1 and signal: null
Restoring original next config in project root
/layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:61
                reject(new Error(`Build process exited with error code ${code}.`));
                       ^
Error: Build process exited with error code 1.
    at ChildProcess.<anonymous> (/layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:61:24)
    at ChildProcess.emit (node:events:518:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)
Node.js v22.18.0
Done "npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_m..." (1m19.035038768s)
--------------------------------------------------------------------------------
failed to build: (error ID: eebdcfd4):
{"reason":"Failed Framework Build","code":"fah/failed-framework-build","userFacingMessage":"Your application failed to run the framework build command 'npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_modules apphosting-adapter-nextjs-build' successfully. Please check the raw log to address the error and confirm that your application builds locally before redeploying.","rawLog":"(error ID: d0a693a9):
Overriding Next Config to add configs optmized for Firebase App Hosting
Successfully created next.config.ts with Firebase App Hosting overrides
> nextn@0.1.0 build
> next build
   ▲ Next.js 15.3.3
   Creating an optimized production build ...
 ⚠ Compiled with warnings in 37.0s
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
./src/ai/flows/generate-subtasks-flow.ts
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
./src/ai/flows/generate-subtasks-flow.ts
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
./src/ai/flows/generate-subtasks-flow.ts
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
./src/ai/flows/generate-subtasks-flow.ts
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
Attempted import error: 'db' is not exported from '@/lib/firebase' (imported as 'db').
Import trace for requested module:
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
Attempted import error: 'db' is not exported from '@/lib/firebase' (imported as 'db').
Import trace for requested module:
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
Attempted import error: 'db' is not exported from '@/lib/firebase' (imported as 'db').
Import trace for requested module:
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
Attempted import error: 'db' is not exported from '@/lib/firebase' (imported as 'db').
Import trace for requested module:
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
Attempted import error: 'db' is not exported from '@/lib/firebase' (imported as 'db').
Import trace for requested module:
./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
./node_modules/@genkit-ai/core/lib/tracing.js
Module not found: Can't resolve '@genkit-ai/firebase' in '/workspace/node_modules/@genkit-ai/core/lib'
Import trace for requested module:
./node_modules/@genkit-ai/core/lib/tracing.js
./node_modules/genkit/lib/tracing.js
./node_modules/genkit/lib/genkit.js
./node_modules/genkit/lib/index.mjs
./src/ai/genkit.ts
./src/ai/flows/generate-subtasks-flow.ts
 ✓ Compiled successfully in 60s
   Skipping validation of types
   Skipping linting
   Collecting page data ...
   Generating static pages (0/25) ...
Error occurred prerendering page "/login". Read more: https://nextjs.org/docs/messages/prerender-error
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
    at nH (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:64717)
    at nW (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:67762)
    at nz (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:65337)
    at nY (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:71193)
    at nX (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:69876)
    at nW (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:68029)
    at nz (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:65337)
    at nH (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:61531)
    at nW (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:67762)
    at nz (/workspace/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:65337)
Export encountered an error on /(auth)/login/page: /login, exiting the build.
 ⨯ Next.js build worker exited with code: 1 and signal: null
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

