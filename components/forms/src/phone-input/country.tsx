/**
 * Renders a phone input's country picker: an addon with the forms select of the countries on offer.
 *
 * @remarks
 *   The element is the input group's addon, plain unless `look` states otherwise, which renders the
 *   divider between the picker and the number. The picker stores a country, never a calling code:
 *   `+1` is the code of 25 countries. A pick rewrites the digits in the country's international
 *   form. The list opens under the whole field at its width, and each row shows the caller's glyph,
 *   the country's name and its calling code. `label` names the picker, and the type requires it,
 *   because a picker without a name is announced as nothing. The picker renders its own label and
 *   hidden `select`, so inside a field it keeps its name and leaves the field's label and control
 *   ID to the number. Neither a field's `invalid` nor its `required` applies to the picker.
 */

import { type ComponentProps, type ReactElement, type ReactNode, useId, useRef } from "react";

import { ListCollection } from "@zag-js/collection";
import { type CountryCode } from "libphonenumber-js";

import { Portal } from "@stealthscale/component-primitives";

import { Addon } from "#input-group/addon.tsx";
import { withContext, withProvider } from "#phone-input/context.ts";
import { type Country as Offered } from "#phone-input/countries.ts";
import { usePhoning, usePicking } from "#phone-input/state.ts";
import { Trigger } from "#phone-input/trigger.tsx";
import * as Select from "#select/index.ts";

/**
 * Renders the input group's addon with the recipe's picker class, and resolves the variants.
 */
const Picker = withProvider(Addon, "picker");

/**
 * Renders the select's label, visually hidden, with the recipe's label class.
 */
const Label = withContext(Select.Label, "label");

/**
 * Renders a row's glyph, hidden from a screen reader, with the recipe's flag class.
 */
const Flag = withContext("span", "flag");

/**
 * Maps each size of the input group to the select size whose rows the list takes.
 */
const ROWS = {
  "2xl": "lg",
  "3xl": "lg",
  "4xl": "lg",
  lg: "lg",
  md: "md",
  sm: "sm",
  xl: "lg",
  xs: "sm",
} as const;

/**
 * Describes the props of the picker: its name, the glyphs, and the addon's look and the props of a
 * `div`.
 */
export interface CountryProps extends Omit<ComponentProps<typeof Picker>, "children" | "size"> {
  /**
   * Glyph at the end of the picked country's row, such as a check.
   */
  readonly check?: ReactNode;

  /**
   * Returns the glyph of a country, such as a flag, which the button and each row show before the
   * country's name.
   */
  readonly flagOf?: ((country: CountryCode) => ReactNode) | undefined;

  /**
   * Glyph after the calling code in the button, such as a chevron.
   */
  readonly indicator?: ReactNode;

  /**
   * Accessible name of the picker, such as "Country".
   */
  readonly label: string;
}

/**
 * Renders a row of the list: the country's glyph, its name, its calling code, and the check while
 * it is picked.
 */
function rowOf(country: Offered, glyphs: Pick<CountryProps, "check" | "flagOf">): ReactElement {
  const { check, flagOf } = glyphs;

  return (
    <Select.Item item={country} key={country.code}>
      {flagOf === undefined ? null : <Flag aria-hidden>{flagOf(country.code)}</Flag>}
      <Select.ItemText item={country}>{country.name}</Select.ItemText>
      <Select.ItemDescription>{country.dial}</Select.ItemDescription>
      {check === undefined ? null : (
        <Select.ItemIndicator item={country}>{check}</Select.ItemIndicator>
      )}
    </Select.Item>
  );
}

/**
 * Renders the picker and reports it to the root.
 *
 * @param props - The picker's name, the glyphs, the addon's look and the props of a `div`.
 * @returns The addon that contains the picker.
 */
export function Country({
  check,
  flagOf,
  indicator,
  label,
  look = "plain",
  ...props
}: CountryProps): ReactElement {
  const phoning = usePhoning();
  const size = phoning.size ?? "md";
  const hidden = useId();
  const root = useRef<HTMLDivElement>(null);
  const chosen = phoning.countries.find((each) => each.code === phoning.country);
  const collection = new ListCollection({
    items: phoning.countries,
    itemToString: (country: Offered): string => country.name,
    itemToValue: (country: Offered): string => country.code,
  });

  usePicking();

  return (
    <Picker look={look} size={size} {...props}>
      <Select.Root
        collection={collection}
        disabled={phoning.disabled}
        ids={{ hiddenSelect: hidden }}
        invalid={false}
        onValueChange={({ items }) => {
          // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the collection's items are the countries on offer
          for (const country of items as Offered[]) phoning.pick(country.code);
        }}
        positioning={{
          getAnchorElement: () => {
            // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the select's root is mounted in the addon inside the input group's box whenever the list is placed
            const addon = (root.current as HTMLDivElement).parentElement as HTMLElement;

            return addon.parentElement;
          },
          placement: "bottom-start",
        }}
        readOnly={phoning.readOnly}
        ref={root}
        required={false}
        size={ROWS[size]}
        value={chosen === undefined ? [] : [chosen.code]}
      >
        <Label>{label}</Label>
        <Trigger
          chosen={chosen}
          flag={chosen === undefined ? undefined : flagOf?.(chosen.code)}
          indicator={indicator}
        />
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {phoning.countries.map((country) => rowOf(country, { check, flagOf }))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Picker>
  );
}
