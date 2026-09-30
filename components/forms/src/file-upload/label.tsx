/**
 * Renders the words that name a file upload.
 *
 * @remarks
 *   The element is a `label` for the hidden file input, so a press on it opens the file picker, and
 *   it names the group while it is mounted. Inside a field the field's label names the group
 *   instead.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#file-upload/context.ts";
import { useFileUpload } from "#file-upload/machine.ts";
import { useLabelled } from "#file-upload/state.ts";

/**
 * Renders the `label` with the file upload's label class.
 */
const Named = withContext("label", "label");

/**
 * Describes the props of the label: the props of a `label`.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Renders the label with the machine's props.
 *
 * @param props - Attributes and children of the `label` element, merged over the machine's.
 * @returns The `label` element.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useFileUpload();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
