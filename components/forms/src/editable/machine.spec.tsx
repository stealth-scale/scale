import { type ReactElement } from "react";

import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { framed } from "#editable/editable.fixtures.tsx";
import {
  ApiProvider,
  type EditableOptions,
  splitEditableProps,
  useEditable,
  useEditableMachine,
} from "#editable/machine.ts";

/**
 * Describes what the probe takes: the machine's options and the control ID of a field.
 */
interface Probed extends EditableOptions {
  /**
   * ID the field around the editable gives its control, or nothing outside a field.
   */
  readonly control?: string | undefined;

  /**
   * Whether the probe renders an edit trigger. Defaults to false.
   */
  readonly triggered?: boolean | undefined;
}

/**
 * Runs the machine with the options the case sets and renders its parts bare.
 *
 * @param props - The machine options, the field's control ID and whether a trigger renders.
 * @returns The parts, with the label's and the preview's IDs as text.
 */
function Running({ control, triggered = false, ...options }: Probed): ReactElement {
  const { api, labelId, previewId } = useEditableMachine(options, control);

  return (
    <ApiProvider value={api}>
      <span data-testid="ids">{`${labelId} ${previewId}`}</span>
      <Parts triggered={triggered} />
    </ApiProvider>
  );
}

/**
 * Renders the preview, the input and an optional edit trigger through the hook a part reads.
 *
 * @param props - Whether the edit trigger renders.
 * @returns The parts.
 */
function Parts({ triggered }: { readonly triggered: boolean }): ReactElement {
  const api = useEditable();

  return (
    <div {...api.getRootProps()}>
      <button type="button" {...api.getPreviewProps()} aria-label="Preview" />
      <input {...api.getInputProps()} aria-label="Value" />
      {triggered ? <button {...api.getEditTriggerProps()} aria-label="Edit" /> : null}
    </div>
  );
}

describe("machine", () => {
  it("returns the machine's options first from splitEditableProps", () => {
    const [options] = splitEditableProps({ className: "mine", defaultValue: "Bridge" });

    expect(options).toStrictEqual({ defaultValue: "Bridge" });
  });

  it("returns the element's props second from splitEditableProps", () => {
    const [, rest] = splitEditableProps({ className: "mine", defaultValue: "Bridge" });

    expect(rest).toStrictEqual({ className: "mine" });
  });

  it("leaves translations out of both halves", () => {
    const split = splitEditableProps({ defaultValue: "Bridge", translations: { edit: "Edit" } });

    expect(split).toStrictEqual([{ defaultValue: "Bridge" }, {}]);
  });

  it("derives the label's and the preview's IDs from the id passed", async () => {
    await drawn(<Running id="name" />);

    expect(screen.getByTestId("ids").textContent).toBe("editable:name:label editable:name:preview");
  });

  it("keeps the IDs the caller passes in ids", async () => {
    await drawn(<Running ids={{ label: "heading", preview: "shown" }} />);

    expect(screen.getByTestId("ids").textContent).toBe("heading shown");
  });

  it("gives the input the ID passed as control", async () => {
    await drawn(<Running control="name-control" defaultEdit />);

    expect(screen.getByRole("textbox").id).toBe("name-control");
  });

  it("opens the field on a press by default", async () => {
    await drawn(<Running />);
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    await settled();

    expect(screen.getByRole("textbox").hidden).toBe(false);
  });

  it("opens the field on focus when activationMode is focus", async () => {
    await drawn(<Running activationMode="focus" />);
    fireEvent.focus(screen.getByRole("button", { name: "Preview" }));
    await settled();

    expect(screen.getByRole("textbox").hidden).toBe(false);
  });

  it("returns focus to the edit trigger after Enter", async () => {
    await drawn(<Running defaultEdit triggered />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    await settled();
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Edit" }));
  });

  it("returns focus to the preview after Enter without an edit trigger", async () => {
    await drawn(<Running defaultEdit />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    await settled();
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Preview" }));
  });

  it("leaves focus off the preview in focus mode", async () => {
    await drawn(<Running activationMode="focus" defaultEdit />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    await settled();
    await framed();

    expect(document.activeElement).not.toBe(screen.getByRole("button", { name: "Preview" }));
  });
});
