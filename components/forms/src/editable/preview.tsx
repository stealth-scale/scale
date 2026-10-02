/**
 * Renders an editable's value at rest.
 *
 * @remarks
 *   The element is a `span` that shows the value, or the placeholder while the value is empty. In
 *   an editable a person can change it is in the `button` role and in the tab order. The label and
 *   its own text name it. A press, Enter or Space opens the input, and so does a double press or
 *   focus when `activationMode` says so. A disabled editable keeps the role and leaves the tab
 *   order. A read-only editable renders plain text. The machine's `aria-label` of "edit" is left
 *   out, because it replaces the value as the name.
 */

import { type ComponentProps, type KeyboardEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#editable/context.ts";
import { useEditable } from "#editable/machine.ts";
import { useShared } from "#editable/state.ts";

/**
 * Renders the `span` with the editable's preview class.
 */
const Shown = withContext("span", "preview");

/**
 * Describes the props of the preview: the props of a `span`.
 */
export type PreviewProps = ComponentProps<typeof Shown>;

/**
 * Renders the preview with the machine's props, a role and a name while a person can change the
 * value.
 *
 * @param props - Attributes of the `span` element, merged over the machine's. Children replace the
 *   value it shows.
 * @returns The `span` element.
 */
export function Preview(props: PreviewProps): ReactElement {
  const api = useEditable();
  const { label, preview, readOnly } = useShared();
  const { "aria-label": _edit, "aria-readonly": _readOnly, ...machine } = api.getPreviewProps();

  /**
   * Opens the input on Enter or Space, the keys of a button.
   */
  const opened = (event: KeyboardEvent<HTMLSpanElement>): void => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    api.edit();
  };
  const pressable = readOnly
    ? {}
    : {
        "aria-labelledby": label === undefined ? preview : `${label} ${preview}`,
        onKeyDown: opened,
        role: "button",
      };

  return <Shown {...mergeProps(machine, pressable, props)} />;
}
