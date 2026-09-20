/**
 * Draws the landmark the rail sits in, and runs the machine its parts share.
 *
 * @remarks
 *   The element is `nav`, which is the landmark a person navigating by landmark reaches. The
 *   machine names it after the title, so a page holding a rail beside its other navigation
 *   landmarks announces this one by the words the title holds. Draw a title, or the landmark is
 *   named by nothing. Every heading on screen is marked, read through an observer over the band
 *   `rootMargin` states. The machine's own band leaves out the foot of the viewport, so a short
 *   last section is never marked. A rail beside a page of sections states `rootMargin="0px"`, which
 *   marks every section in view and the last one once the page reaches its end.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#toc/context.ts";
import {
  ApiProvider,
  splitTocProps,
  type TocItem,
  type TocOptions,
  useTocMachine,
} from "#toc/machine.ts";

/**
 * Draws the landmark and sets the variants every part below it reads.
 */
const Landmark = withProvider("nav", "root");

/**
 * Describes what the root takes: the machine's options, the recipe's variants, and the element's.
 *
 * @remarks
 *   The element's own `id` and `dir` are left out, because the machine states both. It builds the
 *   reference between the landmark and its title from the id, and it writes the direction onto
 *   every part. The style prop of the same name as the machine's `scrollBehavior` is left out too,
 *   so the name reaches the machine, which scrolls the page to a heading by it. The headings are
 *   the one setting a caller has to give, because a rail over no headings lists nothing.
 */
export interface RootProps
  extends Omit<ComponentProps<typeof Landmark>, "dir" | "id" | "scrollBehavior">, TocOptions {
  /**
   * The headings on the page, in the order they are on it: the id of each in the document, and
   * how deep it sits.
   */
  readonly items: TocItem[];
}

/**
 * Lists the headings on a page and marks the ones on screen.
 *
 * @param props - The machine's options, the recipe's variants and the element's props together.
 * @returns The landmark, holding the parts, under the running machine.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitTocProps(props);
  const api = useTocMachine(options);

  return (
    <ApiProvider value={api}>
      <Landmark {...rest} {...api.getRootProps()} />
    </ApiProvider>
  );
}
