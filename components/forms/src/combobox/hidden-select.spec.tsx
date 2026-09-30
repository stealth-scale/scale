import { act, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { accounts, framed, hiddenOf, input, picked } from "#combobox/combobox.fixtures.tsx";

/**
 * Returns the values of a select's selected options.
 */
function selected(select: HTMLSelectElement): string[] {
  return [...select.selectedOptions].map((option) => option.value);
}

describe("HiddenSelect", () => {
  it("hides the select from assistive technology", async () => {
    const { container } = await drawn(picked());

    expect(hiddenOf(container).getAttribute("aria-hidden")).toBe("true");
  });

  it("leaves the select out of the tab order", async () => {
    const { container } = await drawn(picked());

    expect(hiddenOf(container).tabIndex).toBe(-1);
  });

  it("renders an empty option before the option of the value", async () => {
    const { container } = await drawn(picked({ defaultValue: ["halden"] }));

    expect([...hiddenOf(container).options].map((option) => option.value)).toStrictEqual([
      "",
      "halden",
    ]);
  });

  it("selects the empty option while nothing is picked", async () => {
    const { container } = await drawn(picked());

    expect(hiddenOf(container).value).toBe("");
  });

  it("renders one selected option per value of a multiple combobox", async () => {
    const { container } = await drawn(
      picked({ defaultValue: ["bridge", "halden"], multiple: true }),
    );

    expect(selected(hiddenOf(container))).toStrictEqual(["bridge", "halden"]);
  });

  it("keeps the option of a value the collection no longer offers", async () => {
    const { container } = await drawn(
      picked({
        collection: accounts([{ id: "bridge", name: "Bridge Ledger" }]),
        defaultValue: ["halden"],
      }),
    );

    expect(hiddenOf(container).value).toBe("halden");
  });

  it("submits the value under its name", async () => {
    const { container } = await drawn(
      <form>{picked({ defaultValue: ["halden"], name: "account" })}</form>,
    );
    const form = container.querySelector("form");

    expect(form === null ? null : new FormData(form).get("account")).toBe("halden");
  });

  it("keeps the value when the browser changes the select", async () => {
    const { container } = await drawn(picked({ defaultValue: ["halden"] }));

    fireEvent.change(hiddenOf(container), { target: { value: "" } });
    await settled();

    expect(hiddenOf(container).value).toBe("halden");
  });

  it("refuses an empty value while required", async () => {
    const { container } = await drawn(picked({ required: true }));

    expect(hiddenOf(container).checkValidity()).toBe(false);
  });

  it("accepts a picked value while required", async () => {
    const { container } = await drawn(picked({ defaultValue: ["bridge"], required: true }));

    expect(hiddenOf(container).checkValidity()).toBe(true);
  });

  it("is disabled with the combobox", async () => {
    const { container } = await drawn(picked({ disabled: true }));

    expect(hiddenOf(container).disabled).toBe(true);
  });

  it("moves focus to the input when it takes focus", async () => {
    const { container } = await drawn(picked());

    act(() => {
      hiddenOf(container).focus();
    });
    await settled();

    expect(document.activeElement).toBe(input());
  });

  it("restores the first value when its form resets", async () => {
    const { container } = await drawn(<form>{picked({ defaultValue: ["bridge"] })}</form>);

    fireEvent.change(input(), { target: { value: "" } });
    await settled();
    act(() => {
      container.querySelector("form")?.reset();
    });
    await settled();
    await framed();

    expect(hiddenOf(container).value).toBe("bridge");
  });
});
