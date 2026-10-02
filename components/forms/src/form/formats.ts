/**
 * Lists the formats the binding's controls take and the engine checks: an IBAN and a phone
 * number.
 *
 * @remarks
 *   A schema that names either format hands the form an engine that registers it, such as
 *   `createEngine({ formats: [iban, phone] })`, because the default engine refuses a format it does
 *   not know. An empty string passes either format, as it passes the engine's own formats, so a
 *   schema states `minLength` where a value has to be given.
 */

import { isValidPhoneNumber } from "libphonenumber-js";

import { type Format } from "@stealthscale/provider-form";

/**
 * Matches the shape of an IBAN without its spaces: two letters, two digits, then eleven to thirty
 * letters or digits.
 */
const SHAPE = /^[A-Z]{2}\d{2}[\dA-Z]{11,30}$/u;

/**
 * Returns the remainder of an IBAN's number after division by 97, its check under ISO 7064: the
 * first four characters moved to the end, and each character written as its value in base 36, so
 * a digit is itself and a letter is two digits, `A` as 10.
 */
function remainderOf(compact: string): number {
  let remainder = 0;

  for (const character of `${compact.slice(4)}${compact.slice(0, 4)}`) {
    for (const digit of String(Number.parseInt(character, 36))) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }

  return remainder;
}

/**
 * Accepts an IBAN: written with or without spaces, in either case, of the right shape and with
 * check digits that leave a remainder of 1, written as `format: "iban"`.
 */
export const iban: Format = {
  holds: (value) => {
    const compact = value.replaceAll(" ", "").toUpperCase();

    return value === "" || (SHAPE.test(compact) && remainderOf(compact) === 1);
  },
  name: "iban",
};

/**
 * Accepts a phone number in E.164, such as `+31612345678`, that the phone metadata reads as valid
 * for its country, written as `format: "phone"`.
 */
export const phone: Format = {
  holds: (value) => value === "" || isValidPhoneNumber(value),
  name: "phone",
};
