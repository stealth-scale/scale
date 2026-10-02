import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { Indicator, Root } from "#swap/index.ts";
import { composed, framed, mark, toggled } from "#swap/swap.fixtures.tsx";

/**
 * Presses the button around the swap and waits a frame, in which a leaving mark's presence reads
 * its exit animation.
 */
async function turned(): Promise<void> {
  await pressed(screen.getByRole("button", { name: "Dark" }));
  await framed();
}

describe("Indicator", () => {
  it("shows the off mark while swap is false", async () => {
    await drawn(composed());

    expect(mark("Sun").dataset["hidden"]).toBeUndefined();
  });

  it("writes data-hidden on the on mark while swap is false", async () => {
    await drawn(composed());

    expect(mark("Moon").dataset["hidden"]).toBe("");
  });

  it("shows the on mark while swap is true", async () => {
    await drawn(composed({ swap: true }));

    expect(mark("Moon").dataset["hidden"]).toBeUndefined();
  });

  it("writes data-hidden on the off mark while swap is true", async () => {
    await drawn(composed({ swap: true }));

    expect(mark("Sun").dataset["hidden"]).toBe("");
  });

  it("leaves the hidden attribute off a mark that does not show", async () => {
    await drawn(composed());

    expect(mark("Moon").hidden).toBe(false);
  });

  it("writes data-type from type", async () => {
    await drawn(composed());

    expect([mark("Moon").dataset["type"], mark("Sun").dataset["type"]]).toStrictEqual([
      "on",
      "off",
    ]);
  });

  it("leaves data-state unset until swap first changes", async () => {
    await drawn(composed());

    expect(mark("Sun").dataset["state"]).toBeUndefined();
  });

  it("writes data-state as open on the mark that enters", async () => {
    await drawn(toggled());
    await turned();

    expect(mark("Moon").dataset["state"]).toBe("open");
  });

  it("writes data-state as closed on the mark that leaves", async () => {
    await drawn(toggled());
    await turned();

    expect(mark("Sun").dataset["state"]).toBe("closed");
  });

  it("writes data-hidden on the mark that leaves once it has no exit animation", async () => {
    await drawn(toggled());
    await turned();

    expect(mark("Sun").dataset["hidden"]).toBe("");
  });

  it("shows the mark that enters", async () => {
    await drawn(toggled());
    await turned();

    expect(mark("Moon").dataset["hidden"]).toBeUndefined();
  });

  it("renders nothing for a mark that has not shown under lazyMount", async () => {
    await drawn(composed({ lazyMount: true }));

    expect(screen.queryByText("Moon")).toBeNull();
  });

  it("renders a mark under lazyMount once it first shows", async () => {
    await drawn(toggled({ lazyMount: true }));
    await turned();

    expect(mark("Moon").dataset["hidden"]).toBeUndefined();
  });

  it("removes a mark once it leaves under unmountOnExit", async () => {
    await drawn(toggled({ unmountOnExit: true }));
    await turned();

    expect(screen.queryByText("Sun")).toBeNull();
  });

  it("merges the caller's props under its presence props", async () => {
    await drawn(
      <Root>
        <Indicator className="glyph" type="off">
          Sun
        </Indicator>
      </Root>,
    );

    expect(mark("Sun").classList.contains("glyph")).toBe(true);
  });
});
