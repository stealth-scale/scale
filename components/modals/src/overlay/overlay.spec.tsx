import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { Probe, type ProbeProps } from "#overlay/overlay.fixtures.tsx";
import { createOverlay, type CreateOverlayProps } from "#overlay/overlay.tsx";
import { stateOf } from "#overlay/store.fixtures.ts";

/**
 * Describes the props the viewport passes to an overlay's component in these cases.
 */
type Given = CreateOverlayProps<string> & ProbeProps;

/**
 * Creates a component that renders nothing and records the props it is called with.
 */
function spied(): Mock<(props: Given) => null> {
  return vi.fn<(props: Given) => null>(() => null);
}

/**
 * Returns the props of the last render of a spied component.
 *
 * @throws {@link Error} When the component has not rendered.
 */
function given(component: Mock<(props: Given) => null>): Given {
  const [props] = component.mock.lastCall ?? [];

  if (props === undefined) throw new Error("The component has not rendered.");

  return props;
}

/**
 * Waits for the frame in which the dialog machine starts its focus trap.
 */
async function framed(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

describe("createOverlay", () => {
  it("renders no component before an overlay opens", async () => {
    const component = spied();
    const overlay = createOverlay<ProbeProps, string>(component);

    await drawn(<overlay.Viewport />);

    expect(component).not.toHaveBeenCalled();
  });

  it("passes the props open names to the component", async () => {
    const component = spied();
    const overlay = createOverlay<ProbeProps, string>(component);

    void overlay.open("rename", { title: "Rename the report" });
    await drawn(<overlay.Viewport />);

    expect(given(component).title).toBe("Rename the report");
  });

  it("passes open as true while the overlay is open", async () => {
    const component = spied();
    const overlay = createOverlay<ProbeProps, string>(component);

    void overlay.open("rename", { title: "Rename the report" });
    await drawn(<overlay.Viewport />);

    expect(given(component).open).toBe(true);
  });

  it("resolves open with the result the component passes to close", async () => {
    const component = spied();
    const overlay = createOverlay<ProbeProps, string>(component);
    const answer = overlay.open("rename", { title: "Rename the report" });

    await drawn(<overlay.Viewport />);
    act(() => {
      given(component).close("Annual");
    });

    await expect(answer).resolves.toBe("Annual");
  });

  it("passes open as false once the component calls close", async () => {
    const component = spied();
    const overlay = createOverlay<ProbeProps, string>(component);

    void overlay.open("rename", { title: "Rename the report" });
    await drawn(<overlay.Viewport />);
    act(() => {
      given(component).close("Annual");
    });

    expect(given(component).open).toBe(false);
  });

  it("resolves open with undefined when onOpenChange reports a close", async () => {
    const component = spied();
    const overlay = createOverlay<ProbeProps, string>(component);
    const answer = overlay.open("rename", { title: "Rename the report" });

    await drawn(<overlay.Viewport />);
    act(() => {
      given(component).onOpenChange({ open: false });
    });

    await expect(answer).resolves.toBeUndefined();
  });

  it("keeps the overlay open when onOpenChange reports an open", async () => {
    const component = spied();
    const overlay = createOverlay<ProbeProps, string>(component);
    const answer = overlay.open("rename", { title: "Rename the report" });

    await drawn(<overlay.Viewport />);
    act(() => {
      given(component).onOpenChange({ open: true });
    });

    await expect(stateOf(answer)).resolves.toBe("pending");
  });

  it("removes the overlay when the component calls onExitComplete", async () => {
    const component = spied();
    const overlay = createOverlay<ProbeProps, string>(component);

    void overlay.open("rename", { title: "Rename the report" });
    await drawn(<overlay.Viewport />);
    act(() => {
      given(component).onOpenChange({ open: false });
      given(component).onExitComplete();
    });

    expect(overlay.has("rename")).toBe(false);
  });

  it("renders the overlays in the order their ids were first opened", async () => {
    const component = spied();
    const overlay = createOverlay<ProbeProps, string>(component);

    void overlay.open("rename", { title: "Rename the report" });
    void overlay.open("share", { title: "Share the report" });
    await drawn(<overlay.Viewport />);

    expect(component.mock.calls.map(([props]) => props.title)).toStrictEqual([
      "Rename the report",
      "Share the report",
    ]);
  });

  it("passes the props update merges to the component", async () => {
    const component = spied();
    const overlay = createOverlay<ProbeProps, string>(component);

    void overlay.open("rename", { title: "Rename the report" });
    await drawn(<overlay.Viewport />);
    act(() => {
      overlay.update("rename", { title: "Rename the invoice" });
    });

    expect(given(component).title).toBe("Rename the invoice");
  });

  it("resolves open with the result a dialog closes with", async () => {
    const overlay = createOverlay<ProbeProps, string>(Probe);
    const answer = overlay.open("rename", { title: "Rename the report" });

    await drawn(<overlay.Viewport />);
    await pressed(screen.getByRole("button", { name: "Accept" }));

    await expect(answer).resolves.toBe("accepted");
  });

  it("removes a dialog once it has closed", async () => {
    const overlay = createOverlay<ProbeProps, string>(Probe);

    void overlay.open("rename", { title: "Rename the report" });
    await drawn(<overlay.Viewport />);
    await pressed(screen.getByRole("button", { name: "Accept" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("resolves open with undefined when Escape dismisses a dialog", async () => {
    const overlay = createOverlay<ProbeProps, string>(Probe);
    const answer = overlay.open("rename", { title: "Rename the report" });

    await drawn(<overlay.Viewport />);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await settled();

    await expect(answer).resolves.toBeUndefined();
  });

  it("resolves open with undefined when the close trigger dismisses a dialog", async () => {
    const overlay = createOverlay<ProbeProps, string>(Probe);
    const answer = overlay.open("rename", { title: "Rename the report" });

    await drawn(<overlay.Viewport />);
    await pressed(screen.getByRole("button", { name: "Dismiss" }));

    await expect(answer).resolves.toBeUndefined();
  });

  it("moves focus into a dialog when it opens", async () => {
    const overlay = createOverlay<ProbeProps, string>(Probe);

    await drawn(
      <>
        <button type="button">Rename</button>
        <overlay.Viewport />
      </>,
    );
    act(() => {
      screen.getByRole("button", { name: "Rename" }).focus();
    });
    await act(async () => {
      void overlay.open("rename", { title: "Rename the report" });
      await Promise.resolve();
    });
    await framed();

    expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
  });

  it("returns focus to the element focused before a dialog opened", async () => {
    const overlay = createOverlay<ProbeProps, string>(Probe);

    await drawn(
      <>
        <button type="button">Rename</button>
        <overlay.Viewport />
      </>,
    );
    act(() => {
      screen.getByRole("button", { name: "Rename" }).focus();
    });
    await act(async () => {
      void overlay.open("rename", { title: "Rename the report" });
      await Promise.resolve();
    });
    await framed();
    await pressed(screen.getByRole("button", { name: "Dismiss" }));
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Rename" }));
  });
});
