/**
 * Builds the tags the part specs render their subjects in.
 */

import { type ReactElement, type ReactNode } from "react";

import { CloseTrigger } from "#tag/close-trigger.ts";
import { EndElement } from "#tag/end-element.ts";
import { Label } from "#tag/label.ts";
import { Root, type RootProps } from "#tag/root.ts";
import { StartElement } from "#tag/start-element.ts";

/**
 * Renders a part inside a tag root that provides the variants.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The root, which contains the part.
 */
export function tagged(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Renders a complete tag: a start mark, a label, an end mark and a close trigger.
 *
 * @param props - The root's props.
 * @returns The tag.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <StartElement>
        <svg aria-hidden />
      </StartElement>
      <Label>payouts</Label>
      <EndElement>
        <svg aria-hidden />
      </EndElement>
      <CloseTrigger aria-label="Remove payouts">
        <svg aria-hidden />
      </CloseTrigger>
    </Root>
  );
}
