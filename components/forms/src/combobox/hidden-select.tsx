/**
 * Renders the browser's `select` through which a form submits the combobox's value.
 *
 * @remarks
 *   The element is visually hidden, `aria-hidden` and out of the tab order, and focus that reaches
 *   it, such as a browser's focus on an invalid control, moves to the input. It has one selected
 *   option per selected value, so a form submits the values under `name`, as a select's does, and
 *   `required` refuses an empty value. A single combobox has an empty first option, which is
 *   selected while nothing is picked. The options come from the value and not from the collection,
 *   because the text narrows the collection. A reset of the form restores the value the combobox
 *   started with.
 */

import { type ReactElement, useEffect, useState } from "react";

import { useCallbackRef } from "@stealthscale/hooks";

import { withContext } from "#combobox/context.ts";
import { type ComboboxOptions, useCombobox } from "#combobox/machine.ts";
import { useShared } from "#combobox/state.ts";

/**
 * Renders the `select` with the combobox's hidden select class.
 */
const Submitted = withContext("select", "hiddenSelect");

/**
 * Empty first option of a single combobox, selected while nothing is picked.
 */
// eslint-disable-next-line jsx-a11y/control-has-associated-label -- the select is aria-hidden and the option has no words
const NONE = <option value="" />;

/**
 * Describes the props of the hidden select: the form attributes of the combobox.
 */
export type HiddenSelectProps = Pick<ComboboxOptions, "disabled" | "form" | "name" | "required">;

/**
 * Keeps the select's value where the root sets it. The select changes only with the machine's
 * value.
 */
function kept(): void {}

/**
 * Renders the hidden `select` with an option per selected value, and restores the value when its
 * form resets.
 *
 * @param props - The form attributes of the combobox.
 * @returns The `select` element.
 */
export function HiddenSelect(props: HiddenSelectProps): ReactElement {
  const api = useCombobox();
  const { reset } = useShared();
  const restored = useCallbackRef(reset);
  const [node, setNode] = useState<HTMLSelectElement | null>(null);
  const form = node?.form;

  useEffect(() => {
    form?.addEventListener("reset", restored);

    return (): void => {
      form?.removeEventListener("reset", restored);
    };
  }, [form, restored]);

  return (
    <Submitted
      {...props}
      aria-hidden="true"
      multiple={api.multiple}
      onChange={kept}
      onFocus={api.focus}
      ref={setNode}
      tabIndex={-1}
      value={api.multiple ? api.value : (api.value[0] ?? "")}
    >
      {api.multiple ? null : NONE}
      {api.value.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </Submitted>
  );
}
