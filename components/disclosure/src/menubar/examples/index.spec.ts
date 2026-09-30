import { createElement, type FC } from "react";

import { act, fireEvent, within } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import * as examples from "#menubar/examples/index.ts";

/**
 * Turns off axe's page rule for content outside a landmark, because the audit reads one bar and
 * its open panel rather than a page.
 */
const RULES = { region: { enabled: false } };

const BARS: ReadonlyArray<readonly [string, FC]> = [
  ["Controlled", examples.controlled.Controlled],
  ["Editor", examples.editor.Editor],
  ["Folded", examples.folded.Folded],
  ["Icons", examples.icons.Icons],
  ["Options", examples.options.Options],
  ["Rtl", examples.rtl.Rtl],
  ["Stop", examples.stop.Stop],
];

async function opened(Example: FC): Promise<() => void> {
  const { container, unmount } = await drawn(createElement(Example));

  for (const name of within(container).getAllByRole("menuitem").slice(0, 1)) {
    fireEvent.click(name);
  }

  await settled();

  return () => {
    act(() => {
      unmount();
    });
  };
}

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "controlled",
      "editor",
      "folded",
      "icons",
      "options",
      "rtl",
      "stop",
    ]);
  });

  it.each(BARS)("renders the first menu of %s into the document body", async (_name, Example) => {
    const unmount = await opened(Example);
    const panel = document.body.querySelector("[role=menu]");
    const inside = panel?.closest("[role=menubar]");

    unmount();

    expect(panel).not.toBeNull();
    expect(inside).toBeNull();
  });

  it.each(BARS)(
    "returns no accessibility violation in the document with a menu of %s open",
    async (_name, Example) => {
      const unmount = await opened(Example);
      const { violations } = await axe.run(document.body, {
        resultTypes: ["violations"],
        rules: RULES,
      });

      unmount();

      expect(violations.map((each) => `${each.id}: ${each.help}`)).toStrictEqual([]);
    },
  );
});
