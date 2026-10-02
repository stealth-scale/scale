import { type JSX } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type ButtonProps } from "@stealthscale/component-actions";
import { drawn } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { PageButton, PageLink, TriggerButton, TriggerLink } from "#pagination/bound.ts";
import { Root } from "#pagination/root.tsx";

describe("bound", () => {
  it.each([
    { Bound: PageButton, name: "PageButton", slot: "item", tag: "BUTTON" },
    { Bound: PageLink, name: "PageLink", slot: "item", tag: "A" },
    { Bound: TriggerButton, name: "TriggerButton", slot: "trigger", tag: "BUTTON" },
    { Bound: TriggerLink, name: "TriggerLink", slot: "trigger", tag: "A" },
  ] satisfies ReadonlyArray<{
    readonly Bound: (props: ButtonProps) => JSX.Element;
    readonly name: string;
    readonly slot: string;
    readonly tag: string;
  }>)("renders $tag with the $slot class from $name", async ({ Bound, slot, tag }) => {
    await drawn(
      <Root count={90}>
        <Bound aria-label="Bound part" />
      </Root>,
    );

    const element = screen.getByLabelText("Bound part");

    expect([
      element.tagName,
      element.classList.contains(slotClass("pagination", slot)),
    ]).toStrictEqual([tag, true]);
  });
});
