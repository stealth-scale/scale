import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { type Arguments, violations } from "@stealthscale/testing-config";
import { contextOf } from "@stealthscale/vite-config-core";

import * as published from "#index.ts";
import * as app from "#preset/app.ts";
import * as base from "#preset/base.ts";
import * as node from "#preset/node.ts";
import * as web from "#preset/web.ts";
import * as workspace from "#preset/workspace.ts";

const AT = join(import.meta.dirname, "..");

const BECAUSE = "a reason a reviewer can weigh";

function nothing(): undefined {
  return undefined;
}

const CONTEXT = contextOf({ command: "build", mode: "production" }, AT);

const ARGUMENTS: Arguments = {
  "build.base": ["/app/"],
  "deps.crawl": [{ because: BECAUSE, files: ["src/late.ts"] }],
  "deps.prebundle": [{ because: BECAUSE, deps: ["react"] }],
  "federation.host": [{ name: "host", remotes: ["remote"] }],
  "federation.remote": [{ exposes: { "./Thing": "./src/thing.ts" }, name: "remote" }],
  "fmt.group": [{ because: BECAUSE, name: "react", patterns: ["react"] }],
  "fmt.own": [{ because: BECAUSE, patterns: ["@acme/"] }],
  "fmt.skip": [{ because: BECAUSE, files: ["**/CHANGELOG.md"] }],
  "lint.barrelled": [["**/index.ts"]],
  "lint.composed": [["**/*.fixtures.tsx"]],
  "lint.defaultExported": [["**/*.stories.tsx"]],
  "lint.enforce": [{ because: BECAUSE, files: ["src/**"], rules: {} }],
  "lint.forbid": [{ because: BECAUSE, files: ["src/**"], packages: ["node:*"] }],
  "lint.relax": [{ because: BECAUSE, files: ["src/**"], rules: {} }],
  "lint.specified": [["**/*.spec.ts"]],
  "lint.undocumented": [["**/*.spec.ts"]],
  "pack.buildBefore": [{ because: BECAUSE, runs: nothing }],
  "pack.buildDone": [{ because: BECAUSE, runs: nothing }],
  "pack.buildPrepare": [{ because: BECAUSE, runs: nothing }],
  "pack.command": [{ tokens: "node scripts/tokens.js" }],
  "pack.entry": [["src/index.ts"]],
  "pack.hook": [{ because: BECAUSE, hooks: { "build:done": nothing } }],
  "pack.platform": ["neutral"],
  "pack.subpaths": [{ "./tokens": "src/tokens.ts" }],
  "preview.address": [4200, ["app.example.test"]],
  "preview.port": [4200],
  "run.task": ["docs", "vp build"],
  "server.address": [4200, ["app.example.test"]],
  "server.port": [4200],
  "server.proxy": ["/api", "http://127.0.0.1:8080"],
  "serving.bound": [CONTEXT],
  "serving.hosts": [CONTEXT],
  "serving.origins": [CONTEXT],
  "ssr.bundle": [{ because: BECAUSE, deps: ["lodash"] }],
  "staged.command": ["*.md", "vp fmt"],
  "test.environment": ["node"],
  "test.omit": [{ because: BECAUSE, files: ["src/main.tsx"] }],
  "test.prepare": [{ because: BECAUSE, files: ["src/prepare.ts"] }],
  "test.thresholds": [{ branches: 80 }],
};

describe("@stealthscale/vite-config", () => {
  it("reports no violations of the config package contract", async () => {
    await expect(
      violations({
        arguments: ARGUMENTS,
        at: AT,
        kind: "config",
        module: published,
        tiers: {
          "preset/app": app,
          "preset/base": base,
          "preset/node": node,
          "preset/web": web,
          "preset/workspace": workspace,
        },
      }),
    ).resolves.toStrictEqual([]);
  });
});
