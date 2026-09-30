/**
 * Closes a tab: the rule that picks the tab a closed tab hands its selection to, and the close
 * the root runs for its parts.
 *
 * @remarks
 *   The caller keeps the list of tabs, so a close removes nothing itself. It moves the selection
 *   and the focus off the closing tab while that tab is still in the document, then asks the
 *   caller to remove it.
 */

import { type TabsApi } from "#tabs/machine.ts";

/**
 * Describes a close: the value of the tab to remove.
 */
export interface CloseDetails {
  /**
   * Value of the closed tab.
   */
  readonly value: string;
}

/**
 * Returns the value a selection moves to when a tab closes: the tab after the closed one, else
 * the tab before it, else none.
 *
 * @remarks
 *   A closed tab that is not selected leaves the selection where it is. A caller that closes tabs
 *   from outside the list, such as from a menu, passes its own values and sets the result.
 * @param values - The values of the tabs a selection may move to, in the list's order, with the
 *   closed tab among them.
 * @param selected - The selected value, or null.
 * @param closed - The value of the tab that closes.
 * @returns The value to select, or null for no selection.
 */
export function selectionAfterClose(
  values: readonly string[],
  selected: null | string,
  closed: string,
): null | string {
  if (selected !== closed) return selected;

  const at = values.indexOf(closed);

  return values[at + 1] ?? values[at - 1] ?? null;
}

/**
 * Returns the value a tab shows, which the machine writes on every tab as `data-value`.
 */
function valueOf(tab: HTMLElement): string {
  return String(tab.dataset["value"]);
}

/**
 * Closes a tab: moves focus to the tab that inherits it when the closing tab has focus, selects
 * that tab when the closing tab is selected, then calls `onClose` with the closed value.
 *
 * @remarks
 *   A disabled tab does not close. The heir is the next enabled tab of the same list, else the
 *   previous one. `onClose` runs in a microtask queued after the machine's selection, so a caller
 *   hears `onValueChange` first and then removes the tab.
 * @param tab - The tab's element.
 * @param api - The machine's api.
 * @param onClose - The root's handler, if any.
 */
export function closeTab(
  tab: HTMLElement,
  api: TabsApi,
  onClose: ((details: CloseDetails) => void) | undefined,
): void {
  if (tab.hasAttribute("disabled")) return;

  const owner = String(tab.dataset["ownedby"]);
  const tabs = [
    ...tab.ownerDocument.querySelectorAll<HTMLElement>(`[role=tab][data-ownedby="${owner}"]`),
  ].filter((each) => !each.hasAttribute("disabled"));
  const value = valueOf(tab);
  const heir = selectionAfterClose(
    tabs.map((each) => valueOf(each)),
    value,
    value,
  );

  if (tab.contains(tab.ownerDocument.activeElement)) {
    tabs.find((each) => valueOf(each) === heir)?.focus();
  }

  if (api.value === value) {
    if (heir === null) api.clearValue();
    else api.setValue(heir);
  }

  queueMicrotask(() => {
    onClose?.({ value });
  });
}
