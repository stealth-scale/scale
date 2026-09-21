import { type ReactElement } from "react";
import { renderToString } from "react-dom/server";

import { act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { entry } from "#catalogue/mounted.fixtures.tsx";
import { useFramed } from "#framed/context.ts";
import { Framed } from "#framed/framed.tsx";
import { type Specimen } from "#page.ts";

function Drawn(): ReactElement {
  const pick = useFramed();

  return <output>{JSON.stringify(pick)}</output>;
}

function Other(): ReactElement {
  return <output>other</output>;
}

const page: Specimen = {
  id: "actions/button",
  scenes: [
    { draw: Drawn, title: "Looks" },
    { draw: Other, frame: "bleed", title: "Sizes" },
    { draw: Other, title: "Screens", viewport: true },
  ],
};

const pages = [
  {
    ...entry("actions/button", "Actions", "Button"),
    load: (): Promise<unknown> => Promise.resolve({ default: page }),
  },
  {
    ...entry("actions/link", "Actions", "Link"),
    load: (): Promise<unknown> => Promise.reject(new Error("broken")),
  },
];

/**
 * Moves the fragment and tells the document, the way a navigation does, then lets the page load.
 */
async function moved(fragment: string): Promise<void> {
  await act(async () => {
    window.location.hash = fragment;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    await Promise.resolve();
  });
}

describe("Framed", () => {
  it("draws nothing where the fragment addresses no sample", async () => {
    await moved("");

    const { container } = await drawn(<Framed pages={pages} />);

    expect(container.textContent).toBe("");
  });

  it("draws nothing where there is no fragment to read", () => {
    expect(renderToString(<Framed pages={pages} />)).toBe("");
  });

  it("marks the document's root as framed while it is drawn", async () => {
    await moved("");

    const { unmount } = await drawn(<Framed pages={pages} />);

    expect(document.documentElement.dataset["framed"]).toBe("");

    unmount();

    expect(document.documentElement.dataset["framed"]).toBeUndefined();
  });

  it("draws the scene the fragment addresses with the pick in scope", async () => {
    await moved("#actions/button/0?v=1&x=2");

    const { container } = await drawn(<Framed pages={pages} />);

    expect(container.textContent).toBe('{"value":1,"across":2}');
    await moved("");
  });

  it("follows the fragment as it changes", async () => {
    await moved("#actions/button/0");

    const { container } = await drawn(<Framed pages={pages} />);

    expect(container.textContent).toBe("{}");

    await moved("#actions/button/1");

    expect(container.textContent).toBe("other");
    await moved("");
  });

  it("redraws the scene with the module a hot update replaced the page's with", async () => {
    await moved("#actions/button/1");

    const { container } = await drawn(<Framed pages={pages} />);
    const replaced = { ...page, scenes: [page.scenes[0], { draw: Drawn, title: "Sizes" }] };

    act(() => {
      window.dispatchEvent(
        new CustomEvent("specimen:updated", {
          detail: { id: "actions/button", module: { default: replaced } },
        }),
      );
      window.dispatchEvent(
        new CustomEvent("specimen:updated", {
          detail: { id: "actions/link", module: { default: page } },
        }),
      );
      window.dispatchEvent(
        new CustomEvent("specimen:updated", { detail: { id: "actions/button" } }),
      );
    });

    expect(container.textContent).toBe("{}");
    await moved("");
  });

  it("draws the scene in a pane that meets the window the way the scene meets its card", async () => {
    await moved("#actions/button/0");

    const { container } = await drawn(<Framed pages={pages} />);

    expect(recipeClasses(container, "pane")).toContain(variantClass("pane", "frame", "inset"));

    await moved("#actions/button/1");

    expect(recipeClasses(container, "pane")).toContain(variantClass("pane", "frame", "bleed"));
    await moved("");
  });

  it("draws a scene that fills the window at the window's edges", async () => {
    await moved("#actions/button/2");

    const { container } = await drawn(<Framed pages={pages} />);

    expect(recipeClasses(container, "pane")).toContain(variantClass("pane", "frame", "bleed"));
    await moved("");
  });

  it("keeps nothing from a page that loads or fails after the document has gone", async () => {
    const settle: Array<(module: unknown) => void> = [];
    const fail: Array<(reason: Error) => void> = [];
    const slow = [
      {
        ...entry("actions/slow", "Actions", "Slow"),
        load: (): Promise<unknown> =>
          new Promise((resolve, reject) => {
            settle.push(resolve);
            fail.push(reject);
          }),
      },
    ];

    await moved("#actions/slow/0");

    const loading = await drawn(<Framed pages={slow} />);

    loading.unmount();

    const failing = await drawn(<Framed pages={slow} />);

    failing.unmount();

    await act(async () => {
      settle[0]?.({ default: page });
      fail[1]?.(new Error("broken"));
      await Promise.resolve();
    });

    expect(document.body.textContent).toBe("");
    await moved("");
  });

  it("draws nothing for a scene the page does not have or a page that fails to load", async () => {
    await moved("#actions/button/7");

    const { container } = await drawn(<Framed pages={pages} />);

    expect(container.textContent).toBe("");

    await moved("#actions/link/0");

    expect(container.textContent).toBe("");
    await moved("");
  });
});
