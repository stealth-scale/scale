/**
 * Draws the field that narrows the rail to the pages whose words a reader types.
 */

import { type ReactElement, useEffect, useRef } from "react";

import { XIcon } from "lucide-react";

import { SearchInput } from "@stealthscale/component-forms";
import { AppShell, Sidebar } from "@stealthscale/component-screen";
import { useHotkey } from "@stealthscale/provider-hotkeys";
import { useTranslation } from "@stealthscale/provider-i18n";

/**
 * The name the shell panel holding the rail is drawn under.
 */
const NAVBAR = "navbar";

/**
 * The keys that put the reader in the field, as the platform's modifier and K.
 */
const SHORTCUT = "Mod+K";

/**
 * Describes what the search takes.
 */
export interface RailSearchProps {
  /**
   * Hears the words each time they change.
   */
  readonly onValueChange: (query: string) => void;

  /**
   * The words the rail is narrowed by.
   */
  readonly value: string;
}

/**
 * Draws the field that narrows the rail, in the room the sidebar keeps for a search.
 *
 * @remarks
 *   Draw it inside `Sidebar.Root` from the screen package, above the rail, and hand the rail the
 *   same words. The field is the forms package's search input, so it empties itself from the
 *   control at its end. The platform's modifier and K put the reader in the field from anywhere on
 *   the page. Where the shell has folded the rail's panel over the page and closed it, the
 *   shortcut opens the panel first and moves focus once the field is on screen. That move waits a
 *   microtask, because the shell takes the reader into the panel in an effect of its own that runs
 *   after this one, and a move made before it would be undone by it.
 */
export function RailSearch({ onValueChange, value }: RailSearchProps): ReactElement {
  const { t } = useTranslation("specimen");
  const box = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const panel = AppShell.useAppShellPanel(NAVBAR);
  const open = panel?.open ?? true;

  useEffect(() => {
    if (!pending.current || !open) return;

    pending.current = false;
    queueMicrotask(() => {
      box.current?.querySelector("input")?.focus();
    });
  }, [open]);

  useHotkey(SHORTCUT, () => {
    if (open) {
      box.current?.querySelector("input")?.focus();

      return;
    }

    pending.current = true;
    panel?.setOpen(true);
  });

  return (
    <Sidebar.Search ref={box}>
      <SearchInput
        aria-keyshortcuts="Control+K Meta+K"
        aria-label={t("rail.filter")}
        clearIndicator={<XIcon aria-hidden size="1em" />}
        clearLabel={t("rail.clear")}
        onValueChange={onValueChange}
        placeholder={t("rail.filter")}
        size="sm"
        value={value}
      />
    </Sidebar.Search>
  );
}
