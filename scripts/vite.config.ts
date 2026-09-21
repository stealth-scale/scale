/**
 * Runs the specifications of the scripts lane as a test project of the workspace.
 *
 * @remarks
 *   The lane is outside every workspace package, so the root lists this directory as a project
 *   beside the packages. A plain Vite configuration rather than a tier: the scripts run under Node
 *   as they are, and nothing here is packed, linted apart from the root, or counted by the
 *   coverage policy, which counts `src/` alone.
 */

import { defineConfig } from "vite";

export default defineConfig({ test: { include: ["**/*.spec.ts"], name: "scripts" } });
