import { createElement, type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Choice, isReport, REPORTED, useReportedChoices } from "#framed/report.ts";

const CHOICES: readonly Choice[] = [{ knob: "size", names: ["sm", "md"], part: "value" }];

function Offering({ choices }: { readonly choices?: readonly Choice[] }): ReactElement {
  useReportedChoices(choices);

  return createElement("output");
}

/**
 * Stands a page in as the document's parent, and hands back what was posted to it.
 */
function framed(): { readonly posted: ReturnType<typeof vi.fn>; readonly restore: () => void } {
  const posted = vi.fn();
  const parent = new Proxy(window, {
    get: (target, key): unknown => (key === "postMessage" ? posted : Reflect.get(target, key)),
  });
  const held = vi.spyOn(window, "parent", "get").mockReturnValue(parent);

  return {
    posted,
    restore: (): void => {
      held.mockRestore();
    },
  };
}

describe("isReport", () => {
  it("recognises a report of the axes", () => {
    expect(isReport({ address: "#a/0", choices: CHOICES, type: REPORTED })).toBe(true);
    expect(
      isReport({ address: "#a/0", choices: [{ names: [], part: "sample" }], type: REPORTED }),
    ).toBe(true);
  });

  it("refuses anything else", () => {
    expect(isReport(null)).toBe(false);
    expect(isReport("report")).toBe(false);
    expect(isReport({ choices: CHOICES, type: REPORTED })).toBe(false);
    expect(isReport({ address: "#a/0", type: REPORTED })).toBe(false);
    expect(isReport({ address: 0, choices: CHOICES, type: REPORTED })).toBe(false);
    expect(isReport({ address: "#a/0", choices: CHOICES, type: "other" })).toBe(false);
    expect(isReport({ address: "#a/0", choices: "size", type: REPORTED })).toBe(false);
  });

  it("refuses axes of another shape", () => {
    const refused = [
      "size",
      null,
      { names: ["sm"] },
      { part: "value" },
      { names: "sm", part: "value" },
      { names: [1], part: "value" },
      { names: ["sm"], part: "row" },
      { knob: 1, names: ["sm"], part: "value" },
    ];

    for (const choice of refused) {
      expect(isReport({ address: "#a/0", choices: [choice], type: REPORTED })).toBe(false);
    }
  });
});

describe("useReportedChoices", () => {
  it("posts nothing where the document is not framed or there are no axes", () => {
    const posted = vi.spyOn(window, "postMessage");

    render(createElement(Offering, { choices: CHOICES }));

    expect(posted).not.toHaveBeenCalled();

    posted.mockRestore();

    const { posted: framedPosted, restore } = framed();

    render(createElement(Offering));

    expect(framedPosted).not.toHaveBeenCalled();

    restore();
  });

  it("posts the axes to the page holding the document under the document's address", () => {
    const { posted, restore } = framed();

    render(createElement(Offering, { choices: CHOICES }));

    expect(posted).toHaveBeenCalledWith(
      { address: window.location.hash, choices: CHOICES, type: REPORTED },
      window.location.origin,
    );

    restore();
  });

  it("posts once for two renders whose axes hold the same", () => {
    const { posted, restore } = framed();
    const { rerender } = render(createElement(Offering, { choices: CHOICES }));

    rerender(createElement(Offering, { choices: CHOICES.map((choice) => ({ ...choice })) }));

    expect(posted).toHaveBeenCalledTimes(1);

    restore();
  });

  it("posts again once the axes hold something else", () => {
    const { posted, restore } = framed();
    const { rerender } = render(createElement(Offering, { choices: CHOICES }));

    rerender(createElement(Offering, { choices: [{ names: ["a"], part: "sample" }] }));

    expect(posted).toHaveBeenCalledTimes(2);

    restore();
  });
});
