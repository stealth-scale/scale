/**
 * Renders the button that opens the file picker.
 *
 * @remarks
 *   The element is the actions package's `Button`, so every look, size and palette of the button
 *   applies, and it takes the upload's size unless it states its own. It is named by its words. A
 *   disabled or read-only upload disables it.
 */

import { type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { useFileUpload } from "#file-upload/machine.ts";

/**
 * Describes the props of the trigger: the props of the button.
 */
export type TriggerProps = ButtonProps;

/**
 * Renders the trigger with the machine's props.
 *
 * @param props - The props of the button, merged over the machine's.
 * @returns The `button` element.
 */
export function Trigger(props: TriggerProps): ReactElement {
  return <Button {...mergeProps(useFileUpload().getTriggerProps(), props)} />;
}
