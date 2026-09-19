/**
 * Builds the rail a part's specification needs above it, every part reading one machine.
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
 * The headings a case lists: two at the top and one a level in.
 */
export const ITEMS: readonly TocItem[] = [
  { depth: 2, value: "sizes" },
  { depth: 3, value: "large" },
  { depth: 2, value: "looks" },
];

/**
 * Draws whatever a case wants measured inside the root that runs the machine.
 *
 * @param children - The part under test.
 * @returns The root, holding it.
 */
export function railed(children: ReactNode): ReactElement {
  return <Root items={[...ITEMS]}>{children}</Root>;
}

/**
 * Draws a whole rail over three headings, so a case can read what the rows say.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The six parts composed the way a caller composes them.
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
