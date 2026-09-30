import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { recipe } from "#select/recipe.ts";
import { type RootProps } from "#select/root.tsx";
import { opened, picked, trigger } from "#select/select.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a labelled select", async () => {
    await expect(accessibilityViolations(() => picked())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation while the panel is open", async () => {
    await expect(
      accessibilityViolations(() => picked({ defaultOpen: true }), { frame: true }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: Partial<RootProps>) => (await drawn(picked(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a div", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "select", "root").tagName).toBe("DIV");
  });

  it("renders no panel before it first opens", async () => {
    await drawn(picked());

    expect(screen.queryByRole("listbox", { hidden: true })).toBeNull();
  });

  it("renders the panel once it opens", async () => {
    await drawn(picked());
    await opened();

    expect(screen.getByRole("listbox")).toBeDefined();
  });

  it("renders the hidden select as its last child", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "select", "root").lastElementChild?.tagName).toBe("SELECT");
  });

  it("calls onValueChange with the value of a pressed row", async () => {
    const changed = vi.fn<(details: { value: string[] }) => void>();

    await drawn(picked({ onValueChange: changed }));
    await opened();
    await pressed(screen.getByRole("option", { name: "Halden & Co" }));
    await settled();

    expect(changed).toHaveBeenCalledWith(expect.objectContaining({ value: ["halden"] }));
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(<Field.Root size="lg">{picked()}</Field.Root>);

    expect([...slotElement(container, "select", "trigger").classList]).toContain(
      variantClass("select__trigger", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(<Field.Root size="lg">{picked({ size: "sm" })}</Field.Root>);

    expect([...slotElement(container, "select", "trigger").classList]).toContain(
      variantClass("select__trigger", "size", "sm"),
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{picked()}</Fieldset.Root>);

    expect(trigger().hasAttribute("disabled")).toBe(true);
  });

  it("takes the required state of the field around it", async () => {
    await drawn(<Field.Root required>{picked()}</Field.Root>);

    expect(trigger().getAttribute("aria-required")).toBe("true");
  });

  it("takes the invalid state of the field around it", async () => {
    await drawn(<Field.Root invalid>{picked()}</Field.Root>);

    expect(trigger().getAttribute("aria-invalid")).toBe("true");
  });

  it("takes the read-only state of the field around it", async () => {
    await drawn(<Field.Root readOnly>{picked()}</Field.Root>);

    expect(trigger().dataset["readonly"]).toBe("");
  });

  it("points the field's label at the hidden select", async () => {
    const { container } = await drawn(
      <Field.Root>
        <Field.Label>Role</Field.Label>
        {picked({}, { labelled: false })}
      </Field.Root>,
    );

    expect(screen.getByText("Role").getAttribute("for")).toBe(
      container.querySelector("select")?.id,
    );
  });
});
