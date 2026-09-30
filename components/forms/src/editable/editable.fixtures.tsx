/**
 * Builds the editables the part specifications render, and drives them.
 */

import { type ReactElement } from "react";

import { act, fireEvent, screen } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { Area } from "#editable/area.tsx";
import { CancelTrigger } from "#editable/cancel-trigger.tsx";
import { Control } from "#editable/control.tsx";
import { EditTrigger } from "#editable/edit-trigger.tsx";
import { Input } from "#editable/input.tsx";
import { Label } from "#editable/label.tsx";
import { Preview } from "#editable/preview.tsx";
import { Root, type RootProps } from "#editable/root.tsx";
import { SubmitTrigger } from "#editable/submit-trigger.tsx";
import { Textarea } from "#editable/textarea.tsx";

/**
 * Describes how a composed editable differs from the default one.
 */
export interface Composition {
  /**
   * Whether the editable renders `Editable.Label`. Defaults to true.
   */
  readonly labelled?: boolean | undefined;

  /**
   * Whether the field is a textarea. Defaults to false.
   */
  readonly lines?: boolean | undefined;

  /**
   * Whether the editable renders its triggers. Defaults to true.
   */
  readonly triggered?: boolean | undefined;
}

/**
 * Composition of the default editable.
 */
const PLAIN: Composition = {};

/**
 * Renders a workspace name, with the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - Whether the label, the textarea and the triggers render.
 * @returns The editable.
 */
export function composed(props: RootProps = {}, composition: Composition = PLAIN): ReactElement {
  const { labelled = true, lines = false, triggered = true } = composition;

  return (
    <Root defaultValue="Bridge Ledger" {...props}>
      {labelled ? <Label>Workspace name</Label> : null}
      <Area>
        <Preview />
        {lines ? <Textarea /> : <Input />}
      </Area>
      {triggered ? (
        <Control>
          <EditTrigger />
          <SubmitTrigger />
          <CancelTrigger />
        </Control>
      ) : null}
    </Root>
  );
}

/**
 * Waits one animation frame inside `act`, for the machine's deferred focus.
 *
 * @returns A promise that resolves after the frame.
 */
export async function framed(): Promise<void> {
  await act(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      }),
  );
}

/**
 * Returns the preview, found by its role.
 *
 * @returns The preview element.
 */
export function preview(): HTMLElement {
  return screen.getByRole("button", { name: /Bridge Ledger/u });
}

/**
 * Opens the field with Enter on the preview and waits for the machine to focus it.
 *
 * @returns A promise that resolves once the field has focus.
 */
export async function opened(): Promise<void> {
  fireEvent.keyDown(preview(), { key: "Enter" });
  await settled();
  await framed();
}
