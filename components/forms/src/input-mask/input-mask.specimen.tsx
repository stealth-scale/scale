/**
 * Catalogue page for the input mask.
 *
 * @remarks
 *   The input mask has no recipe of its own: the input group's recipe styles the box, the field and
 *   the marks. The looks, sizes and states scenes turn the group's values by hand on the phone
 *   example. The card scene shows a pattern that a function picks by the card's brand, for a Visa
 *   and an American Express number. The ZIP scene shows a pattern array chosen by the length of the
 *   value, the expiry scene an eager pattern with a month check on completion, the voucher scene a
 *   token of the caller's that writes capitals, the amount scene a number in `nl-NL`, and the IBAN
 *   scene a required field in a form. The expiry, voucher and IBAN scenes type their text after
 *   mounting, so the still page shows the eager slash, the capitals and a complete code. Every
 *   drawing is in a room of a phone's width. The page imports the parts' barrel as a type, so the
 *   props reader finds the parts. The words are keys under `input-mask` in
 *   `locales/en/specimen/input-mask.json`.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import { Matrix, Room, type Scene, specimen, valuesOf } from "@stealthscale/specimen";

import { recipe as group } from "#input-group/recipe.ts";
import * as examples from "#input-mask/examples/index.ts";
import type * as InputMask from "#input-mask/index.ts";

/**
 * Looks of the input group the input mask renders in.
 */
const LOOKS = valuesOf(group, "variant");

/**
 * Sizes of the input group the input mask renders in.
 */
const SIZES = valuesOf(group, "size");

/**
 * States of the states scene, in reading order.
 */
const STATES = ["invalid", "readOnly", "disabled"] as const;

/**
 * Maps each state to the root props that put the input in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], InputMask.RootProps>> = {
  disabled: { disabled: true },
  invalid: { invalid: true },
  readOnly: { readOnly: true },
};

/**
 * Card brands of the card scene, in reading order.
 */
const BRANDS = ["visa", "amex"] as const;

/**
 * Maps each brand to a test card number of that brand.
 */
const NUMBERS: Readonly<Record<(typeof BRANDS)[number], string>> = {
  amex: "378282246310005",
  visa: "4242424242424242",
};

/**
 * Describes the props of the typing staging: the example and the text to type into it.
 */
interface TypedProps {
  /**
   * Example whose input receives the text.
   */
  readonly children: ReactNode;

  /**
   * Text typed into the input after it mounts, or nothing to leave it as it renders.
   */
  readonly text: string | undefined;
}

/**
 * Renders an example and types text into its input after it mounts.
 *
 * @remarks
 *   The staging writes the text through the input element's own setter and dispatches an `input`
 *   event, so the input masks it the way it masks a person's typing.
 */
function Typed({ children, text }: TypedProps): ReactElement {
  const [box, setBox] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const input = box?.querySelector("input");

    if (input === undefined || input === null || text === undefined) return;

    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, text);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, [box, text]);

  return <div ref={setBox}>{children}</div>;
}

/**
 * Builds a hand-written scene that renders one example in a room of a phone's width.
 *
 * @param name - Key of the scene under `input-mask`.
 * @param example - Example module, whose source the scene shows.
 * @param Example - Component the example module exports.
 * @param text - Text the staging types into the example's input, or nothing.
 * @returns The scene.
 */
function roomed(name: string, example: object, Example: () => ReactElement, text?: string): Scene {
  return {
    about: `input-mask.${name}.about`,
    draw: () => (
      <Room size="sm">
        <Typed text={text}>
          <Example />
        </Typed>
      </Room>
    ),
    example,
    title: `input-mask.${name}.title`,
  };
}

/**
 * Hand-written scene for the input group's looks.
 */
export const looks: Scene = {
  about: "input-mask.looks.about",
  draw: () => (
    <Matrix knob="variant" of={LOOKS}>
      {(variant) => (
        <Room size="sm">
          <examples.phone.Phone variant={variant} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.phone,
  props: { variant: "flushed" },
  title: "input-mask.looks.title",
};

/**
 * Hand-written scene for the input group's sizes.
 */
export const sizes: Scene = {
  about: "input-mask.sizes.about",
  draw: () => (
    <Matrix knob="size" of={SIZES}>
      {(size) => (
        <Room size="sm">
          <examples.phone.Phone size={size} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.phone,
  props: { size: "xs" },
  title: "input-mask.sizes.title",
};

/**
 * Hand-written scene for an invalid, a read-only and a disabled input.
 */
export const states: Scene = {
  about: "input-mask.states.about",
  draw: () => (
    <Matrix knob="state" of={STATES}>
      {(state) => (
        <Room size="sm">
          <examples.phone.Phone {...STATED[state]} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.phone,
  props: { invalid: true },
  title: "input-mask.states.title",
};

/**
 * Hand-written scene for a pattern a function picks by the card's brand.
 */
export const card: Scene = {
  about: "input-mask.brand.about",
  draw: () => (
    <Matrix knob="brand" of={BRANDS}>
      {(brand) => (
        <Room size="sm">
          <examples.card.Card defaultValue={NUMBERS[brand]} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.card,
  props: { defaultValue: NUMBERS.visa },
  title: "input-mask.brand.title",
};

export default specimen({
  about: "input-mask.about",
  id: "components/forms/input-mask",
  imports: 'import { InputMask } from "@stealthscale/component-forms";',
  scenes: [
    looks,
    sizes,
    states,
    card,
    roomed("lengths", examples.zip, examples.zip.Zip),
    roomed("eager", examples.expiry, examples.expiry.Expiry, "12"),
    roomed("tokens", examples.voucher, examples.voucher.Voucher, "save2026xmas"),
    roomed("number", examples.amount, examples.amount.Amount),
    roomed("form", examples.iban, examples.iban.Iban, "nl91abna0417"),
  ],
  title: "input-mask.title",
});
