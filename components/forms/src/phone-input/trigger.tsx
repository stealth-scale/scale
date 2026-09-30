/**
 * Renders the phone input's country button: the select's trigger with the country's glyph, its name
 * for a screen reader, its calling code and the caller's indicator.
 *
 * @remarks
 *   The element is a `button` with `role="combobox"`, named by the picker's label and valued by its
 *   text: the country's name, which a screen reader alone reads, then its calling code. The glyph
 *   and the indicator are hidden from a screen reader, because a flag is not a country's name. With
 *   no country picked the button shows `+`, because a number then starts with its calling code.
 *   The arrow keys, Enter and Space open the list, and typed letters move to a country by its name.
 */

import { type ReactElement, type ReactNode } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#phone-input/context.ts";
import { type Country } from "#phone-input/countries.ts";
import { useSelect } from "#select/machine.ts";
import { useShared } from "#select/state.ts";

/**
 * Renders the `button` with the recipe's trigger class.
 */
const Pressed = withContext("button", "trigger");

/**
 * Renders the country's glyph with the recipe's flag class.
 */
const Flag = withContext("span", "flag");

/**
 * Renders the country's name, which a screen reader alone reads, with the recipe's name class.
 */
const Name = withContext("span", "name");

/**
 * Renders the calling code with the recipe's dial class.
 */
const Dial = withContext("span", "dial");

/**
 * Renders the caller's indicator with the recipe's indicator class.
 */
const Indicator = withContext("span", "indicator");

/**
 * Describes the props of the button: the picked country, its glyph and the indicator.
 */
export interface TriggerProps {
  /**
   * Picked country, or nothing while none is picked.
   */
  readonly chosen: Country | undefined;

  /**
   * Glyph of the picked country, such as a flag.
   */
  readonly flag?: ReactNode;

  /**
   * Glyph after the calling code, such as a chevron.
   */
  readonly indicator?: ReactNode;
}

/**
 * Renders the button with the select's trigger props, named and described as the select shares.
 */
export function Trigger({ chosen, flag, indicator }: TriggerProps): ReactElement {
  const api = useSelect();
  const { describedBy, label } = useShared();
  const { "aria-labelledby": _labelledBy, ...machine } = api.getTriggerProps();
  const named = omitUndefined({ "aria-describedby": describedBy, "aria-labelledby": label });

  return (
    <Pressed {...mergeProps(machine, named)}>
      {flag === undefined ? null : <Flag aria-hidden>{flag}</Flag>}
      {chosen === undefined ? null : <Name>{chosen.name}</Name>}
      <Dial>{chosen?.dial ?? "+"}</Dial>
      {indicator === undefined ? null : <Indicator aria-hidden>{indicator}</Indicator>}
    </Pressed>
  );
}
