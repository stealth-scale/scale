import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LONELY, opened } from "#standalone/workbench.fixtures.tsx";

describe("StandaloneFrame", () => {
  it("renders a banner where a contribution fills the header", async () => {
    const page = await opened();

    expect(within(page.container).getByRole("banner")).toBeTruthy();
  });

  it("renders a footer where a contribution fills it", async () => {
    const page = await opened();

    expect(within(page.container).getByRole("contentinfo")).toBeTruthy();
  });

  it("renders the page in the main region", async () => {
    const page = await opened();

    expect(within(within(page.container).getByRole("main")).getByText("page")).toBeTruthy();
  });

  it("renders no banner where nothing fills the header", async () => {
    const page = await opened({ product: LONELY });

    expect(within(page.container).queryByRole("banner")).toBeNull();
  });

  it("renders no footer where nothing fills it", async () => {
    const page = await opened({ product: LONELY });

    expect(within(page.container).queryByRole("contentinfo")).toBeNull();
  });
});
