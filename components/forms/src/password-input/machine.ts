/**
 * Runs the password input machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the field, the
 *   toggle and its indicator report one visibility. The machine renders the field as `password`
 *   or `text`, and hides the value again when the field's form submits or resets, so a browser does
 *   not store the plain value.
 */

import { useId } from "react";

import * as password from "@zag-js/password-input";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `password.connect` returns: a prop getter per part, and the visibility and
 * its setters.
 */
export type PasswordInputApi = ReturnType<typeof password.connect>;

/**
 * Describes the machine options the root takes, every one optional.
 *
 * @remarks
 *   `translations` is left out, because a component's words are props. The toggle takes its names
 *   as `label` and `visibleLabel`.
 */
export type PasswordInputOptions = Omit<Partial<password.Props>, "translations">;

/**
 * Describes what `onVisibilityChange` receives: whether the value is shown.
 */
export type VisibilityChangeDetails = password.VisibilityChangeDetails;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `usePasswordInput` throws for a part rendered outside `PasswordInput.Root`.
 */
export const [ApiProvider, usePasswordInput] =
  createRequiredContext<PasswordInputApi>("PasswordInput");

/**
 * Starts the password input machine and returns its connected api.
 *
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @param control - ID the field around the input gives its control, which the field's label points
 *   at, or nothing outside a field. An input ID the caller passes in `ids` replaces it.
 * @returns The connected api.
 */
export function usePasswordInputMachine(
  options: PasswordInputOptions,
  control: string | undefined,
): PasswordInputApi {
  const generated = useId();

  return password.connect(
    useMachine(password.machine, {
      ...omitUndefined(options),
      id: options.id ?? generated,
      ids: { ...omitUndefined({ input: control }), ...options.ids },
    }),
    normalizeProps,
  );
}

/**
 * Splits the root's props into the machine's options and the element's props, without
 * `translations`.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed machine.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine options and the element props.
 */
export function splitPasswordInputProps<Props extends PasswordInputOptions>(
  props: Props,
): [PasswordInputOptions, Omit<Props, keyof password.Props>] {
  const [options, rest] = splitEnumerable(password.splitProps<Props>)(props);
  const { translations: _translations, ...kept } = options;

  return [kept, rest];
}
