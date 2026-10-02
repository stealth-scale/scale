import { renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { useSplitter } from "#splitter/machine.ts";
import { keyed, measured, PANELS, split } from "#splitter/splitter.fixtures.tsx";

/**
 * Two panels whose ids contain a space.
 */
const SPACED = [{ id: "my files" }, { id: "editor" }];

describe("useSplitter", () => {
  it("returns the default sizes", async () => {
    const { result } = renderHook(() => useSplitter({ defaultSize: [30, 70], panels: PANELS }));

    await settled();

    expect(result.current.getSizes()).toStrictEqual([30, 70]);
  });

  it("builds a panel's element id from its encoded id", async () => {
    const { result } = renderHook(() => useSplitter({ id: "demo", panels: SPACED }));

    await settled();

    expect(result.current.getPanelProps({ id: "my files" })["id"]).toBe(
      "splitter:demo:panel:my%20files",
    );
  });

  it("builds a trigger's element id from its encoded id", async () => {
    const { result } = renderHook(() => useSplitter({ id: "demo", panels: SPACED }));

    await settled();

    expect(result.current.getResizeTriggerProps({ id: "my files:editor" })["id"]).toBe(
      "splitter:demo:trigger:my%20files%3Aeditor",
    );
  });

  it("generates the machine's id without id", async () => {
    const { result } = renderHook(() => useSplitter({ panels: PANELS }));

    await settled();

    expect(result.current.getRootProps()["id"]).not.toBe("splitter:undefined");
  });

  it("collapses a collapsible panel before the trigger on Enter", async () => {
    measured();
    await drawn(split());
    await keyed(screen.getByRole("separator"), "Enter");

    expect(screen.getByRole("separator").getAttribute("aria-valuenow")).toBe("0");
  });

  it("restores the panel's size before the collapse on a second Enter", async () => {
    measured();
    await drawn(split());
    await keyed(screen.getByRole("separator"), "Enter");
    await keyed(screen.getByRole("separator"), "Enter");

    expect(screen.getByRole("separator").getAttribute("aria-valuenow")).toBe("30");
  });

  it("collapses a panel without a collapsed size to nothing on Enter", async () => {
    measured();
    await drawn(
      split({
        options: { panels: [{ collapsible: true, id: "files", minSize: 20 }, { id: "editor" }] },
      }),
    );
    await keyed(screen.getByRole("separator"), "Enter");

    expect(screen.getByRole("separator").getAttribute("aria-valuenow")).toBe("0");
  });

  it("leaves a panel that cannot collapse on Enter", async () => {
    measured();
    await drawn(split({ options: { panels: [{ id: "files" }, { id: "editor" }] } }));
    await keyed(screen.getByRole("separator"), "Enter");

    expect(screen.getByRole("separator").getAttribute("aria-valuenow")).toBe("30");
  });
});
