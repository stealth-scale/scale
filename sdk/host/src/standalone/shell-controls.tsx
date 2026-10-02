/**
 * Renders the development panel's display controls: the language, the theme and the color mode the
 * shell keeps.
 */

import { type ReactElement } from "react";

import { SegmentGroup } from "@stealthscale/component-forms";
import { type ColorModeChoice, useColorMode } from "@stealthscale/provider-color-mode";
import { useTranslation } from "@stealthscale/provider-i18n";
import { useLocale } from "@stealthscale/provider-locale";
import { useThemeChoice } from "@stealthscale/provider-shell";

import { useStandalone } from "#standalone/context.ts";
import { Group } from "#standalone/group.tsx";
import { Picker } from "#standalone/picker.tsx";

/**
 * Lists the color mode choices in the order the panel offers them, each with the key of its words.
 */
const MODES = [
  { key: "standalone.panel.shell.light", value: "light" },
  { key: "standalone.panel.shell.dark", value: "dark" },
  { key: "standalone.panel.shell.system", value: "system" },
] as const;

/**
 * Renders a picker of the page's locales and one of its themes, each where the page offers more
 * than one, and a segment group of the color modes.
 *
 * @remarks
 *   Each control calls the shell's own setter, so the choice is remembered as a product's would be.
 *   A locale and a theme are named by their codes, as the page's configuration states them.
 * @returns The group.
 */
export function ShellControls(): ReactElement {
  const { glyphs } = useStandalone();
  const { t } = useTranslation("host");
  const { locale, locales, setLocale } = useLocale();
  const { setTheme, theme, themes } = useThemeChoice();
  const { choice, setColorMode } = useColorMode();

  return (
    <Group title={t("standalone.panel.shell.title")}>
      {locales.length > 1 ? (
        <Picker
          choices={locales.map((one) => ({ label: one, value: one }))}
          indicator={glyphs.select?.indicator}
          label={t("standalone.panel.shell.language")}
          onValueChange={setLocale}
          value={locale}
        />
      ) : null}
      {themes.length > 1 ? (
        <Picker
          choices={themes.map((one) => ({ label: one, value: one }))}
          indicator={glyphs.select?.indicator}
          label={t("standalone.panel.shell.theme")}
          onValueChange={setTheme}
          // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the shell's theme is undefined only where it offers no theme, and this picker renders for two or more
          value={theme as string}
        />
      ) : null}
      <SegmentGroup.Root
        aria-label={t("standalone.panel.shell.colorMode")}
        onValueChange={({ value }) => {
          // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the group offers the three choices alone, so a pick is one of them
          setColorMode(value as ColorModeChoice);
        }}
        size="sm"
        value={choice}
      >
        {MODES.map(({ key, value }) => (
          <SegmentGroup.Item key={value} value={value}>
            <SegmentGroup.ItemText>{t(key)}</SegmentGroup.ItemText>
          </SegmentGroup.Item>
        ))}
      </SegmentGroup.Root>
    </Group>
  );
}
