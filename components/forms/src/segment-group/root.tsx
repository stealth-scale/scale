/**
 * Renders the segment group's track and runs the machine its items share.
 *
 * @remarks
 *   The element is a `div` in the `radiogroup` role, over the radio group's machine and
 *   `useGrouping`, so the group is named, described and takes a field's or a fieldset's state the
 *   same way. The group has no label of its own. It is named by an `aria-label` or
 *   `aria-labelledby` the caller passes, otherwise by the label of the field or the legend of the
 *   fieldset around it. The group lays its items in a row unless `orientation` says otherwise. The
 *   root renders the thumb before the items, because the machine measures the checked item only
 *   while the thumb is rendered. The thumb is `aria-hidden`, because the checked radio reports the
 *   state.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { useGrouping } from "#radio-group/grouping.ts";
import { ApiProvider, type RadioGroupOptions, splitRadioGroupProps } from "#radio-group/machine.ts";
import { withContext, withProvider } from "#segment-group/context.ts";

/**
 * Renders the root `div` with the recipe's variants.
 */
const Track = withProvider("div", "root");

/**
 * Renders the thumb `div` with the segment group's indicator class.
 */
const Thumb = withContext("div", "indicator");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of
 * a `div`.
 *
 * @remarks
 *   The element's own props of the same names as the machine's options are left out, so no prop
 *   has two types.
 */
export interface RootProps
  extends Omit<ComponentProps<typeof Track>, keyof RadioGroupOptions>, RadioGroupOptions {}

/**
 * Renders the track with its thumb and provides the machine's api to the items.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element that contains the thumb and the items.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitRadioGroupProps(props);
  const { children, size, ...attributes } = rest;
  const grouping = useGrouping({ ...options, orientation: options.orientation ?? "horizontal" });

  return (
    <ApiProvider value={grouping.api}>
      <Track
        {...mergeProps(grouping.attributes, attributes)}
        {...omitUndefined({ size: size ?? grouping.size })}
      >
        <Thumb aria-hidden {...grouping.api.getIndicatorProps()} />
        {children}
      </Track>
    </ApiProvider>
  );
}
