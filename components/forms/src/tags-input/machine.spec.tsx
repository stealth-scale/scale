import { type ReactElement, useState } from "react";

import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { type Messages, messagesOf } from "#tags-input/announced.ts";
import {
  ApiProvider,
  splitTagsInputProps,
  type TagsInputOptions,
  useTagsInput,
  useTagsInputMachine,
} from "#tags-input/machine.ts";
import {
  ACCOUNTS,
  announced,
  field,
  focused,
  keyed,
  typed,
} from "#tags-input/tags-input.fixtures.tsx";

/**
 * Words of every case that does not replace them.
 */
const DEFAULTS: Messages = messagesOf({}, false);

/**
 * Describes what the probe takes: the machine's options, the words and a field's control ID.
 */
interface Probed extends TagsInputOptions {
  /**
   * ID the field around the tags input gives its control, or nothing outside a field.
   */
  readonly control?: string | undefined;

  /**
   * Words the machine announces. Defaults to the component's.
   */
  readonly messages?: Messages | undefined;
}

/**
 * Renders the tags, the input and the hidden input through the hook a part reads.
 *
 * @returns The parts.
 */
function Parts(): ReactElement {
  const api = useTagsInput();

  return (
    <div {...api.getRootProps()}>
      <div {...api.getControlProps()}>
        {api.value.map((value, index) => (
          <span key={value} {...api.getItemProps({ index, value })}>
            <span {...api.getItemPreviewProps({ index, value })}>{value}</span>
          </span>
        ))}
        <input {...api.getInputProps()} aria-label="Accounts" />
      </div>
      <input {...api.getHiddenInputProps()} />
    </div>
  );
}

/**
 * Runs the machine with the options the case sets and renders its parts bare.
 *
 * @param props - The machine options, the words and the field's control ID.
 * @returns The parts, with the label's ID as text.
 */
function Running({ control, messages = DEFAULTS, ...options }: Probed): ReactElement {
  const { api, labelId } = useTagsInputMachine(options, messages, control);

  return (
    <ApiProvider value={api}>
      <span data-testid="label">{labelId}</span>
      <Parts />
    </ApiProvider>
  );
}

/**
 * Runs the machine with its tags held in state, as a controlled caller holds them.
 *
 * @returns The parts.
 */
function Controlled(): ReactElement {
  const [value, setValue] = useState(ACCOUNTS);

  return (
    <Running
      onValueChange={(details) => {
        setValue(details.value);
      }}
      value={value}
    />
  );
}

/**
 * Returns the preview of one tag, found by its text.
 */
function preview(value: string): HTMLElement {
  return screen.getByText(value);
}

describe("machine", () => {
  it("returns the machine's options first from splitTagsInputProps", () => {
    const [options] = splitTagsInputProps({ className: "mine", defaultValue: ["a"] });

    expect(options).toStrictEqual({ defaultValue: ["a"] });
  });

  it("returns the element's props second from splitTagsInputProps", () => {
    const [, rest] = splitTagsInputProps({ className: "mine", defaultValue: ["a"] });

    expect(rest).toStrictEqual({ className: "mine" });
  });

  it("leaves translations out of both halves", () => {
    const split = splitTagsInputProps({
      defaultValue: ["a"],
      translations: { clearTriggerLabel: "Empty" },
    });

    expect(split).toStrictEqual([{ defaultValue: ["a"] }, {}]);
  });

  it("gives the input the ID of the field's control", async () => {
    await drawn(<Running control="field-7" />);

    expect(screen.getByRole("textbox", { name: "Accounts" }).id).toBe("field-7");
  });

  it("keeps an input ID the caller passes in ids over the field's", async () => {
    await drawn(<Running control="field-7" ids={{ input: "own" }} />);

    expect(screen.getByRole("textbox", { name: "Accounts" }).id).toBe("own");
  });

  it("derives the label's ID from the id passed", async () => {
    await drawn(<Running id="probe" />);

    expect(screen.getByTestId("label").textContent).toBe("tags-input:probe:label");
  });

  it("keeps a label ID the caller passes in ids", async () => {
    await drawn(<Running ids={{ label: "own-label" }} />);

    expect(screen.getByTestId("label").textContent).toBe("own-label");
  });

  it("builds each tag's ID from its position", async () => {
    await drawn(<Running defaultValue={ACCOUNTS} id="probe" />);

    expect(preview("Halden & Co").id).toBe("tags-input:probe:tag:1");
  });

  it("leaves a tag at rest on a double press by default", async () => {
    await drawn(<Running defaultValue={ACCOUNTS} />);
    fireEvent.doubleClick(preview("Bridge Ledger"));
    await settled();

    expect(preview("Bridge Ledger").hidden).toBe(false);
  });

  it("edits a tag on a double press when editable", async () => {
    await drawn(<Running defaultValue={ACCOUNTS} editable />);
    fireEvent.doubleClick(preview("Bridge Ledger"));
    await settled();

    expect(preview("Bridge Ledger").hidden).toBe(true);
  });

  it("announces a tag added with Enter", async () => {
    await drawn(<Running defaultValue={ACCOUNTS} />);
    await focused();
    await typed("Pinecrest");
    await keyed("Enter");

    expect(announced()).toBe("Added Pinecrest");
  });

  it("reads the tags before a change from the change before it", async () => {
    await drawn(<Running defaultValue={ACCOUNTS} />);
    await focused();
    await typed("Pinecrest");
    await keyed("Enter");
    await typed("Northwind");
    await keyed("Enter");

    expect(announced()).toBe("Added Northwind");
  });

  it("reads the tags before a change from value when it is controlled", async () => {
    await drawn(<Controlled />);
    await focused();
    await typed("Pinecrest");
    await keyed("Enter");

    expect(announced()).toBe("Added Pinecrest");
  });

  it("announces the first highlight", async () => {
    await drawn(<Running defaultValue={ACCOUNTS} />);
    await focused();
    await keyed("Backspace");

    expect(announced()).toBe("Halden & Co. Press Backspace to remove it.");
  });

  it("announces a removal and the highlight that follows it", async () => {
    await drawn(<Running defaultValue={ACCOUNTS} />);
    await focused();
    await keyed("Backspace");
    await keyed("Backspace");

    expect(announced()).toBe("Removed Halden & Co. Bridge Ledger. Press Backspace to remove it.");
  });

  it("announces with the words the caller passes", async () => {
    await drawn(
      <Running defaultValue={ACCOUNTS} messages={{ ...DEFAULTS, added: () => "One more" }} />,
    );
    await focused();
    await typed("Pinecrest");
    await keyed("Enter");

    expect(announced()).toBe("One more");
  });

  it("leaves the machine's own live region out of the page", async () => {
    await drawn(<Running defaultValue={ACCOUNTS} />);
    await focused();
    await typed("Pinecrest");
    await keyed("Enter");

    expect(document.querySelector('[id="__live-region__"]')).toBeNull();
  });

  it("calls onValueChange with the tags", async () => {
    const onValueChange = vi.fn<NonNullable<TagsInputOptions["onValueChange"]>>();

    await drawn(<Running defaultValue={ACCOUNTS} onValueChange={onValueChange} />);
    await focused();
    await typed("Pinecrest");
    await keyed("Enter");

    expect(onValueChange).toHaveBeenLastCalledWith({ value: [...ACCOUNTS, "Pinecrest"] });
  });

  it("calls onHighlightChange with the highlighted tag's ID", async () => {
    const onHighlightChange = vi.fn<NonNullable<TagsInputOptions["onHighlightChange"]>>();

    await drawn(
      <Running defaultValue={ACCOUNTS} id="probe" onHighlightChange={onHighlightChange} />,
    );
    await focused();
    await keyed("Backspace");

    expect(onHighlightChange).toHaveBeenLastCalledWith({
      highlightedValue: "tags-input:probe:tag:1",
    });
  });

  it("keeps the text of a refused tag in the input", async () => {
    await drawn(<Running defaultValue={ACCOUNTS} validate={() => false} />);
    await focused();
    await typed("nope");
    await keyed("Enter");

    expect(field().value).toBe("nope");
  });

  it("calls onValueInvalid when validate refuses a tag", async () => {
    const onValueInvalid = vi.fn<NonNullable<TagsInputOptions["onValueInvalid"]>>();

    await drawn(<Running onValueInvalid={onValueInvalid} validate={() => false} />);
    await focused();
    await typed("nope");
    await keyed("Enter");

    expect(onValueInvalid).toHaveBeenCalledWith({ reason: "invalidTag" });
  });

  it("clears the input after it adds a tag", async () => {
    await drawn(<Running defaultValue={ACCOUNTS} />);
    await focused();
    await typed("Pinecrest");
    await keyed("Enter");

    expect(field().value).toBe("");
  });

  it("clears the input after it adds a tag past max", async () => {
    await drawn(<Running allowOverflow defaultValue={ACCOUNTS} max={2} />);
    await focused();
    await typed("Pinecrest");
    await keyed("Enter");

    expect(field().value).toBe("");
  });

  it("calls onInputValueChange with the typed text", async () => {
    const onInputValueChange = vi.fn<NonNullable<TagsInputOptions["onInputValueChange"]>>();

    await drawn(<Running onInputValueChange={onInputValueChange} />);
    await focused();
    await typed("Pine");

    expect(onInputValueChange).toHaveBeenLastCalledWith({ inputValue: "Pine" });
  });

  it("reads the input's text from inputValue when the caller controls it", async () => {
    await drawn(<Running inputValue="Pine" />);

    expect(field().value).toBe("Pine");
  });
});
