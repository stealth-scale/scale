/**
 * Draws the rail beside a page listing its sections, with a mark on the ones on screen.
 */

import { type ReactElement } from "react";

import { Toc } from "@stealthscale/component-navigation";
import { Page } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";

/**
 * Describes one section as the rail lists it.
 */
export interface Heading {
  /**
   * The anchor the section is reached by.
   */
  readonly id: string;

  /**
   * The words the rail writes.
   */
  readonly title: string;
}

/**
 * Describes what the rail takes.
 */
export interface ContentsProps {
  /**
   * The sections, in the order they are on the page.
   */
  readonly of: readonly Heading[];
}

/**
 * Draws the rail in the page's aside, sticking beside the body while the page scrolls.
 *
 * @remarks
 *   Draw it inside `Page.Root` from the screen package, after the body. The aside leaves a narrow
 *   page, because the rail is a way of moving through a long page and a phone moves through one by
 *   scrolling. The rail is the navigation package's table of contents, so the mark follows the
 *   sections as they come on screen and a press scrolls the page to one.
 */
export function Contents({ of }: ContentsProps): ReactElement {
  const { t } = useTranslation("specimen");
  const listed = of.map((heading) => ({
    item: { depth: 2, value: heading.id },
    title: heading.title,
  }));

  return (
    <Page.Aside aria-label={t("contents.title")} folds="hide" sticky>
      <Toc.Root items={listed.map(({ item }) => item)} size="sm">
        <Toc.Title>{t("contents.title")}</Toc.Title>
        <Toc.List>
          <Toc.Indicator />
          {listed.map(({ item, title }) => (
            <Toc.Item item={item} key={item.value}>
              <Toc.Link href={`#${item.value}`} item={item}>
                {title}
              </Toc.Link>
            </Toc.Item>
          ))}
        </Toc.List>
      </Toc.Root>
    </Page.Aside>
  );
}
