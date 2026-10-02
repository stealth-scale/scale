/**
 * Renders a set of radio cards and runs the machine they share.
 *
 * @remarks
 *   The element is a `div` in the `radiogroup` role, over the radio group's machine and
 *   `useGrouping`, so the set is named, described and takes a field's or a fieldset's state the
 *   same way. An `aria-label` or `aria-labelledby` the caller passes takes precedence over the name
 *   the set settles on, and a `size` the caller passes over the inherited one.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#radio-card/context.ts";
import { useGrouping } from "#radio-group/grouping.ts";
import { ApiProvider, type RadioGroupOptions, splitRadioGroupProps } from "#radio-group/machine.ts";
import { LabellingProvider } from "#radio-group/state.ts";

/**
 * Renders the root `div` with the recipe's variants.
 */
const Grouped = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of
 * a `div`.
 *
 * @remarks
 *   The element's own props of the same names as the machine's options are left out, so no prop
 *   has two types.
 */
export interface RootProps
  extends Omit<ComponentProps<typeof Grouped>, keyof RadioGroupOptions>, RadioGroupOptions {}

/**
 * Renders the set and provides the machine's api to its cards.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element that contains the label and the cards.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitRadioGroupProps(props);
  const { children, size, ...attributes } = rest;
  const grouping = useGrouping(options);

  return (
    <ApiProvider value={grouping.api}>
      <LabellingProvider value={grouping.setLabelled}>
        <Grouped
          {...mergeProps(grouping.attributes, attributes)}
          {...omitUndefined({ size: size ?? grouping.size })}
        >
          {children}
        </Grouped>
      </LabellingProvider>
    </ApiProvider>
  );
}
