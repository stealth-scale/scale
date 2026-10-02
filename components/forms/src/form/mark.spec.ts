import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn } from "@stealthscale/testing-react";

import { generated } from "#form/form.fixtures.tsx";

const CONTACT: Schema = {
  properties: {
    email: { title: "Email", type: "string" },
    news: { title: "News", type: "boolean" },
    phone: { title: "Phone", type: "string" },
  },
  required: ["email"],
  type: "object",
};

describe("Mark", () => {
  it("marks the required field with the required indicator by default", async () => {
    await drawn(generated(CONTACT));

    expect(screen.getAllByText("*")).toHaveLength(1);
  });

  it("leaves an optional field without words by default", async () => {
    await drawn(generated(CONTACT));

    expect(screen.queryByText("(optional)")).toBeNull();
  });

  it("names an optional field with its words where the form marks optional fields", async () => {
    await drawn(generated(CONTACT, { mark: "optional" }));

    expect(screen.getByRole("textbox", { name: "Phone (optional)" })).toBeDefined();
  });

  it("leaves a required field without a mark where the form marks optional fields", async () => {
    await drawn(generated(CONTACT, { mark: "optional" }));

    expect(screen.queryByText("*")).toBeNull();
  });

  it("reads the optional mark's words from the catalogue", async () => {
    await drawn(
      generated(CONTACT, {
        mark: "optional",
        translate: translateFrom({ "profile.marks.optional": "(not needed)" }),
      }),
    );

    expect(screen.getByRole("textbox", { name: "Phone (not needed)" })).toBeDefined();
  });

  it("leaves a checkbox without the optional mark", async () => {
    await drawn(generated(CONTACT, { mark: "optional" }));

    expect(screen.getByRole("checkbox", { name: "News" })).toBeDefined();
  });
});
