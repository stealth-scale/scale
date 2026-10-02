/**
 * Renders a group of a form built from a schema: a fieldset where it has a legend, a disclosure
 * where it also starts closed, and its members alone where it has neither.
 *
 * @remarks
 *   The members run down the page, across it in a wrapping row, or in a grid of the count of
 *   columns the group states. A grid measures its members at their natural width, at least
 *   `sizes.48` a column, and lays them out in one column while they do not fit, so two fields on
 *   one row stack on a narrow screen. The legend is the library's `Fieldset.Legend`, and a closed
 *   group is the library's `Details`, whose summary shows the form's disclosure glyph. A repeat
 *   group is given `onAdd` and renders the library's `Button` after its items, which reads
 *   `<id>.actions.add`. The element with the foundation's id contains the members and that button,
 *   so focus moves to the button once the last item is removed. A fieldset and a disclosure take
 *   the form's section class, which spaces them apart from the fields around them and opens them
 *   with a hairline. The disclosure takes the plain look, so a closed group reads as a row under
 *   its hairline and not as a box.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Details } from "@stealthscale/component-disclosure";
import { omitUndefined, useCrowded } from "@stealthscale/hooks";
import { type GroupProps, useWords } from "@stealthscale/provider-form";

import * as Fieldset from "#fieldset/index.ts";
import { arrangementOf } from "#form/arrangement.ts";
import { withContext } from "#form/context.ts";
import { useFormScope } from "#form/scope.ts";

/**
 * Renders the members' `div` with the form's group class.
 */
const Members = withContext("div", "group");

/**
 * Renders the row of buttons with the form's actions class.
 */
const Actions = withContext("div", "actions");

/**
 * Renders the library's fieldset with the form's section class.
 */
const Section: (props: Fieldset.RootProps) => ReactElement = withContext(Fieldset.Root, "section");

/**
 * Renders the library's disclosure with the form's section class.
 */
const Disclosed: (props: Details.RootProps) => ReactElement = withContext(Details.Root, "section");

/**
 * Renders a group of fields.
 *
 * @param props - The members, the legend, the layout, the id and the function that adds an item.
 * @returns The fieldset, the disclosure or the members alone, with the button that adds an item
 *   where the group is given one.
 */
export function Group({
  children,
  closed,
  columns,
  direction,
  id,
  legend,
  onAdd,
}: GroupProps): ReactElement {
  const words = useWords();
  const { glyphs, size } = useFormScope();
  const [crowded, measured] = useCrowded();
  const laid = (
    <Members
      {...arrangementOf(columns, direction, crowded)}
      id={onAdd === undefined ? id : undefined}
      ref={columns === undefined ? undefined : measured}
    >
      {children}
    </Members>
  );
  const body =
    onAdd === undefined ? (
      laid
    ) : (
      <Members id={id}>
        {laid}
        <Actions>
          <Button onClick={onAdd} variant="outline" {...omitUndefined({ size })}>
            {words.action("add", "Add")}
          </Button>
        </Actions>
      </Members>
    );

  if (legend === undefined) return body;

  if (closed === true) {
    return (
      <Disclosed variant="plain">
        <Details.Summary>
          {glyphs.disclosure === undefined ? null : (
            <Details.Indicator>{glyphs.disclosure}</Details.Indicator>
          )}
          {legend}
        </Details.Summary>
        <Details.Content>{body}</Details.Content>
      </Disclosed>
    );
  }

  return (
    <Section {...omitUndefined({ size })}>
      <Fieldset.Legend>{legend}</Fieldset.Legend>
      {body}
    </Section>
  );
}
