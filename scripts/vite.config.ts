/**
 * Registers the scripts lane as a test project of the workspace.
 *
 * @remarks
 *   The lane sits outside every workspace package, so the root names this directory in its test
 *   projects. It extends no tier: the scripts run under Node as they are, nothing here is packed,
 *   linting comes from the root, and the coverage policy counts `src/` alone.
 */

import { defineConfig } from "vite";

export default defineConfig({ test: { include: ["**/*.spec.ts"], name: "scripts" } });
