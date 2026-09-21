/**
 * Shows the menu: every look, every highlight at every size, where it opens, a list too long for
 * the screen, a menu opened over a region and everything one holds, where a submenu opens, and a
 * page that runs right to left.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without this
 *   file changing. Every menu holds the same rows: a group with keystrokes, a row that undoes
 *   something, a row that stays on, a set to pick one of, and a submenu, so a look is judged on
 *   everything a menu draws. Each positioner sits in a portal, because the card a scene is drawn in
 *   clips what it holds and a menu that has to fit the card is no menu. The words are keys under
 *   `menu` in the catalogue's namespace, kept beside this file in `locales/en/specimen/menu.json`.
 */

import { type ReactElement, type ReactNode, useState } from "react";

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CopyIcon,
  FileJsonIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FolderInputIcon,
  PinIcon,
  ScissorsIcon,
  TrashIcon,
} from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Portal } from "@stealthscale/component-primitives";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";
import { type Scale } from "@stealthscale/theme/authoring";

import * as Menu from "#menu/index.ts";
import { recipe } from "#menu/recipe.ts";

/**
 * The six placements a menu is asked to open at.
 */
const PLACEMENTS = ["bottom-start", "bottom", "bottom-end", "top-start", "top", "top-end"] as const;

/**
 * The four sides a submenu is asked to open on.
 */
const SIDES = ["right-start", "left-start", "top-start", "bottom-start"] as const;

/**
 * The three formats a region's menu offers to download as, each with its mark.
 */
const FORMATS = [
  ["csv", FileSpreadsheetIcon],
  ["json", FileJsonIcon],
  ["pdf", FileTextIcon],
] as const;

/**
 * How many ledgers the long list holds.
 */
const LEDGERS = 24;

/**
 * Draws the tick a chosen row carries.
 */
function Tick(): ReactElement {
  return (
    <Menu.ItemIndicator>
      <CheckIcon aria-hidden size="1em" />
    </Menu.ItemIndicator>
  );
}

/**
 * Describes what a control that opens a menu is told.
 */
interface OpenerProps {
  /**
   * The words on the control, `Actions` unless the scene says otherwise.
   */
  readonly children?: ReactNode;

  /**
   * The step the control is drawn at, which is the menu's own.
   */
  readonly size?: Scale;
}

/**
 * Draws the control that opens a menu: the library's button, with a chevron that turns as the
 * menu opens.
 *
 * @remarks
 *   The button's look and step go in through its own provider, because `as` hands the trigger's
 *   props to the button and knows nothing of the button's own.
 */
function Opener({ children, size = "md" }: OpenerProps): ReactElement {
  const { t } = useWords("menu");

  return (
    <ButtonPropsProvider value={{ size, variant: "subtle" }}>
      <Menu.Trigger as={Button}>
        {children ?? t("actions")}
        <Menu.Indicator>
          <ChevronDownIcon aria-hidden size="1em" />
        </Menu.Indicator>
      </Menu.Trigger>
    </ButtonPropsProvider>
  );
}

/**
 * Draws the rows every menu holds, and remembers what was turned on and picked.
 */
function Rows(): ReactElement {
  const { t } = useWords("menu");
  const [notified, setNotified] = useState(true);
  const [window, setWindow] = useState("week");

  return (
    <Portal>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.ItemGroup value="payout">
            <Menu.ItemGroupLabel value="payout">{t("payout")}</Menu.ItemGroupLabel>
            <Menu.Item value="release">
              {t("release")}
              <Menu.ItemCommand>⌘R</Menu.ItemCommand>
            </Menu.Item>
            <Menu.Item value="hold">
              {t("hold")}
              <Menu.ItemCommand>⌘H</Menu.ItemCommand>
            </Menu.Item>
            <Menu.Item tone="critical" value="void">
              {t("void")}
            </Menu.Item>
          </Menu.ItemGroup>
          <Menu.Separator />
          <Menu.OptionItem
            checked={notified}
            closeOnSelect={false}
            onCheckedChange={setNotified}
            type="checkbox"
            value="notify"
          >
            <Tick />
            <Menu.ItemText>{t("notify")}</Menu.ItemText>
          </Menu.OptionItem>
          <Menu.Separator />
          <Menu.ItemGroup value="window">
            <Menu.ItemGroupLabel value="window">{t("window")}</Menu.ItemGroupLabel>
            {(["week", "month"] as const).map((key) => (
              <Menu.OptionItem
                checked={window === key}
                key={key}
                onCheckedChange={() => {
                  setWindow(key);
                }}
                type="radio"
                value={key}
              >
                <Tick />
                <Menu.ItemText>{key === "week" ? t("thisWeek") : t("thisMonth")}</Menu.ItemText>
              </Menu.OptionItem>
            ))}
          </Menu.ItemGroup>
          <Menu.Separator />
          <Menu.Root>
            <Menu.TriggerItem>
              {t("export")}
              <Menu.Indicator>
                <ChevronRightIcon aria-hidden size="1em" />
              </Menu.Indicator>
            </Menu.TriggerItem>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {FORMATS.map(([key]) => (
                    <Menu.Item key={key} value={key}>
                      {t(key)}
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Menu.Content>
      </Menu.Positioner>
    </Portal>
  );
}

/**
 * Draws the menu in every look.
 */
function Looks(): ReactElement {
  return (
    <Matrix knob="variant" of={valuesOf(recipe, "variant")}>
      {(variant) => (
        <Menu.Root variant={variant}>
          <Opener />
          <Rows />
        </Menu.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the menu with every highlight at every size.
 */
function Highlights(): ReactElement {
  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="highlight"
      of={valuesOf(recipe, "highlight")}
    >
      {(highlight, size) => (
        <Menu.Root highlight={highlight} size={size}>
          <Opener size={size} />
          <Rows />
        </Menu.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a menu asked to open at each placement, named after it.
 */
function Placements(): ReactElement {
  return (
    <Matrix knob="placement" of={PLACEMENTS}>
      {(placement) => (
        <Menu.Root positioning={{ placement }}>
          <Opener>{placement}</Opener>
          <Rows />
        </Menu.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a menu of more rows than fit under its control, which scrolls inside itself.
 */
function Long(): ReactElement {
  const { t } = useWords("menu");

  return (
    <Menu.Root>
      <Opener>{t("pickLedger")}</Opener>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {Array.from({ length: LEDGERS }, (_, index) => index + 1).map((number) => (
              <Menu.Item key={number} value={`ledger-${String(number)}`}>
                {`${t("ledger")} ${String(number).padStart(2, "0")}`}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

/**
 * Describes what a region a menu opens over is told.
 */
interface RegionProps {
  /**
   * The words the region reads.
   */
  readonly children: ReactNode;
}

/**
 * Draws a region a reader opens the menu over with a right click, a long press or Shift+F10.
 */
function Region({ children }: RegionProps): ReactElement {
  return (
    <ButtonPropsProvider value={{ size: "lg", variant: "subtle" }}>
      <Menu.ContextTrigger as={Button}>{children}</Menu.ContextTrigger>
    </ButtonPropsProvider>
  );
}

/**
 * Draws the same rows, opened over a region rather than from a control.
 */
function Over(): ReactElement {
  const { t } = useWords("menu");

  return (
    <Menu.Root>
      <Region>{t("rightClickRow")}</Region>
      <Rows />
    </Menu.Root>
  );
}

/**
 * Draws everything a region's menu holds: groups with marks and keystrokes, a row that stays on,
 * a set to pick one of, a submenu, and a row that destroys something.
 */
function Everything(): ReactElement {
  const { t } = useWords("menu");
  const [pinned, setPinned] = useState(true);
  const [format, setFormat] = useState("csv");

  return (
    <Menu.Root inset>
      <Region>{t("rightClickCard")}</Region>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup value="edit">
              <Menu.ItemGroupLabel value="edit">{t("edit")}</Menu.ItemGroupLabel>
              <Menu.Item value="cut">
                <ScissorsIcon aria-hidden size="1em" />
                {t("cut")}
                <Menu.ItemCommand>⌘X</Menu.ItemCommand>
              </Menu.Item>
              <Menu.Item value="copy">
                <CopyIcon aria-hidden size="1em" />
                {t("copy")}
                <Menu.ItemCommand>⌘C</Menu.ItemCommand>
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.Separator />
            <Menu.OptionItem
              checked={pinned}
              closeOnSelect={false}
              onCheckedChange={setPinned}
              type="checkbox"
              value="pin"
            >
              <Tick />
              <PinIcon aria-hidden size="1em" />
              <Menu.ItemText>{t("keepTop")}</Menu.ItemText>
            </Menu.OptionItem>
            <Menu.Separator />
            <Menu.ItemGroup value="download">
              <Menu.ItemGroupLabel value="download">{t("downloadAs")}</Menu.ItemGroupLabel>
              {FORMATS.map(([key, Mark]) => (
                <Menu.OptionItem
                  checked={format === key}
                  key={key}
                  onCheckedChange={() => {
                    setFormat(key);
                  }}
                  type="radio"
                  value={key}
                >
                  <Tick />
                  <Mark aria-hidden size="1em" />
                  <Menu.ItemText>{t(key)}</Menu.ItemText>
                </Menu.OptionItem>
              ))}
            </Menu.ItemGroup>
            <Menu.Separator />
            <Menu.Root>
              <Menu.TriggerItem>
                <FolderInputIcon aria-hidden size="1em" />
                {t("moveTo")}
                <Menu.Indicator>
                  <ChevronRightIcon aria-hidden size="1em" />
                </Menu.Indicator>
              </Menu.TriggerItem>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="archive">{t("archive")}</Menu.Item>
                    <Menu.Item value="drafts">{t("drafts")}</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
            <Menu.Separator />
            <Menu.Item tone="critical" value="delete">
              <TrashIcon aria-hidden size="1em" />
              {t("delete")}
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

/**
 * Draws a menu whose submenus each open on the side their root asks for.
 */
function Submenus(): ReactElement {
  const { t } = useWords("menu");

  return (
    <Menu.Root>
      <Region>{t("rightClickRow")}</Region>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {SIDES.map((side) => (
              <Menu.Root key={side} positioning={{ placement: side }}>
                <Menu.TriggerItem>
                  {t("opens", { side })}
                  <Menu.Indicator>
                    <ChevronRightIcon aria-hidden size="1em" />
                  </Menu.Indicator>
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item value={`${side}-one`}>{t("one")}</Menu.Item>
                      <Menu.Item value={`${side}-two`}>{t("two")}</Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

/**
 * Draws the menu on a page that runs the other way.
 */
function RightToLeft(): ReactElement {
  const { t } = useWords("menu");

  return (
    <div dir="rtl">
      <Menu.Root dir="rtl">
        <Region>{t("rightClickRtl")}</Region>
        <Rows />
      </Menu.Root>
    </div>
  );
}

/**
 * Every look.
 */
export const looks: Scene = { about: "menu.looks.about", draw: Looks, title: "menu.looks.title" };

/**
 * Every highlight at every size.
 */
export const highlights: Scene = {
  about: "menu.highlights.about",
  draw: Highlights,
  title: "menu.highlights.title",
};

/**
 * Where the menu opens.
 */
export const placements: Scene = {
  about: "menu.placements.about",
  draw: Placements,
  title: "menu.placements.title",
};

/**
 * A list too long for the screen.
 */
export const long: Scene = { about: "menu.long.about", draw: Long, title: "menu.long.title" };

/**
 * Opened over a region.
 */
export const over: Scene = { about: "menu.over.about", draw: Over, title: "menu.over.title" };

/**
 * Everything a region's menu holds.
 */
export const everything: Scene = {
  about: "menu.everything.about",
  draw: Everything,
  title: "menu.everything.title",
};

/**
 * Where a submenu opens.
 */
export const submenus: Scene = {
  about: "menu.submenus.about",
  draw: Submenus,
  title: "menu.submenus.title",
};

/**
 * Right to left.
 */
export const rtl: Scene = { about: "menu.rtl.about", draw: RightToLeft, title: "menu.rtl.title" };

export default specimen({
  about: "menu.about",
  group: "Disclosure",
  id: "disclosure/menu",
  imports: 'import { Menu } from "@stealthscale/component-disclosure";',
  scenes: [looks, highlights, placements, long, over, everything, submenus, rtl],
  title: "menu.title",
});
