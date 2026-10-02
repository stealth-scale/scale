import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  type AccordionOptions,
  itemIds,
  MachineProvider,
  splitAccordionProps,
  splitItemProps,
  useAccordion,
  useAccordionMachine,
} from "#accordion/machine.ts";

/**
 * Runs the machine with the options the case sets and renders what a part reads from it.
 *
 * @param props - The machine options.
 * @returns The open values and the content ID of `returns policy`, rendered through a part's hook.
 */
function Running(props: AccordionOptions): ReactElement {
  const machine = useAccordionMachine(props);

  return (
    <MachineProvider value={machine}>
      <Reader />
    </MachineProvider>
  );
}

/**
 * Renders the machine's open values and a content ID through the hook a part reads them with.
 *
 * @returns The values and the ID as text.
 */
function Reader(): ReactElement {
  const { api, contentId } = useAccordion();

  return (
    <>
      <span data-testid="value">{api.value.join(",") || "none"}</span>
      <span data-testid="content">{contentId("returns policy")}</span>
    </>
  );
}

describe("machine", () => {
  it("returns the machine's options first from splitAccordionProps", () => {
    const [options] = splitAccordionProps({ collapsible: true, defaultValue: ["delivery"] });

    expect(options).toStrictEqual({ collapsible: true, defaultValue: ["delivery"] });
  });

  it("returns the element's props second from splitAccordionProps", () => {
    const [, rest] = splitAccordionProps({ className: "mine", multiple: true });

    expect(rest).toStrictEqual({ className: "mine" });
  });

  it("returns an item's options first from splitItemProps", () => {
    const [options, rest] = splitItemProps({
      className: "mine",
      disabled: true,
      value: "delivery",
    });

    expect([options, rest]).toStrictEqual([
      { disabled: true, value: "delivery" },
      { className: "mine" },
    ]);
  });

  it("percent-encodes the value in an item part's ID", () => {
    expect(itemIds("faq", "content")("Returns policy")).toBe(
      "accordion-faq-content-Returns%20policy",
    );
  });

  it("returns an api a part reads through the context", async () => {
    await drawn(<Running defaultValue={["delivery"]} />);

    expect(screen.getByTestId("value").textContent).toBe("delivery");
  });

  it("starts with no item open by default", async () => {
    await drawn(<Running />);

    expect(screen.getByTestId("value").textContent).toBe("none");
  });

  it("derives a content's ID from the accordion's id", async () => {
    await drawn(<Running id="faq" />);

    expect(screen.getByTestId("content").textContent).toBe(
      "accordion-faq-content-returns%20policy",
    );
  });

  it("returns the content ID the caller builds in ids", async () => {
    await drawn(<Running ids={{ itemContent: (value) => `panel-${value.length}` }} />);

    expect(screen.getByTestId("content").textContent).toBe("panel-14");
  });
});
