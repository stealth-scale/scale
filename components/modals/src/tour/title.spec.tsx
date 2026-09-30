import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Description, Title } from "#tour/index.ts";
import { started } from "#tour/tour.fixtures.tsx";

describe("Title", () => {
  it("renders an h2", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "title").tagName).toBe("H2");
  });

  it("shows the step's title", async () => {
    await started();

    expect(screen.getByRole("heading").textContent).toBe("Welcome");
  });

  it("shows its children in place of the step's title", async () => {
    await started({
      card: (
        <>
          <Title>Take a look around</Title>
          <Description />
        </>
      ),
    });

    expect(screen.getByRole("dialog", { name: "Take a look around" })).toBeDefined();
  });

  it("renders the element as names", async () => {
    const { container } = await started({
      card: (
        <>
          <Title as="h3" />
          <Description />
        </>
      ),
    });

    expect(slotElement(container, "tour", "title").tagName).toBe("H3");
  });
});
