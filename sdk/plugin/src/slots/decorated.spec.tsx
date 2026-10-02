import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fixtureHost, wrapperOf } from "#host/host.fixtures.tsx";
import { Decorated } from "#slots/decorated.tsx";
import { DECORATORS, extensionIn, FED, FRAMED, loaded } from "#slots/feed.fixtures.ts";

describe("Decorated", () => {
  it("renders the extension between its before and after decorators", async () => {
    const { container } = await loaded(
      <Decorated
        decorators={DECORATORS}
        extension={extensionIn(FED, "notes/tail")}
        halos={[]}
        props={{ label: "Panel", targetId: "feed/panel" }}
      />,
      wrapperOf(fixtureHost({ product: FED })),
    );

    expect(container.textContent).toBe("mark notes/tailtail Panel feed/panelchip notes/tail");
  });

  it("wraps the extension in its wrap decorators", async () => {
    await loaded(
      <Decorated
        decorators={DECORATORS}
        extension={extensionIn(FED, "notes/tail")}
        halos={[]}
        props={{ label: "Panel", targetId: "feed/panel" }}
      />,
      wrapperOf(fixtureHost({ product: FED })),
    );

    const ring = screen.getByRole("region", { name: "ring notes/tail" });

    expect(within(ring).getByText("tail Panel feed/panel")).toBeTruthy();
  });

  it("renders a replace decorator in place of the extension", async () => {
    const { container } = await loaded(
      <Decorated
        decorators={DECORATORS}
        extension={extensionIn(FED, "notes/lead")}
        halos={[]}
        props={{ label: "Panel", targetId: "feed/panel" }}
      />,
      wrapperOf(fixtureHost({ product: FED })),
    );

    expect(container.textContent).toBe("cover notes/lead");
  });

  it("wraps the extension in the halos with the first outermost", async () => {
    await loaded(
      <Decorated
        decorators={[]}
        extension={extensionIn(FRAMED, "notes/lead")}
        halos={[extensionIn(FRAMED, "frames/glow"), extensionIn(FRAMED, "frames/halo")]}
        props={{ label: "Panel", targetId: "feed/panel" }}
      />,
      wrapperOf(fixtureHost({ product: FRAMED })),
    );

    const glow = screen.getByRole("region", { name: "glow notes/lead" });

    expect(within(glow).getByRole("region", { name: "halo notes/lead" })).toBeTruthy();
  });

  it("passes its children to a wrap extension", async () => {
    await loaded(
      <Decorated
        decorators={[]}
        extension={extensionIn(FED, "notes/border")}
        halos={[]}
        props={{ label: "Panel", targetId: "feed/panel" }}
      >
        inside
      </Decorated>,
      wrapperOf(fixtureHost({ product: FED })),
    );

    const border = screen.getByRole("region", { name: "border" });

    expect(within(border).getByText("inside")).toBeTruthy();
  });
});
