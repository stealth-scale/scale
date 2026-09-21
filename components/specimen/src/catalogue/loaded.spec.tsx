import { type ReactElement } from "react";

import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { useDeclared } from "#catalogue/loaded.ts";
import { type Indexed } from "#catalogue/types.ts";
import { UPDATED } from "#catalogue/updated.ts";

const SIZES = { draw: (): ReactElement => <span />, title: "Sizes" };

function entry(load: () => Promise<unknown>): Indexed {
  return {
    about: "",
    group: "Data",
    id: "data/badge",
    load,
    namespace: "",
    package: "@stealthscale/component-data",
    path: "src/badge.specimen.tsx",
    title: "Badge",
  };
}

function Declaring({ of }: { readonly of: Indexed | undefined }): ReactElement {
  const { failure, page } = useDeclared(of);

  if (failure !== undefined) return <output>failed: {failure.message}</output>;

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

describe("useDeclared", () => {
  it("loads the page the entry names", async () => {
    const { container } = await drawn(
      <Declaring
        of={entry(() => Promise.resolve({ default: { id: "data/badge", scenes: [SIZES] } }))}
      />,
    );

    expect(container.textContent).toBe("Sizes");
  });

  it("reports why a module failed to load rather than holding an empty page", async () => {
    const { container } = await drawn(
      <Declaring of={entry(() => Promise.reject(new Error("gone")))} />,
    );

    expect(container.textContent).toBe("failed: gone");
  });

  it("reports a failure that is no error by what it said", async () => {
    const { container } = await drawn(
      // eslint-disable-next-line typescript/prefer-promise-reject-errors -- an import that fails with something other than an error is what the case covers
      <Declaring of={entry(() => Promise.reject("chunk 404"))} />,
    );

    expect(container.textContent).toBe("failed: chunk 404");
  });

  it("keeps quiet when the module arrives after the page has left the screen", async () => {
    const settle: Array<() => void> = [];
    const held = entry(
      () =>
        new Promise((resolve) => {
          settle.push(() => {
            resolve({ default: { id: "data/badge", scenes: [SIZES] } });
          });
        }),
    );
    const { unmount } = render(<Declaring of={held} />);

    unmount();

    await act(async () => {
      for (const done of settle) done();
      await Promise.resolve();
    });

    expect(document.body.textContent).toBe("");
  });

  it("keeps quiet when a module that fails arrives after the page has left the screen", async () => {
    const settle: Array<() => void> = [];
    const held = entry(
      () =>
        new Promise((_, reject) => {
          settle.push(() => {
            reject(new Error("gone"));
          });
        }),
    );
    const { unmount } = render(<Declaring of={held} />);

    unmount();

    await act(async () => {
      for (const done of settle) done();
      await Promise.resolve();
    });

    expect(document.body.textContent).toBe("");
  });

  it("replaces the page with what a hot update carries", async () => {
    const { container } = await drawn(
      <Declaring
        of={entry(() => Promise.resolve({ default: { id: "data/badge", scenes: [] } }))}
      />,
    );

    updated({ module: { default: { id: "data/badge", scenes: [SIZES] } } });

    expect(container.textContent).toBe("Sizes");
  });

  it("clears a failure with the page a hot update carries", async () => {
    const { container } = await drawn(
      <Declaring of={entry(() => Promise.reject(new Error("gone")))} />,
    );

    updated({ module: { default: { id: "data/badge", scenes: [SIZES] } } });

    expect(container.textContent).toBe("Sizes");
  });

  it("leaves the page alone for an update carrying no module", async () => {
    const { container } = await drawn(
      <Declaring
        of={entry(() => Promise.resolve({ default: { id: "data/badge", scenes: [SIZES] } }))}
      />,
    );

    updated({});

    expect(container.textContent).toBe("Sizes");
  });

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
