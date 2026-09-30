import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { composed, paths, stroked } from "#signature-pad/signature-pad.fixtures.tsx";

const STROKE = "M10,20 Q30,40 50,60 Z";

function trigger(): HTMLButtonElement {
  return screen.getByText<HTMLButtonElement>((_content, element) => element?.tagName === "BUTTON");
}

async function framed(): Promise<void> {
  await act(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      }),
  );
}

describe("ClearTrigger", () => {
  it("renders a button hidden while nothing is drawn", async () => {
    await drawn(composed());

    expect(trigger().hidden).toBe(true);
  });

  it("shows once a stroke is drawn", async () => {
    await drawn(composed());
    await stroked(screen.getByRole("application"));

    expect(screen.getByRole("button", { name: "Clear signature" }).hidden).toBe(false);
  });

  it("takes its name from label", async () => {
    await drawn(composed({ defaultPaths: [STROKE] }, { trigger: { label: "Start again" } }));

    expect(screen.getByRole("button", { name: "Start again" })).toBeDefined();
  });

  it("clears the strokes on a press", async () => {
    const { container } = await drawn(composed({ defaultPaths: [STROKE] }));

    await pressed(screen.getByRole("button", { name: "Clear signature" }));

    expect(paths(container)).toHaveLength(0);
  });

  it("moves focus to the control after a press", async () => {
    await drawn(composed({ defaultPaths: [STROKE] }));

    const button = screen.getByRole("button", { name: "Clear signature" });

    act(() => {
      button.focus();
    });
    await pressed(button);
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("application"));
  });

  it("keeps focus where a caller's handler cancels the press", async () => {
    await drawn(
      composed(
        { defaultPaths: [STROKE] },
        {
          trigger: {
            onClick: (event) => {
              event.preventDefault();
            },
          },
        },
      ),
    );

    const button = screen.getByRole("button", { name: "Clear signature" });

    act(() => {
      button.focus();
    });
    fireEvent.click(button);
    await settled();
    await framed();

    expect(document.activeElement).not.toBe(screen.getByRole("application"));
  });

  it("hides itself in a read-only pad", async () => {
    await drawn(composed({ defaultPaths: [STROKE], readOnly: true }));

    expect(trigger().hidden).toBe(true);
  });

  it("draws no stroke when a press starts on it", async () => {
    const { container } = await drawn(composed({ defaultPaths: [STROKE] }));

    fireEvent.pointerDown(screen.getByRole("button", { name: "Clear signature" }), {
      button: 0,
      clientX: 30,
      clientY: 30,
    });
    await settled();

    expect(paths(container)).toHaveLength(1);
  });
});
