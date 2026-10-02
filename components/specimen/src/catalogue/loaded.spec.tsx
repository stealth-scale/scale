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

  it("returns the failure when the module rejects", async () => {
    const { container } = await drawn(
      <Declaring of={entry(() => Promise.reject(new Error("gone")))} />,
    );

    expect(container.textContent).toBe("failed: gone");
  });

  it("converts a rejection that is no Error into an Error with the value as its message", async () => {
    const { container } = await drawn(
      // eslint-disable-next-line typescript/prefer-promise-reject-errors -- an import that fails with something other than an error is what the case covers
      <Declaring of={entry(() => Promise.reject("chunk 404"))} />,
    );

    expect(container.textContent).toBe("failed: chunk 404");
  });

  it("sets no state when the module resolves after unmount", async () => {
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

  it("sets no state when the module rejects after unmount", async () => {
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

  it("replaces the page with the module a hot update supplies", async () => {
    const { container } = await drawn(
      <Declaring
        of={entry(() => Promise.resolve({ default: { id: "data/badge", scenes: [] } }))}
      />,
    );

    updated({ module: { default: { id: "data/badge", scenes: [SIZES] } } });

    expect(container.textContent).toBe("Sizes");
  });

  it("clears the failure when a hot update supplies a module", async () => {
    const { container } = await drawn(
      <Declaring of={entry(() => Promise.reject(new Error("gone")))} />,
    );

    updated({ module: { default: { id: "data/badge", scenes: [SIZES] } } });

    expect(container.textContent).toBe("Sizes");
  });

  it("keeps the page when an update supplies no module", async () => {
    const { container } = await drawn(
      <Declaring
        of={entry(() => Promise.resolve({ default: { id: "data/badge", scenes: [SIZES] } }))}
      />,
    );

    updated({});

    expect(container.textContent).toBe("Sizes");
  });

  it("returns no page when the entry is undefined", () => {
    const { container } = render(<Declaring of={undefined} />);

    expect(container.textContent).toBe("no page");
  });

  it("returns no page while the module for a new entry is pending", async () => {
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
