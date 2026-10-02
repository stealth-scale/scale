/**
 * Resolves every word a form shows: the label, the help text, the choices, the legends, the
 * actions and the errors, each through the translator in scope under the form's identifier.
 */

import { useFormInScope } from "#contexts.ts";
import { useFormEnvironment } from "#environment.ts";
import { identifiers } from "#identifiers.ts";
import { UNNAMED } from "#presentation-of.ts";
import { type Described, useDescribed } from "#registry.ts";
import { type Translate, worded } from "#translate.ts";

/**
 * Takes the form's place where none is in scope, so the description is read the same way on every
 * render and is absent.
 */
const NOWHERE: Described = { baseStore: {} };

/**
 * Describes an error with a keyword: the engine's issue, or an object a validator of the caller's
 * own returned.
 */
interface Keyworded {
  /**
   * The keyword that refused, which the error's identifier is derived from.
   */
  readonly keyword: string;

  /**
   * The development text, where the error has any.
   */
  readonly message?: string | undefined;

  /**
   * The values the message reads.
   */
  readonly values?: Readonly<Record<string, unknown>> | undefined;
}

/**
 * Reports whether an error has a keyword.
 */
function isKeyworded(error: unknown): error is Keyworded {
  return (
    typeof error === "object" &&
    error !== null &&
    "keyword" in error &&
    typeof error.keyword === "string"
  );
}

/**
 * Describes the words one form shows, each resolved through the translator.
 */
export interface Words {
  /**
   * Resolves the words on an action the form offers, with the English given as the default and the
   * values the words read, such as the number of the item a remove button removes.
   */
  readonly action: (
    name: string,
    fallback: string,
    values?: Readonly<Record<string, unknown>>,
  ) => string;

  /**
   * Resolves a field's help text, with the fallback given or an empty string as the default. An
   * identifier the presentation states for it is tried before the derived one.
   */
  readonly description: (path: string, fallback?: string, identifier?: string) => string;

  /**
   * Resolves an error: a keyworded one under the form's own identifier and then the shared one,
   * with the development text as the default, and a string as its own identifier and default.
   */
  readonly error: (path: string, error: unknown) => string;

  /**
   * Resolves a field's label, with the fallback given or the path written out as the default. An
   * identifier the presentation states for it is tried before the derived one.
   */
  readonly label: (path: string, fallback?: string, identifier?: string) => string;

  /**
   * Resolves a group's legend, with the name written out as the default.
   */
  readonly legend: (name: string) => string;

  /**
   * Resolves a mark beside a field's label, such as the one an optional field shows: under the
   * form's own identifier, then the shared one, with the English given as the default.
   */
  readonly mark: (name: string, fallback: string) => string;

  /**
   * Resolves one choice of an enum, with the value as the default.
   */
  readonly option: (path: string, value: string) => string;

  /**
   * Resolves the words under one choice of an enum, or an empty string where the catalogue has
   * none.
   */
  readonly optionDescription: (path: string, value: string) => string;

  /**
   * Resolves a field's placeholder, or an empty string where the catalogue has none. An
   * identifier the presentation states for it is tried before the derived one.
   */
  readonly placeholder: (path: string, identifier?: string) => string;

  /**
   * Resolves a step's label, with the name written out as the default.
   */
  readonly step: (name: string) => string;
}

/**
 * Lists the keys to try for one word: the identifier the presentation states, where it states
 * one, and then the derived one.
 */
function keys(derived: string, identifier?: string): string | string[] {
  return identifier === undefined ? derived : [identifier, derived];
}

/**
 * Builds the words one form shows, over a translator and the form's identifier.
 */
export function wordsOf(translate: Translate, id: string): Words {
  const ids = identifiers(id);

  return {
    action: (name, fallback, values) =>
      translate(ids.action(name), { ...values, defaultValue: fallback }),
    description: (path, fallback = "", identifier) =>
      translate(keys(ids.description(path), identifier), { defaultValue: fallback }),
    error: (path, error) => {
      if (isKeyworded(error)) {
        const { keyword, message, values } = error;

        return translate([...ids.error(path, keyword)], {
          ...values,
          defaultValue: message ?? keyword,
        });
      }

      const text = String(error);

      return translate(text, { defaultValue: text });
    },
    label: (path, fallback = worded(path), identifier) =>
      translate(keys(ids.label(path), identifier), { defaultValue: fallback }),
    legend: (name) => translate(ids.legend(name), { defaultValue: worded(name) }),
    mark: (name, fallback) => translate([...ids.mark(name)], { defaultValue: fallback }),
    option: (path, value) => translate(ids.option(path, value), { defaultValue: value }),
    optionDescription: (path, value) =>
      translate(ids.optionDescription(path, value), { defaultValue: "" }),
    placeholder: (path, identifier) =>
      translate(keys(ids.placeholder(path), identifier), { defaultValue: "" }),
    step: (name) => translate(ids.step(name), { defaultValue: worded(name) }),
  };
}

/**
 * Reads the words of the form being rendered.
 *
 * @remarks
 *   A form built from a schema reads its own identifier and translator. Any other form, and a
 *   component outside every form, reads the translator in scope under the identifier `form`.
 */
export function useWords(): Words {
  const form = useFormInScope();
  const { translate } = useFormEnvironment();
  const description = useDescribed(form ?? NOWHERE);

  return wordsOf(description?.translate ?? translate, description?.id ?? UNNAMED);
}
