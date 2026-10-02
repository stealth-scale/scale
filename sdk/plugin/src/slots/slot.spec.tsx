import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fixtureHost } from "#host/host.fixtures.tsx";
import { BOOK, FED, feedContract, FRAMED, slotted } from "#slots/feed.fixtures.ts";
import { Into } from "#slots/into.ts";
import { Slot } from "#slots/slot.tsx";

describe("Slot", () => {
  it("renders the extensions around its own content by position", async () => {
    const { container } = await slotted(
      <Slot props={{ label: "Panel" }} slot={feedContract.slots.panel}>
        own
      </Slot>,
      fixtureHost({ product: FED }),
    );

    expect(container.textContent).toBe(
      "cover notes/leadownmark notes/tailtail Panel feed/panelchip notes/tail",
    );
  });

  it("renders the pages' contributions after its extensions", async () => {
    const { container } = await slotted(
      <>
        <Slot props={{ label: "Panel" }} slot={feedContract.slots.panel} />
        <Into slot={feedContract.slots.panel}>title</Into>
      </>,
      fixtureHost({ product: FED }),
    );

    expect(container.textContent).toBe(
      "cover notes/leadmark notes/tailtail Panel feed/panelchip notes/tailtitle",
    );
  });

  it("wraps its content in its wrap extensions", async () => {
    await slotted(
      <Slot props={{ label: "Panel" }} slot={feedContract.slots.panel}>
        own
      </Slot>,
      fixtureHost({ product: FED }),
    );

    const border = screen.getByRole("region", { name: "border" });

    expect(within(border).getByText("own")).toBeTruthy();
  });

  it("wraps itself in the wrappers of every slot with the first outermost", async () => {
    await slotted(
      <Slot props={{ label: "Panel" }} slot={feedContract.slots.panel} />,
      fixtureHost({ product: FRAMED }),
    );

    const edge = screen.getByRole("region", { name: "edge feed/panel" });

    expect(within(edge).getByRole("region", { name: "outline feed/panel" })).toBeTruthy();
  });

  it("renders the extensions for its match in place of its content", async () => {
    const { container } = await slotted(
      <Slot match="book" props={{ record: BOOK }} slot={feedContract.slots.item}>
        own
      </Slot>,
      fixtureHost({ product: FED }),
    );

    expect(container.textContent).toBe("book Dunerestock");
  });

  it("renders its own content where no extension matches", async () => {
    const { container } = await slotted(
      <Slot match="film" props={{ record: BOOK }} slot={feedContract.slots.item}>
        own
      </Slot>,
      fixtureHost({ product: FED }),
    );

    expect(container.textContent).toBe("own");
  });

  it("drops an extension whose field condition its record fails", async () => {
    const { container } = await slotted(
      <Slot
        match="book"
        props={{ record: { ...BOOK, stock: 3 } }}
        slot={feedContract.slots.item}
      />,
      fixtureHost({ product: FED }),
    );

    expect(container.textContent).toBe("book Dune");
  });

  it("renders one extension in a slot of arity one", async () => {
    const { container } = await slotted(
      <Slot slot={feedContract.slots.badge} />,
      fixtureHost({ product: FED }),
    );

    expect(container.textContent).toBe("first notes");
  });

  it("reports each extension a slot of arity one leaves out", async () => {
    const host = fixtureHost({ product: FED });

    await slotted(<Slot slot={feedContract.slots.badge} />, host);

    expect(host.recorded.reported).toStrictEqual([
      { kind: "slot-full", slot: "feed/badge", target: "notes/second" },
    ]);
  });

  it("records what it renders in the mounted store", async () => {
    const host = fixtureHost({ product: FED });

    await slotted(<Slot props={{ label: "Panel" }} slot={feedContract.slots.panel} />, host);

    expect(host.mounted.get().get("feed/panel")).toStrictEqual([
      {
        dropped: { "notes/hint": "condition" },
        match: undefined,
        rendered: [
          "notes/border",
          "notes/lead",
          "notes/tail",
          "notes/cover",
          "notes/chip",
          "notes/mark",
          "notes/ring",
        ],
      },
    ]);
  });

  it("removes its record from the mounted store when it unmounts", async () => {
    const host = fixtureHost({ product: FED });
    const view = await slotted(
      <Slot props={{ label: "Panel" }} slot={feedContract.slots.panel} />,
      host,
    );

    view.unmount();

    expect(host.mounted.get().get("feed/panel")).toStrictEqual([]);
  });

  it("throws outside a host", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(<Slot props={{ label: "Panel" }} slot={feedContract.slots.panel} />),
    ).toThrow(
      "Slot() found no host. A plugin's components render inside a host, and a test renders them with renderPlugin.",
    );
  });

  it("refuses a keyed slot without a match", () => {
    // @ts-expect-error -- a keyed slot renders the extensions for one value
    const refused = <Slot props={{ record: BOOK }} slot={feedContract.slots.item} />;

    expect(refused).toBeTruthy();
  });

  it("refuses a match on a slot that is not keyed", () => {
    const { panel } = feedContract.slots;
    // @ts-expect-error -- a slot that is not keyed renders every extension placed in it
    const refused = <Slot match="book" props={{ label: "Panel" }} slot={panel} />;

    expect(refused).toBeTruthy();
  });

  it("refuses a slot without the props it declares", () => {
    // @ts-expect-error -- the panel's extensions render with a label
    const refused = <Slot slot={feedContract.slots.panel} />;

    expect(refused).toBeTruthy();
  });

  it("refuses props on a slot that declares none", () => {
    // @ts-expect-error -- the frame's extensions render with targetId alone
    const refused = <Slot props={{ label: "Panel" }} slot={feedContract.slots.frame} />;

    expect(refused).toBeTruthy();
  });
});
