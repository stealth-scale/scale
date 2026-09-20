/**
 * Draws the control that switches the language the catalogue is read in.
 */

import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { Menu } from "@stealthscale/component-disclosure";
import { Switcher, Toolbar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { useLocale } from "@stealthscale/provider-locale";

import { Chevron } from "#chrome/chevron.tsx";
import { endonymOf, markOf } from "#chrome/endonym.ts";

/**
 * Draws the control naming the language in force, which opens the rest, each named in itself.
 *
 * @remarks
 *   The locale is the shell's, so choosing here reads every word again and turns the page round
 *   for a language that runs right to left. Nothing at all where the application offers one
 *   language, there being nothing to pick. The control is an item of the bar's row, so draw it
 *   inside `Toolbar.Root`.
 */
export function LocaleSwitcher(): null | ReactElement {
  const { t } = useTranslation("docs");
  const { locale, locales, setLocale } = useLocale();

  if (locales.length < 2) return null;

  return (
    <Switcher.Root
      placement="toolbar"
      positioning={{ placement: "bottom-end" }}
      size="sm"
      variant="outline"
    >
      <Toolbar.Item as={Switcher.Trigger} label={t("chrome.language")}>
        <Switcher.Mark>{markOf(locale)}</Switcher.Mark>
        <Switcher.Label>
          <Switcher.Name>{endonymOf(locale)}</Switcher.Name>
        </Switcher.Label>
        <Switcher.Indicator>
          <Chevron />
        </Switcher.Indicator>
      </Toolbar.Item>
      <Menu.Positioner>
        <Menu.Content>
          {locales.map((tag) => (
            <Menu.OptionItem
              checked={tag === locale}
              key={tag}
              onCheckedChange={() => {
                setLocale(tag);
              }}
              type="radio"
              value={tag}
            >
              <Menu.ItemIndicator>
                <CheckIcon aria-hidden size="1em" />
              </Menu.ItemIndicator>
              <Menu.ItemMark>{markOf(tag)}</Menu.ItemMark>
              <Menu.ItemText>{endonymOf(tag)}</Menu.ItemText>
            </Menu.OptionItem>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Switcher.Root>
  );
}
