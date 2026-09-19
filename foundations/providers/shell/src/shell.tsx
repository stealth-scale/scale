/**
 * Composes every provider an application renders, in the order each depends on the one before.
 */

import { type ReactElement, type ReactNode } from "react";

import { ColorModeProvider } from "@stealthscale/provider-color-mode";
import {
  EnvironmentProvider,
  type GetRootNode,
  type RootNode,
} from "@stealthscale/provider-environment";
import { HotkeysProvider, type HotkeysProviderOptions } from "@stealthscale/provider-hotkeys";
import { type Catalogues, type I18nSettings } from "@stealthscale/provider-i18n";
import { I18nProvider, LocaleProvider } from "@stealthscale/provider-locale";
import { type Size, ViewportProvider } from "@stealthscale/provider-viewport";
import { type SettingStore } from "@stealthscale/settings";

import { Themed } from "#themed.tsx";

/**
 * The locales an application that states none is read in.
 */
const ENGLISH: readonly [string, ...string[]] = ["en-US"];

/**
 * Describes what {@link Shell} is given.
 */
export interface ShellProps {
  /**
   * The application's name. Every setting a person makes is remembered under it, so two
   * applications on one origin keep their own.
   */
  readonly app: string;

  /**
   * The catalogues, which is what `virtual:i18n` exports. Catalogues holding nothing where this is
   * absent, so every key resolves to itself.
   */
  readonly catalogues?: Catalogues | undefined;

  /**
   * The application: its routes, its data, and whatever else it renders with all of this in scope.
   */
  readonly children?: ReactNode | undefined;

  /**
   * The defaults every shortcut in the application starts from. The library's own hold where this
   * is absent, and they are this design system's too.
   */
  readonly hotkeys?: HotkeysProviderOptions | undefined;

  /**
   * The i18next options the application decides beyond the catalogues and the locale.
   */
  readonly i18n?: I18nSettings | undefined;

  /**
   * The locales the application offers, the first being its fallback. American English alone where
   * this is absent.
   */
  readonly locales?: readonly [string, ...string[]] | undefined;

  /**
   * The node the tree is rooted in, for an application rendered inside an iframe or a shadow root.
   * The page's own document where this is absent.
   */
  readonly rootNode?: GetRootNode | RootNode | undefined;

  /**
   * The widths the page is read at. The theme's own breakpoints where this is absent.
   */
  readonly sizes?: readonly Size[] | undefined;

  /**
   * Where to keep every setting a person makes. The page's local storage where this is absent.
   */
  readonly store?: SettingStore | undefined;

  /**
   * The themes the application offers, the first drawn until a person chooses another. None where
   * this is absent, which draws the application's first theme and offers no switch.
   */
  readonly themes?: readonly string[] | undefined;
}

/**
 * Puts everything a component expects from above it in scope.
 *
 * @remarks
 *   The order is the point, and it is what an application would otherwise re-derive at every mount.
 *   The root node comes first, because a portal attaches and a measurement is taken against it. The
 *   colour mode and the theme come next, so whatever renders below is drawn in them, and both are
 *   settings a person's choice is remembered under. The locale follows the theme and the catalogues
 *   follow the locale, because every string is read in it. The viewport reads the theme's
 *   breakpoints, so it comes after the theme. Shortcuts come last. Routes and data stay the
 *   application's own. It renders its router and its clients as children, so an application
 *   without either bundles neither.
 * @param props - The props. `ShellProps` documents every member.
 */
export function Shell({
  app,
  catalogues,
  children,
  hotkeys,
  i18n,
  locales = ENGLISH,
  rootNode,
  sizes,
  store,
  themes,
}: ShellProps): ReactElement {
  return (
    <EnvironmentProvider value={rootNode}>
      <ColorModeProvider app={app} store={store}>
        <Themed app={app} store={store} themes={themes}>
          <LocaleProvider app={app} locales={locales} store={store}>
            <I18nProvider catalogues={catalogues} settings={i18n}>
              <ViewportProvider sizes={sizes}>
                <HotkeysProvider {...(hotkeys === undefined ? {} : { defaultOptions: hotkeys })}>
                  {children}
                </HotkeysProvider>
              </ViewportProvider>
            </I18nProvider>
          </LocaleProvider>
        </Themed>
      </ColorModeProvider>
    </EnvironmentProvider>
  );
}
