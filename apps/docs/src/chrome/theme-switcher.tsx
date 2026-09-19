/**
 * Draws the control that switches the theme the catalogue wears.
 */

import { type ReactElement } from "react";

import { Menu } from "@stealthscale/component-disclosure";
import { Switcher } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { useThemeChoice } from "@stealthscale/provider-shell";

import { Chevron } from "#chrome/chevron.tsx";

/**
 * Draws the control naming the theme in force, which opens the rest.
 *
 * @remarks
 *   The choice is the shell's, so choosing here redraws the page and is remembered under this
 *   application's name. The names are the themes' own, which is what a designer judging one
 *   against another asks for.
 */
export function ThemeSwitcher(): ReactElement {
  const { t } = useTranslation("docs");
  const { setTheme, theme, themes } = useThemeChoice();

  return (
    <Switcher.Root positioning={{ placement: "bottom-end" }} size="sm">
      <Switcher.Trigger label={t("chrome.theme")}>
        <Switcher.Label>
          <Switcher.Name>{theme}</Switcher.Name>
        </Switcher.Label>
        <Switcher.Indicator>
          <Chevron />
        </Switcher.Indicator>
      </Switcher.Trigger>
      <Menu.Positioner>
        <Switcher.Content>
          {themes.map((name) => (
            <Switcher.Option
              checked={name === theme}
              key={name}
              onCheckedChange={() => {
                setTheme(name);
              }}
              type="radio"
              value={name}
            >
              <Menu.ItemText>{name}</Menu.ItemText>
              <Switcher.Check>✓</Switcher.Check>
            </Switcher.Option>
          ))}
        </Switcher.Content>
      </Menu.Positioner>
    </Switcher.Root>
  );
}
