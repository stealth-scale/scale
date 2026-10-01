import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { PluginProvider } from "#scope/provider.tsx";
import { BOOK, contributedTo, FED, feedContract, slotted } from "#slots/feed.fixtures.ts";
import { Into } from "#slots/into.ts";
import { First } from "#slots/parts.fixtures.tsx";
import { Slot } from "#slots/slot.tsx";

describe("Into", () => {
  it("renders its content in the plugin scope it renders in", async () => {
    const { container } = await slotted(
      <>
        <Slot match="film" props={{ record: BOOK }} slot={feedContract.slots.item} />
        <PluginProvider pluginId="feed">
          <Into slot={feedContract.slots.item}>
            <First />
          </Into>
        </PluginProvider>
      </>,
      fixtureHost({ product: FED }),
    );

    expect(container.textContent).toBe("first feed");
  });

  it("contributes its children to the slot at order 0", () => {
    const host = fixtureHost({ product: FED });

    render(<Into slot={feedContract.slots.panel}>title</Into>, { wrapper: wrapperOf(host) });

    expect(contributedTo(host, "feed/panel")).toStrictEqual([["title", 0]]);
  });

  it("renders nothing where it is mounted", () => {
    const { container } = render(<Into slot={feedContract.slots.panel}>title</Into>, {
      wrapper: wrapperOf(fixtureHost({ product: FED })),
    });

    expect(container.innerHTML).toBe("");
  });

  it("keeps its place when its content changes", () => {
    const host = fixtureHost({ product: FED });
    const { rerender } = render(
      <>
        <Into slot={feedContract.slots.panel}>first</Into>
        <Into slot={feedContract.slots.panel}>second</Into>
      </>,
      { wrapper: wrapperOf(host) },
    );

    rerender(
      <>
        <Into slot={feedContract.slots.panel}>changed</Into>
        <Into slot={feedContract.slots.panel}>second</Into>
      </>,
    );

    expect(contributedTo(host, "feed/panel")).toStrictEqual([
      ["changed", 0],
      ["second", 0],
    ]);
  });

  it("keeps its content when its order changes", () => {
    const host = fixtureHost({ product: FED });
    const { rerender } = render(<Into slot={feedContract.slots.panel}>title</Into>, {
      wrapper: wrapperOf(host),
    });

    rerender(
      <Into order={5} slot={feedContract.slots.panel}>
        title
      </Into>,
    );

    expect(contributedTo(host, "feed/panel")).toStrictEqual([["title", 5]]);
  });

  it("keeps its latest content when its order changes after its content", () => {
    const host = fixtureHost({ product: FED });
    const { rerender } = render(<Into slot={feedContract.slots.panel}>title</Into>, {
      wrapper: wrapperOf(host),
    });

    rerender(<Into slot={feedContract.slots.panel}>changed</Into>);
    rerender(
      <Into order={5} slot={feedContract.slots.panel}>
        changed
      </Into>,
    );

    expect(contributedTo(host, "feed/panel")).toStrictEqual([["changed", 5]]);
  });

  it("leaves the slot when it unmounts", () => {
    const host = fixtureHost({ product: FED });
    const { unmount } = render(<Into slot={feedContract.slots.panel}>title</Into>, {
      wrapper: wrapperOf(host),
    });

    unmount();

    expect(contributedTo(host, "feed/panel")).toStrictEqual([]);
  });
});
