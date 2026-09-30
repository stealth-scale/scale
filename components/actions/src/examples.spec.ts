import { createElement, type FC, type ReactElement, type ReactNode } from "react";

import { describe, expect, it } from "vitest";

import { ColorModeProvider } from "@stealthscale/provider-color-mode";
import { memoryStore } from "@stealthscale/settings";
import { accessibilityViolations } from "@stealthscale/testing-react";

const MODULES = import.meta.glob<Readonly<Record<string, FC>>>("./*/examples/*.example.tsx", {
  eager: true,
});

const EXAMPLES = Object.entries(MODULES).flatMap(([path, module]) =>
  Object.entries(module).map(([name, Example]) => [`${path} ${name}`, Example] as const),
);

/**
 * Renders an example inside a color mode provider with a store of its own, which the color mode
 * toggle's examples read.
 */
function moded(children: ReactNode): ReactElement {
  return createElement(ColorModeProvider, { app: "actions", store: memoryStore() }, children);
}

describe("examples", () => {
  it("finds at least one example file", () => {
    expect(EXAMPLES.length).toBeGreaterThan(0);
  });

  it.each(EXAMPLES)("returns no accessibility violation for %s", async (_name, Example) => {
    await expect(accessibilityViolations(Example, { wrapper: moded })).resolves.toStrictEqual([]);
  });
});
