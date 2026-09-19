import * as css from "@stealthscale/vite-config-css";
import * as react from "@stealthscale/vite-config-react";
import * as specimen from "@stealthscale/vite-config-specimen";

import { layers as exampleAppWorker } from "./examples/app-worker/vite.layers.ts";
import { layers as exampleLibUi } from "./examples/lib-ui/vite.layers.ts";
import { fmt, lint } from "./packages/vite-config/src/index.ts";
import { defineConfig } from "./packages/vite-config/src/preset/workspace.ts";

export default defineConfig(import.meta.dirname, {
  extends: [
    react.workspace(),
    css.workspace(),
    specimen.workspace(),

    fmt.skip({
      because:
        "changesets writes it from the changeset files and rewrites it on every release, so a " +
        "wrapped changelog is undone by the next `changeset version` and the diff it leaves is " +
        "nobody's to read. The text is already wrapped where it is written, in the changeset",
      files: ["**/CHANGELOG.md"],
    }),

    lint.relax({
      because:
        "a component package is created before the component it will hold, so its barrel states " +
        "in a module header what the package is for and exports nothing until the first " +
        "component lands in it",
      files: ["components/*/src/index.ts"],
      rules: { "unicorn/no-empty-file": "off" },
    }),

    lint.relax({
      because:
        "a command prints what it read, which is what the console is for, and drives one browser " +
        "through one step after another, which is what a loop of awaits is for",
      files: ["scripts/**/*.ts"],
      rules: { "no-await-in-loop": "off", "no-console": "off" },
    }),

    exampleAppWorker,
    exampleLibUi,
  ],
});
