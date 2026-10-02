import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { generated, written } from "#form/form.fixtures.tsx";
import { useAppForm, useSchemaForm, withFieldGroup, withForm } from "#form/hook.ts";

describe("hook", () => {
  it("publishes the two hooks and the two helpers", () => {
    expect(
      [useAppForm, useSchemaForm, withFieldGroup, withForm].map((each) => typeof each),
    ).toStrictEqual(["function", "function", "function", "function"]);
  });

  it("builds a form from a schema that renders the package's fields", async () => {
    await drawn(generated({ properties: { email: { type: "string" } }, type: "object" }));

    expect(screen.getByRole("textbox", { name: "Email" })).toBeDefined();
  });

  it("builds a form from the library's own options whose fields read the package's components", async () => {
    await drawn(written("email", { email: "" }, (field) => <field.Text />));

    expect(screen.getByRole("textbox", { name: "Email" })).toBeDefined();
  });
});
