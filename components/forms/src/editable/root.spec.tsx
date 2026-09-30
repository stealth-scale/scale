import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { composed } from "#editable/editable.fixtures.tsx";
import { recipe } from "#editable/recipe.ts";
import { type RootProps } from "#editable/root.tsx";
import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";

describe("Root", () => {
  it("returns no accessibility violation for a labelled editable", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a div", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "editable", "root").tagName).toBe("DIV");
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(<Field.Root size="lg">{composed()}</Field.Root>);

    expect([...slotElement(container, "editable", "preview").classList]).toContain(
      variantClass("editable__preview", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({ size: "sm" })}</Field.Root>,
    );

    expect([...slotElement(container, "editable", "preview").classList]).toContain(
      variantClass("editable__preview", "size", "sm"),
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{composed()}</Fieldset.Root>);

    expect(
      screen.getByRole("button", { name: /Bridge Ledger/u }).getAttribute("aria-disabled"),
    ).toBe("true");
  });

  it("takes the read-only state of the field around it", async () => {
    await drawn(<Field.Root readOnly>{composed()}</Field.Root>);

    expect(screen.queryByRole("button", { name: /Bridge Ledger/u })).toBeNull();
  });

  it("takes the invalid state of the field around it", async () => {
    const { container } = await drawn(<Field.Root invalid>{composed()}</Field.Root>);

    expect(slotElement(container, "editable", "preview").getAttribute("aria-invalid")).toBe("true");
  });
});
