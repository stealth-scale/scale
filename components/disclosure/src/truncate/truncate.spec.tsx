import { fireEvent, screen } from "@testing-library/react";
import { setInteractionModality } from "@zag-js/focus-visible";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn, settled } from "@stealthscale/testing-react";
import { recipeElement, slotElement } from "@stealthscale/testing-theme";

import { clipping } from "#truncate/truncate.fixtures.ts";
import { Truncate } from "#truncate/truncate.tsx";

const NOTE =
  "Held at Emmerich am Rhein for a customs count that found two seals broken on the containers";

describe("Truncate", () => {
  it("returns no accessibility violation while clipped", async () => {
    clipping();

    await expect(
      accessibilityViolations(() => <Truncate focusable>{NOTE}</Truncate>),
    ).resolves.toStrictEqual([]);
  });

  it("renders the whole text", async () => {
    clipping();
    await drawn(<Truncate>{NOTE}</Truncate>);

    expect(screen.getByText(NOTE).tagName).toBe("SPAN");
  });

  it("renders the tooltip's root as a span", async () => {
    const { container } = await drawn(<Truncate>{NOTE}</Truncate>);

    expect(slotElement(container, "tooltip", "root").tagName).toBe("SPAN");
  });

  it("keeps one line when lines is absent", async () => {
    const { container } = await drawn(<Truncate>{NOTE}</Truncate>);

    expect(recipeElement(container, "truncate").style.getPropertyValue("--truncate-lines")).toBe(
      "1",
    );
  });

  it("keeps the lines passed as lines", async () => {
    const { container } = await drawn(<Truncate lines={3}>{NOTE}</Truncate>);

    expect(recipeElement(container, "truncate").style.getPropertyValue("--truncate-lines")).toBe(
      "3",
    );
  });

  it("sets data-truncated when the text measures as clipped", async () => {
    clipping();
    const { container } = await drawn(<Truncate>{NOTE}</Truncate>);
    await settled();

    expect(recipeElement(container, "truncate").dataset["truncated"]).toBe("");
  });

  it("takes a tab stop when focusable and clipped", async () => {
    clipping();
    const { container } = await drawn(<Truncate focusable>{NOTE}</Truncate>);
    await settled();

    expect(recipeElement(container, "truncate").tabIndex).toBe(0);
  });

  it("opens the tooltip with the whole text on keyboard focus when clipped", async () => {
    clipping();
    const { container } = await drawn(<Truncate focusable>{NOTE}</Truncate>);
    await settled();
    setInteractionModality("keyboard");
    fireEvent.focus(recipeElement(container, "truncate"));
    await settled();

    expect(screen.getByRole("tooltip", { hidden: true }).textContent).toBe(NOTE);
  });

  it("hides the tooltip's content from assistive technology", async () => {
    clipping();
    const { container } = await drawn(<Truncate focusable>{NOTE}</Truncate>);
    await settled();
    setInteractionModality("keyboard");
    fireEvent.focus(recipeElement(container, "truncate"));
    await settled();

    expect(screen.getByRole("tooltip", { hidden: true }).getAttribute("aria-hidden")).toBe("true");
  });

  it("keeps the tooltip open when the page scrolls", async () => {
    clipping();
    const { container } = await drawn(<Truncate focusable>{NOTE}</Truncate>);
    await settled();
    setInteractionModality("keyboard");
    fireEvent.focus(recipeElement(container, "truncate"));
    await settled();
    fireEvent.scroll(globalThis.window);
    await settled();

    expect(screen.getByRole("tooltip", { hidden: true }).dataset["state"]).toBe("open");
  });

  it("keeps the tooltip closed on keyboard focus when the text fits", async () => {
    const { container } = await drawn(<Truncate focusable>{NOTE}</Truncate>);
    await settled();
    setInteractionModality("keyboard");
    fireEvent.focus(recipeElement(container, "truncate"));
    await settled();

    expect(screen.queryByRole("tooltip", { hidden: true })).toBeNull();
  });
});
