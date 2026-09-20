/**
 * Draws the control that switches the theme the catalogue wears.
 */

import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { Menu } from "@stealthscale/component-disclosure";
import { Switcher, Toolbar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { useThemeChoice } from "@stealthscale/provider-shell";
import { css } from "@stealthscale/theme";

import { Chevron } from "#chrome/chevron.tsx";

/**
 * Draws a theme's swatch: a dot in that theme's own primary, whatever theme the page wears.
 *
 * @remarks
 *   The dot carries `data-theme` itself, so the compiler's tokens for that theme apply to it and
 *   `primary.solid` resolves to the theme the dot stands for. The mode follows the page, because a
 *   theme's dark tokens apply under the page's mode attribute as well.
 */
const swatch = css({
  background: "primary.solid",
  borderRadius: "full",
  boxSize: "50%",
  margin: "auto",
});

/**
 * Draws the control naming the theme in force, which opens the rest.
 *
 * @remarks
 *   The choice is the shell's, so choosing here redraws the page and is remembered under this
 *   application's name. The names are the themes' own, which is what a designer judging one
 *   against another asks for, and each carries a swatch of its primary. The control is an item of
 *   the bar's row, so draw it inside `Toolbar.Root`.
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
          <span className={swatch} data-theme={theme} />
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
                <span className={swatch} data-theme={name} />
              </Menu.ItemMark>
              <Menu.ItemText>{name}</Menu.ItemText>
            </Menu.OptionItem>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Switcher.Root>
  );
}
