import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Schema, type Steps } from "@stealthscale/provider-form";
import { drawn } from "@stealthscale/testing-react";

import { generated } from "#form/form.fixtures.tsx";

const PROFILE: Schema = {
  properties: { bio: { type: "string" }, name: { type: "string" } },
  type: "object",
};

/**
 * Renders the profile in two steps of the kind given.
 */
async function stepped(kind: Steps["kind"]): Promise<void> {
  await drawn(
    generated(PROFILE, {
      presentation: {
        id: "profile",
        steps: {
          kind,
          of: [
            { name: "who", of: ["name"] },
            { name: "about", of: ["bio"] },
          ],
        },
      },
      submit: false,
    }),
  );
}

describe("Step", () => {
  it("renders a wizard's step under its heading", async () => {
    await stepped("wizard");

    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Who");
  });

  it("renders tabs for steps of the tabs kind", async () => {
    await stepped("tabs");

    expect(screen.getByRole("tablist")).toBeDefined();
  });
});
