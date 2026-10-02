import { render, screen } from "@testing-library/react";
import { useStickToBottom } from "use-stick-to-bottom";
import { describe, expect, it, vi } from "vitest";

import { framed, laidOut, log, pressed, transcript } from "#conversation/conversation.fixtures.tsx";

vi.mock(import("use-stick-to-bottom"), async (original) => {
  const engine = await original();

  return { ...engine, useStickToBottom: vi.fn(engine.useStickToBottom) };
});

/**
 * Stubs the media query the hook reads for reduced motion.
 */
function reducedMotion(reduced: boolean): void {
  vi.spyOn(globalThis, "matchMedia").mockImplementation(
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the stub implements the members the hook reads: matches and the two listener calls
    (query: string) =>
      ({
        addEventListener: () => {},
        matches: reduced && query === "(prefers-reduced-motion: reduce)",
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
}

describe("useConversation", () => {
  it("reports the view at the end at first", () => {
    render(transcript());

    expect(screen.getByRole("status").textContent).toBe("end");
  });

  it("follows new content with a spring", () => {
    reducedMotion(false);
    render(transcript());

    expect(vi.mocked(useStickToBottom).mock.lastCall).toStrictEqual([{ initial: "instant" }]);
  });

  it("follows new content at once under reduced motion", () => {
    reducedMotion(true);
    render(transcript());

    expect(vi.mocked(useStickToBottom).mock.lastCall).toStrictEqual([
      { initial: "instant", resize: "instant" },
    ]);
  });

  it("scrolls to the end in one frame under reduced motion", async () => {
    reducedMotion(true);
    laidOut();
    render(transcript());
    pressed("End");
    await framed();

    expect(log().scrollTop).toBe(299);
  });

  it("scrolls to the end over several frames without reduced motion", async () => {
    reducedMotion(false);
    laidOut();
    render(transcript());
    pressed("End");
    await framed();

    expect(log().scrollTop).toBeLessThan(299);
  });

  it("scrolls the viewport until the message is at its top", () => {
    reducedMotion(true);
    render(transcript());

    const scrollTo = vi.spyOn(log(), "scrollTo");

    vi.spyOn(log(), "getBoundingClientRect").mockReturnValue(new DOMRect(0, 40, 300, 100));
    vi.spyOn(screen.getByText(/invoice/u), "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 220, 300, 20),
    );
    pressed("First");

    expect(scrollTo.mock.lastCall).toStrictEqual([{ behavior: "instant", top: 180 }]);
  });

  it("scrolls to a message smoothly without reduced motion", () => {
    reducedMotion(false);
    render(transcript());

    const scrollTo = vi.spyOn(log(), "scrollTo");

    pressed("First");

    expect(scrollTo.mock.lastCall).toStrictEqual([{ behavior: "smooth", top: 0 }]);
  });

  it("stops following the end when it scrolls to a message", () => {
    render(transcript());
    pressed("First");

    expect(screen.getByRole("status").textContent).toBe("away");
  });

  it("scrolls nothing for an id the transcript does not contain", () => {
    render(transcript());

    const scrollTo = vi.spyOn(log(), "scrollTo");

    pressed("Missing");

    expect([scrollTo.mock.calls.length, screen.getByRole("status").textContent]).toStrictEqual([
      0,
      "end",
    ]);
  });

  it("scrolls to no message while no root renders its engine", () => {
    render(transcript({ owned: true }));
    pressed("First");

    expect(screen.getByRole("status").textContent).toBe("end");
  });
});
