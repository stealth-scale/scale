/**
 * Resolves the locale a figure is written in.
 */

import { use } from "react";

import { LocaleContext } from "@stealthscale/provider-locale";

/**
 * Returns the locale a figure is written in: the caller's, else the locale in scope, else the
 * runtime's default.
 *
 * @remarks
 *   The locale in scope is the nearest `LocaleProvider`'s, which the shell renders, so switching
 *   the application's locale writes every figure again. Outside a provider the runtime's default
 *   locale is `Intl`'s, which a browser takes from its own language.
 * @param stated - The locale the caller passes, or nothing.
 */
export function useFormatLocale(stated?: string): string {
  const scoped = use(LocaleContext);

  return stated ?? scoped?.locale ?? new Intl.NumberFormat().resolvedOptions().locale;
}
