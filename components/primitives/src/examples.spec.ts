import { type FC } from "react";

import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

const MODULES = import.meta.glob<Readonly<Record<string, FC>>>("./*/examples/*.example.tsx", {
  eager: true,
});

const EXAMPLES = Object.entries(MODULES).flatMap(([path, module]) =>
  Object.entries(module).map(([name, Example]) => [`${path} ${name}`, Example] as const),
);

describe("examples", () => {
  it("finds at least one example file", () => {
    expect(EXAMPLES.length).toBeGreaterThan(0);
  });

  it.each(EXAMPLES)("returns no accessibility violation for %s", async (_name, Example) => {
    await expect(accessibilityViolations(Example)).resolves.toStrictEqual([]);
  });
});
