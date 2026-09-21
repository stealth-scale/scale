import { type ReactElement } from "react";

import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { useDeclared, useLoadedPage } from "#catalogue/loaded.ts";
import { type Indexed } from "#catalogue/types.ts";
import { UPDATED } from "#catalogue/updated.ts";

const SIZES = { draw: (): ReactElement => <span />, title: "Sizes" };

function entry(load: () => Promise<unknown>, fragments?: Indexed["fragments"]): Indexed {
  return {
    about: "",
    fragments,
    group: "Data",
    id: "data/badge",
    load,
    namespace: "",
    package: "@stealthscale/component-data",
    path: "src/badge.specimen.tsx",
    title: "Badge",
  };
}

function Loading({ of }: { readonly of: Indexed }): ReactElement {
  const { fragments, page } = useLoadedPage(of);

  return (
    <output>
      {page?.scenes.map((scene) => scene.title).join(",") ?? "no page"}|
      {fragments?.imported.join(",") ?? "no fragments"}
    </output>
  );
}

function Declaring({ of }: { readonly of: Indexed | undefined }): ReactElement {
  const page = useDeclared(of);

  return <output>{page?.scenes.map((scene) => scene.title).join(",") ?? "no page"}</output>;
}

/**
 * Dispatches an update of the badge page, as the index does.
 */
function updated(detail: Record<string, unknown>): void {
  act(() => {
    window.dispatchEvent(new CustomEvent(UPDATED, { detail: { id: "data/badge", ...detail } }));
  });
}

describe("useLoadedPage", () => {
  it("loads the page and its sources", async () => {
    const { container } = await drawn(
      <Loading
        of={entry(
          () => Promise.resolve({ default: { id: "data/badge", scenes: [SIZES] } }),
          () => Promise.resolve({ fragments: {}, imported: ["Badge"] }),
        )}
      />,
    );

    expect(container.textContent).toBe("Sizes|Badge");
  });

  it("holds nothing for a module or sources that fail to load", async () => {
    const { container } = await drawn(
      <Loading
        of={entry(
          () => Promise.reject(new Error("gone")),
          () => Promise.reject(new Error("gone")),
        )}
      />,
    );

    expect(container.textContent).toBe("no page|no fragments");
  });

  it("holds nothing for a page with no sources", async () => {
    const { container } = await drawn(
      <Loading of={entry(() => Promise.resolve({ default: { id: "data/badge", scenes: [] } }))} />,
    );

    expect(container.textContent).toBe("|no fragments");
  });

  it("keeps quiet when the module or the sources arrive after the page has left the screen", async () => {
    const settle: Array<() => void> = [];
    const held = entry(
      () =>
        new Promise((resolve) => {
          settle.push(() => {
            resolve({ default: { id: "data/badge", scenes: [SIZES] } });
          });
        }),
      () =>
        new Promise((_, reject) => {
          settle.push(() => {
            reject(new Error("gone"));
          });
        }),
    );
    const { unmount } = render(<Loading of={held} />);

    unmount();

    await act(async () => {
      for (const done of settle) done();
      await Promise.resolve();
    });

    expect(document.body.textContent).toBe("");
  });

  it("replaces the page and the sources with what a hot update carries", async () => {
    const { container } = await drawn(
      <Loading of={entry(() => Promise.resolve({ default: { id: "data/badge", scenes: [] } }))} />,
    );

    updated({ module: { default: { id: "data/badge", scenes: [SIZES] } } });

    expect(container.textContent).toBe("Sizes|no fragments");

    updated({ fragments: { fragments: {}, imported: ["Chip"] } });

    expect(container.textContent).toBe("Sizes|Chip");
  });
});

describe("useDeclared", () => {
  it("holds nothing while no entry is named", () => {
    const { container } = render(<Declaring of={undefined} />);

    expect(container.textContent).toBe("no page");
  });

  it("shows nothing rather than the page before it once the entry moves on", async () => {
    const first = entry(() => Promise.resolve({ default: { id: "data/badge", scenes: [SIZES] } }));
    const { container, rerender } = await drawn(<Declaring of={first} />);

    expect(container.textContent).toBe("Sizes");

    const held: { settle?: (module: unknown) => void } = {};
    const pending = new Promise<unknown>((resolve) => {
      held.settle = resolve;
    });

    rerender(<Declaring of={entry(() => pending)} />);

    expect(container.textContent).toBe("no page");

    await act(async () => {
      held.settle?.({ default: { id: "data/badge", scenes: [] } });
      await Promise.resolve();
    });

    expect(container.textContent).toBe("");
  });
});
