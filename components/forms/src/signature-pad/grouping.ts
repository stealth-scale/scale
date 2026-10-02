/**
 * Resolves what a signature pad takes from the field or the fieldset around it, and starts its
 * machine.
 *
 * @remarks
 *   The group and the control are named by `SignaturePad.Label` while one is rendered, and
 *   otherwise by the label of a field or the legend of a fieldset around it. Inside a field the
 *   control is described by the field's helper and error texts, and the pad takes the field's
 *   disabled, invalid, read-only and required states and size. Inside a fieldset without a field it
 *   takes the group's disabled state and size. A prop the caller states overrides each.
 */

import { useState } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { describedBy } from "#field/ids.ts";
import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset, useOptionalFieldset } from "#fieldset/state.ts";
import {
  type SignaturePadApi,
  type SignaturePadOptions,
  useSignaturePadMachine,
} from "#signature-pad/machine.ts";
import { type Shared } from "#signature-pad/state.ts";

/**
 * Size of a signature pad.
 */
export type Size = "lg" | "md" | "sm";

/**
 * Describes what the root renders from the settled state.
 */
export interface Grouping {
  /**
   * Connected api of the machine.
   */
  readonly api: SignaturePadApi;

  /**
   * Whether the pad is disabled.
   */
  readonly disabled: boolean;

  /**
   * `aria-labelledby` of the group, where it is settled.
   */
  readonly named: Readonly<Record<string, string>>;

  /**
   * Setter the label reports its mounting through.
   */
  readonly setLabelled: (labelled: boolean) => void;

  /**
   * State the root shares with the parts.
   */
  readonly shared: Shared;

  /**
   * Size of the pad.
   */
  readonly size: Size;
}

/**
 * Resolves the pad's state, name and description, and starts the machine.
 *
 * @param options - The machine options split from the root's props.
 * @param invalid - Whether the root states the signature invalid, or nothing.
 * @param size - The size the root states, or nothing.
 * @returns The machine's api, the pad's states and names, the label's setter and the size.
 */
export function useGrouping(
  options: SignaturePadOptions,
  invalid: boolean | undefined,
  size: Size | undefined,
): Grouping {
  const field = useOptionalField();
  const group = useFieldset();
  const legend = useOptionalFieldset()?.ids.label;
  const [labelled, setLabelled] = useState(false);
  const { invalid: inheritedInvalid, ...states } = inherited(field, group);
  const stated = { ...states, ...options };
  const { api, labelId } = useSignaturePadMachine(stated, field?.ids.control);
  const named = omitUndefined({
    "aria-labelledby": labelled ? labelId : (field?.ids.label ?? legend),
  });

  return {
    api,
    disabled: stated.disabled === true,
    named,
    setLabelled,
    shared: {
      described: {
        ...named,
        ...omitUndefined({ "aria-describedby": field && describedBy(field.ids) }),
      },
      ink: options.drawing?.fill,
      invalid: (invalid ?? inheritedInvalid) === true,
      readOnly: stated.readOnly === true,
    },
    size: sized(size, field, group) ?? "md",
  };
}
