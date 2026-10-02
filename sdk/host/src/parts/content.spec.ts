import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { framed, OVERVIEWED } from "#parts/parts.fixtures.tsx";

describe("HostContent", () => {
  it("renders the extensions of the content region before the page", async () => {
    const { view } = await framed({ at: "/invoices", host: { product: OVERVIEWED } });
    const notice = within(view.container).getByText("notice");
    const page = within(view.container).getByText("overview");

    expect(notice.compareDocumentPosition(page) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("records the content region as mounted", async () => {
    const { host } = await framed({ at: "/invoices", host: { product: OVERVIEWED } });

    expect(host.stores.mounted.get().has("host/content")).toBe(true);
  });
});
