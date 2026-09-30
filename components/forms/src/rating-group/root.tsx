/**
 * Renders a rating group and runs the machine its items share.
 *
 * @remarks
 *   The element is a `div` in the `radiogroup` role, the same as the radio group's root, so the
 *   label inside it is part of the group and a disabled group sets `aria-disabled`. It is named
 *   by `RatingGroup.Label` while one is rendered, and otherwise by the label of a field or the
 *   legend of a fieldset around it. The root renders the hidden input a form submits: empty while
 *   nothing is rated, so `required` blocks a form, and named only when the caller states `name`.
 *   Inside a field the group lists the field's texts in `aria-describedby` and takes the field's
 *   disabled, invalid, read-only and required states and size. Inside a fieldset without a field
 *   it takes the group's disabled state and size. A prop the caller states overrides each.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { describedBy } from "#field/ids.ts";
import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset, useOptionalFieldset } from "#fieldset/state.ts";
import { withProvider } from "#rating-group/context.ts";
import {
  ApiProvider,
  type RatingGroupOptions,
  splitRatingGroupProps,
  useRatingGroupMachine,
} from "#rating-group/machine.ts";
import { LabellingProvider, SharedProvider } from "#rating-group/state.ts";

/**
 * Renders the root `div` with the recipe's variants.
 */
const Grouped = withProvider("div", "root");

/**
 * Returns the words an item is named by in English: "1 star", "3 stars", "3.5 stars".
 */
function stars(value: number): string {
  return value === 1 ? "1 star" : `${String(value)} stars`;
}

/**
 * Keeps the hidden input's value where the root sets it. The machine writes its own value into the
 * input, and React restores the controlled value after that write.
 */
function kept(): void {}

/**
 * Returns the value the hidden input submits: the rating, or nothing while nothing is rated.
 */
function submitted(value: number): string {
  return value > 0 ? String(value) : "";
}

/**
 * Returns the attributes that report the group's states to assistive technology and the recipe.
 *
 * @param disabled - Whether the group is disabled.
 * @param required - Whether a form requires a rating.
 * @param invalid - Whether the rating is invalid.
 * @returns The `aria-*` and `data-invalid` attributes, without the ones that are off.
 */
function marked(disabled: boolean, required: boolean, invalid: boolean): Record<string, string> {
  return omitUndefined({
    "aria-disabled": disabled ? "true" : undefined,
    "aria-invalid": invalid ? "true" : undefined,
    "aria-required": required ? "true" : undefined,
    "data-invalid": invalid ? "" : undefined,
  });
}

/**
 * Describes the props the root adds to the machine's options.
 */
export interface Rated {
  /**
   * Returns the words an item is named by, given the value it stands for. Defaults to English
   * stars: "1 star", "3 stars", "3.5 stars" on a half.
   */
  readonly getItemLabel?: ((value: number) => string) | undefined;

  /**
   * Whether the rating is invalid, which renders it in the error palette and sets `aria-invalid`.
   */
  readonly invalid?: boolean | undefined;
}

/**
 * Describes the props of the root: the machine's options, the words of the items, the invalid
 * state, the recipe's variants and the props of a `div`.
 *
 * @remarks
 *   The element's own props of the same names as the machine's options are left out, so no prop
 *   has two types.
 */
export interface RootProps
  extends
    Omit<ComponentProps<typeof Grouped>, keyof Rated | keyof RatingGroupOptions>,
    Rated,
    RatingGroupOptions {}

/**
 * Renders the group, the hidden input, and provides the machine's api and the items' words to the
 * parts.
 *
 * @param props - The machine's options, the words of the items, the invalid state, the recipe's
 *   variants and the props of a `div`.
 * @returns The `div` element that contains the label, the items and the hidden input.
 */
export function Root({
  children,
  getItemLabel = stars,
  invalid,
  ...props
}: RootProps): ReactElement {
  const field = useOptionalField();
  const group = useFieldset();
  const legend = useOptionalFieldset()?.ids.label;
  const [labelled, setLabelled] = useState(false);
  const [options, rest] = splitRatingGroupProps(props);
  const { size, ...attributes } = rest;
  const { invalid: inheritedInvalid, ...states } = inherited(field, group);
  const stated = { ...states, ...options };
  const { api, labelId, release } = useRatingGroupMachine(stated);
  const {
    "aria-labelledby": _machine,
    "data-part": _part,
    "data-scope": _scope,
    ...control
  } = api.getControlProps();
  const { defaultValue: _initial, name: _default, ...input } = api.getHiddenInputProps();
  const named = omitUndefined({
    "aria-describedby": field && describedBy(field.ids),
    "aria-labelledby": labelled ? labelId : (field?.ids.label ?? legend),
  });

  return (
    <ApiProvider value={api}>
      <LabellingProvider value={setLabelled}>
        <SharedProvider value={{ itemLabel: getItemLabel, release }}>
          <Grouped
            {...mergeProps(
              api.getRootProps(),
              control,
              named,
              marked(
                stated.disabled === true,
                stated.required === true,
                (invalid ?? inheritedInvalid) === true,
              ),
              attributes,
            )}
            {...omitUndefined({ size: sized(size, field, group) })}
          >
            {children}
            <input
              {...input}
              {...omitUndefined({ name: options.name })}
              onChange={kept}
              value={submitted(api.value)}
            />
          </Grouped>
        </SharedProvider>
      </LabellingProvider>
    </ApiProvider>
  );
}
