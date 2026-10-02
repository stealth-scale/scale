import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { boundValue, written } from "#form/form.fixtures.tsx";

describe("useBoundField", () => {
  it("reads the value of the field in scope", async () => {
    await drawn(written("email", { email: "ada@example.com" }, () => boundValue()));

    expect(screen.getByRole("status").textContent).toBe("ada@example.com");
  });
});
