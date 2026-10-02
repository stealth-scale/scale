import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { composed, opened, panel } from "#floating-panel/floating-panel.fixtures.tsx";
import { Title } from "#floating-panel/index.ts";

describe("Title", () => {
  it("renders an h2", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("heading", { name: "Launch notes" }).tagName).toBe("H2");
  });

  it("renders another heading level through as", async () => {
    await drawn(opened(<Title as="h3">Layers</Title>));

    expect(screen.getByRole("heading", { level: 3, name: "Layers" })).toBeDefined();
  });

  it("writes the id the panel's aria-labelledby names", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("heading", { name: "Launch notes" }).id).toBe(
      panel().getAttribute("aria-labelledby"),
    );
  });
});
