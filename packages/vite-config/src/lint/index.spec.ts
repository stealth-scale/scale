/**
 * Specifies which names the lint entry point publishes and which it holds back.
 */

import { describe, expect, it } from "vitest";

import * as lint from "#lint/index.ts";

describe("vite-config", () => {
  it("publishes the presets a config picks from", () => {
    expect(Object.keys(lint.preset).toSorted()).toStrictEqual(["base", "node", "web"]);
  });

  it("publishes the verbs a repository adds one at a time", () => {
    for (const verb of [
      "barrelled",
      "defaultExported",
      "forbid",
      "registered",
      "relax",
      "undocumented",
    ]) {
      expect(Object.keys(lint), `${verb} is not published`).toContain(verb);
    }
  });

  it("exports none of the rule groups", () => {
    for (const name of ["CATEGORIES", "DOCBLOCK", "PLUGINS", "SAFETY", "SIZE", "STYLE"]) {
      expect(Object.keys(lint), `${name} is published`).not.toContain(name);
    }
  });
});
