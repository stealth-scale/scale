import { type ReactElement, useState } from "react";

import { CheckIcon } from "lucide-react";

import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";
import * as Menubar from "#menubar/index.ts";

const SHOWN = ["minimap", "status"] as const;

const PANELS = ["explorer", "search", "timeline"] as const;

export function Options(): ReactElement {
  const { t } = useWords("menubar");
  const [shown, setShown] = useState<readonly string[]>(["status"]);
  const [panel, setPanel] = useState<(typeof PANELS)[number]>("explorer");

  return (
    <Menubar.Root aria-label={t("layout")}>
      <Menubar.Menu value="show">
        <Menubar.Trigger>{t("show")}</Menubar.Trigger>
        <Portal>
          <Menubar.Content>
            {SHOWN.map((name) => (
              <Menu.OptionItem
                checked={shown.includes(name)}
                key={name}
                onCheckedChange={(checked) => {
                  setShown((was) => (checked ? [...was, name] : was.filter((on) => on !== name)));
                }}
                type="checkbox"
                value={name}
              >
                <Menu.ItemText>{t(name)}</Menu.ItemText>
                <Menu.ItemIndicator>
                  <CheckIcon size="1em" />
                </Menu.ItemIndicator>
              </Menu.OptionItem>
            ))}
          </Menubar.Content>
        </Portal>
      </Menubar.Menu>
      <Menubar.Menu value="panel">
        <Menubar.Trigger>{t("panel", { panel: t(panel) })}</Menubar.Trigger>
        <Portal>
          <Menubar.Content>
            {PANELS.map((name) => (
              <Menu.OptionItem
                checked={panel === name}
                key={name}
                onCheckedChange={() => {
                  setPanel(name);
                }}
                type="radio"
                value={name}
              >
                <Menu.ItemText>{t(name)}</Menu.ItemText>
                <Menu.ItemIndicator>
                  <CheckIcon size="1em" />
                </Menu.ItemIndicator>
              </Menu.OptionItem>
            ))}
          </Menubar.Content>
        </Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}
