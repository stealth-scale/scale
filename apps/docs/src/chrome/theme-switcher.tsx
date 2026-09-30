/**
 * Renders the control that switches the catalogue's theme.
 */

import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { ColorSwatch } from "@stealthscale/component-data";
import { Menu } from "@stealthscale/component-disclosure";
import { Switcher, Toolbar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { useThemeChoice } from "@stealthscale/provider-shell";
import { token } from "@stealthscale/theme";

import { Chevron } from "#chrome/chevron.tsx";

/**
 * Colour of a theme's swatch: the primary solid of the theme the swatch's `data-theme` names.
 */
const PRIMARY = token.var("colors.primary.solid");

/**
 * Renders the switcher that names the current theme and opens a menu of every theme.
 *
 * @remarks
 *   The shell provides the choice, so a choice here restyles the page and is stored under this
 *   application's name. Each theme is listed by its own name with a swatch of its primary colour.
 *   A swatch sets `data-theme`, so its colour is the primary of the theme it names, in the page's
 *   mode. Render the control inside `Toolbar.Root`.
 */
export function ThemeSwitcher(): ReactElement {
  const { t } = useTranslation("docs");
  const { setTheme, theme, themes } = useThemeChoice();

  return (
    <Switcher.Root
      placement="toolbar"
      positioning={{ placement: "bottom-end" }}
      size="sm"
      variant="outline"
    >
      <Toolbar.Item as={Switcher.Trigger} label={t("chrome.theme")}>
        <Switcher.Mark>
          <ColorSwatch data-theme={theme} shape="circle" size="inherit" value={PRIMARY} />
        </Switcher.Mark>
        <Switcher.Label>
          <Switcher.Name>{theme}</Switcher.Name>
        </Switcher.Label>
        <Switcher.Indicator>
          <Chevron />
        </Switcher.Indicator>
      </Toolbar.Item>
      <Menu.Positioner>
        <Menu.Content>
          {themes.map((name) => (
            <Menu.OptionItem
              checked={name === theme}
              key={name}
              onCheckedChange={() => {
                setTheme(name);
              }}
              type="radio"
              value={name}
            >
              <Menu.ItemIndicator>
                <CheckIcon aria-hidden size="1em" />
              </Menu.ItemIndicator>
              <Menu.ItemMark>
                <ColorSwatch data-theme={name} shape="circle" size="inherit" value={PRIMARY} />
              </Menu.ItemMark>
              <Menu.ItemText>{name}</Menu.ItemText>
            </Menu.OptionItem>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Switcher.Root>
  );
}
