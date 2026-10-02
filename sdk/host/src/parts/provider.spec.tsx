import { within } from "@testing-library/react";
import { describe, expect, it, type MockInstance, vi } from "vitest";

import { type QueryClient } from "@stealthscale/provider-data";

import { internalsOf } from "#host/internals.ts";
import { ClientProbe, Crash } from "#parts/frames.fixtures.tsx";
import { framed, named, TITLED } from "#parts/parts.fixtures.tsx";
import { silenced } from "#routes/routes.fixtures.ts";

describe("HostProvider", () => {
  it("renders the extensions of the root region after the router", async () => {
    const { view } = await framed({ at: "/time-off" });
    const main = within(view.container).getByRole("main");
    const socket = within(view.container).getByText("socket");

    expect(main.compareDocumentPosition(socket) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders the host's data client for the tree", async () => {
    const seen = vi.fn<(client: QueryClient) => void>();
    const { host } = await framed({ at: "/time-off", children: () => <ClientProbe seen={seen} /> });

    expect(seen.mock.lastCall?.[0]).toBe(host.data);
  });

  it("titles the document with the product's name", async () => {
    named();
    document.title = "";

    await framed({ at: "/time-off" });

    expect(document.title).toBe("People");
  });

  it("leaves the title to a page that titles the document", async () => {
    named();
    document.title = "";

    await framed({ at: "/invoices", host: { product: TITLED } });

    expect(document.title).toBe("Invoices · People");
  });

  it("connects the host to the router while it is mounted", async () => {
    let connect: MockInstance | undefined;

    await framed({
      at: "/time-off",
      prepare: (host) => {
        connect = vi.spyOn(internalsOf(host), "connect");
      },
    });

    expect(connect).toHaveBeenCalledOnce();
  });

  it("renders the failure page when a child outside the router throws", async () => {
    silenced();
    named();

    const { view } = await framed({ at: "/time-off", children: () => <Crash /> });

    expect(within(view.container).getByRole("heading", { level: 1 }).textContent).toBe(
      "People could not be shown",
    );
  });

  it("reports an error outside the router with the target host", async () => {
    silenced();

    const { host } = await framed({ at: "/time-off", children: () => <Crash /> });

    expect(host.stores.reports.get().at(-1)).toMatchObject({
      kind: "render-failed",
      target: "host",
    });
  });
});
