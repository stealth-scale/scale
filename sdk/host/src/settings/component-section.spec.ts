import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { waited } from "#parts/parts.fixtures.tsx";
import { settled } from "#settings/settings.fixtures.ts";

describe("ComponentSection", () => {
  it("renders the manifest's component with the section's id", async () => {
    await settled("/settings/host/account");
    await waited();

    expect(screen.getByText("avatar profile/avatar")).toBeTruthy();
  });
});
