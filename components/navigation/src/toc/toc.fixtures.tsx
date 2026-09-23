/**
 * Test fixtures for the table of contents parts, which read the machine from the root.
 */

import { type ReactElement, type ReactNode } from "react";

import { Indicator } from "#toc/indicator.tsx";
import { Item } from "#toc/item.tsx";
import { Link } from "#toc/link.tsx";
import { List } from "#toc/list.tsx";
import { type TocItem } from "#toc/machine.ts";
import { Root, type RootProps } from "#toc/root.tsx";
import { Title } from "#toc/title.tsx";

/**
 * Three headings: two at depth 2 and one at depth 3.
 */
export const ITEMS: readonly TocItem[] = [
  { depth: 2, value: "sizes" },
  { depth: 3, value: "large" },
  { depth: 2, value: "looks" },
];

/**
 * Renders the part under test inside `Toc.Root` over `ITEMS`.
 */
export function railed(children: ReactNode): ReactElement {
  return <Root items={[...ITEMS]}>{children}</Root>;
}

/**
 * Renders every part over `ITEMS`, with the props passed to the root.
 */
export function composed(props: Partial<RootProps> = {}): ReactElement {
  return (
    <Root items={[...ITEMS]} {...props}>
      <Title>On this page</Title>
      <List>
        <Indicator />
        {ITEMS.map((item) => (
          <Item item={item} key={item.value}>
            <Link href={`#${item.value}`} item={item}>
              {item.value}
            </Link>
          </Item>
        ))}
      </List>
    </Root>
  );
}
