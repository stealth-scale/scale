/**
 * Configures the build and the specification run for this package from the value it publishes.
 *
 * @remarks
 *   This package packs under its own export, so a defect in that value fails this package's build
 *   before a consumer installs it.
 */

import { defineConfig } from "vite";

import { plain } from "./src/index.ts";

export default defineConfig(plain);
