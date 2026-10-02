import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { field, keyedIn, mentioning } from "#composer/composer.fixtures.tsx";

describe("Suggestions", () => {
  it("renders a listbox named by suggestionsLabel", () => {
    render(mentioning());
    keyedIn("@ad");

    expect(screen.getByRole("listbox", { name: "People" })).toBeDefined();
  });

  it("names the listbox Suggestions unless suggestionsLabel is stated", () => {
    render(mentioning({ input: { suggestionsLabel: undefined } }));
    keyedIn("@ad");

    expect(screen.getByRole("listbox", { name: "Suggestions" })).toBeDefined();
  });

  it("renders the line under a suggestion's name", () => {
    const { container } = render(mentioning());

    keyedIn("@ad");

    expect(slotElement(container, "composer", "detail").textContent).toBe("Finance");
  });

  it("inserts a suggestion pressed", () => {
    render(mentioning());
    keyedIn("@ad");
    act(() => {
      screen.getByRole("option", { name: /Adil/u }).click();
    });

    expect(field().value).toBe("@Adil Rahman ");
  });

  it("cancels the mousedown of a press so the textarea keeps focus", () => {
    render(mentioning());
    keyedIn("@ad");

    expect(fireEvent.mouseDown(screen.getByRole("option", { name: /Adil/u }))).toBe(false);
  });

  it("highlights a suggestion under the pointer", () => {
    render(mentioning());
    keyedIn("@ad");
    fireEvent.pointerMove(screen.getByRole("option", { name: /Adil/u }));

    expect(screen.getByRole("option", { name: /Adil/u }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });
});
