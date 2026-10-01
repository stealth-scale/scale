import { act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fixtureHost } from "#host/host.fixtures.tsx";
import { routed } from "#host/routed.fixtures.tsx";
import { TITLED } from "#navigation/pages.fixtures.ts";

describe("useDocumentTitle", () => {
  it("titles the document after the page", async () => {
    await routed(fixtureHost(), "/time-off", TITLED);

    expect(document.title).toBe("Requests · People");
  });

  it("titles the document after the deepest page", async () => {
    await routed(fixtureHost(), "/time-off/7", TITLED);

    expect(document.title).toBe("Request 7 · People");
  });

  it("titles the document after the page a navigation returns to", async () => {
    const { router } = await routed(fixtureHost(), "/time-off/7", TITLED);

    await act(async () => {
      await router.navigate({ to: "/time-off" });
    });

    expect(document.title).toBe("Requests · People");
  });

  it("titles the document with the product's name after the page unmounts", async () => {
    const { view } = await routed(fixtureHost(), "/time-off", TITLED);

    view.unmount();

    expect(document.title).toBe("People");
  });
});
