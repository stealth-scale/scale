/**
 * Renders a page's tabs: a strip of tabs on a wide page and a picker on a narrow one, over one
 * value.
 *
 * @remarks
 *   The tabs are the page's navigation. On a wide page the list renders the disclosure package's
 *   tabs on the navigation band's hairline, at the page's size, and the page's body is the panel of
 *   the selected tab, so a screen reader announces the tab the body belongs to. On a narrow page
 *   the list renders a picker in their place, which controls no panel. The value is the caller's
 *   when it passes `value`, the list's own otherwise, and the first tab's until one is selected.
 */

import { type ReactElement, type ReactNode, useId, useMemo } from "react";

import { Tabs } from "@stealthscale/component-disclosure";
import { useControllableState } from "@stealthscale/hooks";

import { type PageSize, usePage } from "#page/state.ts";
import { TabPicker } from "#page/tab-picker.tsx";
import { tabIdOf, TabListProvider, useListed, usePanelled } from "#page/tabs-state.ts";
import { Tabs as Strip } from "#page/tabs.ts";

/**
 * Size of the tabs per page size: one size smaller than the page up to `md`, so a medium page's
 * tabs read the small label, and the page's navigation band makes them 48px tall.
 */
const TAB_SIZES: Readonly<Record<PageSize, "md" | "sm">> = { lg: "md", md: "sm", sm: "sm" };

/**
 * Describes the props of the tab list: its name, its value and the words and mark of the picker.
 */
export interface TabListProps {
  /**
   * Accessible name of the tabs and of the picker's list. Defaults to `Sections`.
   */
  readonly "aria-label"?: string | undefined;

  /**
   * The page's tabs.
   */
  readonly children?: ReactNode | undefined;

  /**
   * Value of the tab selected at first, while the caller does not pass `value`.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Words the picker's list shows while no tab matches the filter. Defaults to `No tab matches`.
   */
  readonly emptyLabel?: string | undefined;

  /**
   * Words the picker's empty filter field shows. Defaults to `Filter tabs`.
   */
  readonly filterLabel?: string | undefined;

  /**
   * Called with the value of the tab a reader selects.
   */
  readonly onValueChange?: ((value: string) => void) | undefined;

  /**
   * Mark at the end of the picker's button, such as a chevron.
   */
  readonly pickerIcon?: ReactNode | undefined;

  /**
   * Value of the selected tab, when the caller controls it.
   */
  readonly value?: string | undefined;
}

/**
 * Renders the strip of tabs or the picker, and lists the tabs for the picker.
 *
 * @param props - The name, the value and the picker's words and mark.
 * @returns The tabs, or the picker on a narrow page.
 */
export function TabList({
  "aria-label": label = "Sections",
  children,
  defaultValue,
  emptyLabel = "No tab matches",
  filterLabel = "Filter tabs",
  onValueChange,
  pickerIcon,
  value,
}: TabListProps): ReactElement {
  const page = usePage();
  const [tabs, listing] = useListed();
  const [held, setValue] = useControllableState({ defaultValue, onChange: onValueChange, value });
  const selected = held ?? tabs[0]?.value;
  const panelId = useId();
  const state = useMemo(() => ({ ...listing, narrow: page.narrow }), [listing, page.narrow]);

  usePanelled(panelId, page.narrow ? undefined : selected);

  if (page.narrow) {
    return (
      <TabListProvider value={state}>
        {children}
        <TabPicker
          emptyLabel={emptyLabel}
          filterLabel={filterLabel}
          icon={pickerIcon}
          label={label}
          onPick={setValue}
          tabs={tabs}
          value={selected}
        />
      </TabListProvider>
    );
  }

  return (
    <TabListProvider value={state}>
      <Tabs.Root
        ids={{ content: () => panelId, trigger: (tab: string) => tabIdOf(panelId, tab) }}
        onValueChange={(details) => {
          setValue(details.value);
        }}
        size={TAB_SIZES[page.size]}
        value={selected}
        variant="line"
      >
        <Tabs.List aria-label={label} as={Strip}>
          {children}
          <Tabs.Indicator />
        </Tabs.List>
      </Tabs.Root>
    </TabListProvider>
  );
}
