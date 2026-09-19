/**
 * The one provider an application renders, which composes the rest.
 *
 * Every other provider is its own package, so an application that wants one takes one. This puts
 * them in the order each depends on the one before, which is the knowledge that would otherwise be
 * re-derived at every mount.
 *
 * @packageDocumentation
 */

export { Shell, type ShellProps } from "#shell.tsx";
export {
  THEME_SETTING,
  type ThemeChoiceContextValue,
  themeSetting,
  useThemeChoice,
} from "#theme-choice.ts";
export { Themed, type ThemedProps } from "#themed.tsx";
