/**
 * Draws the control that switches the colour mode the catalogue is drawn in.
 */

import { type ReactElement } from "react";

import { Menu } from "@stealthscale/component-disclosure";
import { Switcher, Toolbar } from "@stealthscale/component-screen";
import { type ColorModeChoice, useColorMode } from "@stealthscale/provider-color-mode";
import { useTranslation } from "@stealthscale/provider-i18n";

import { Chevron } from "#chrome/chevron.tsx";

/**
 * The choices, in the order the list draws them.
 */
const CHOICES: readonly ColorModeChoice[] = ["system", "light", "dark"];

/**
 * Draws the control naming the choice in force, which opens the rest.
 *
 * @remarks
 *   The choice is the shell's, so choosing here redraws the page and is remembered under this
 *   application's name. Following the machine is a choice of its own, listed first. The control is
 *   an item of the bar's row, so draw it inside `Toolbar.Root`.
 */
export function ColorModeSwitcher(): ReactElement {
  const { t } = useTranslation("docs");
  const { choice, setColorMode } = useColorMode();

  return (
    <Switcher.Root
      placement="toolbar"
      positioning={{ placement: "bottom-end" }}
      size="md"
      variant="outline"
    >
      <Toolbar.Item as={Switcher.Trigger} label={t("chrome.colorMode")}>
        <Switcher.Label>
          <Switcher.Name>{t(`chrome.${choice}`)}</Switcher.Name>
        </Switcher.Label>
        <Switcher.Indicator>
          <Chevron />
        </Switcher.Indicator>
      </Toolbar.Item>
      <Menu.Positioner>
        <Switcher.Content>
          {CHOICES.map((one) => (
            <Switcher.Option
              checked={one === choice}
              key={one}
              onCheckedChange={() => {
                setColorMode(one);
              }}
              type="radio"
              value={one}
            >
              <Menu.ItemText>{t(`chrome.${one}`)}</Menu.ItemText>
              <Switcher.Check>✓</Switcher.Check>
            </Switcher.Option>
          ))}
        </Switcher.Content>
      </Menu.Positioner>
    </Switcher.Root>
  );
}
