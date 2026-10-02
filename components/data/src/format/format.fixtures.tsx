/**
 * Fixtures for the format specs: a locale in scope, as the shell's locale provider puts one.
 */

import { type ReactElement, type ReactNode } from "react";

import { LocaleContext } from "@stealthscale/provider-locale";

/**
 * Renders the children with the locale in scope, as a `LocaleProvider` would.
 *
 * @param locale - The locale in scope.
 * @param children - What reads it.
 * @returns The context provider around the children.
 */
export function scoped(locale: string, children: ReactNode): ReactElement {
  return (
    <LocaleContext
      value={{
        direction: "ltr",
        isPending: false,
        locale,
        locales: [locale],
        setLocale: () => {},
      }}
    >
      {children}
    </LocaleContext>
  );
}
