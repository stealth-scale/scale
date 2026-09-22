/**
 * Draws the footer of a scene's card: the control that shows its source, the control that audits
 * it, and whichever of the two a reader has open.
 */

import { type ReactElement, type RefObject, useId } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Card } from "@stealthscale/component-surfaces";

import { Code } from "#catalogue/code.tsx";
import { Findings } from "#catalogue/page-audit.tsx";
import { Checks } from "#catalogue/page-checks.tsx";
import { Opens } from "#catalogue/page-opens.tsx";
import { Rated } from "#catalogue/page-rated.tsx";
import { usePanels } from "#catalogue/use-panels.ts";

/**
 * Describes what the footer takes.
 */
export interface ToolsProps {
  /**
   * The line a reader copies, or `null` where the scene has none.
   *
   * @remarks
   *   The generator writes the line from the sample a page states. A scene written by hand without
   *   a sample has no line, and the footer says so rather than opening on nothing.
   */
  readonly code: null | string;

  /**
   * The element the scene was drawn into, which is what the audit reads.
   */
  readonly stage: RefObject<HTMLElement | null>;

  /**
   * The scene's title, which heads the source.
   */
  readonly title: string;
}

/**
 * Draws the footer and whichever panel is open under it.
 *
 * @remarks
 *   Draw it inside `Card.Root` after the content, because the footer and the panels are parts of
 *   the card. The footer already lays its children along a line, so the two controls need nothing
 *   round them.
 *   Both panels carry the one id, because only one of them is ever drawn and both controls point
 *   at it. A panel is drawn only while it is open, so a closed panel costs the page nothing.
 *   The audit control stands at the start of the footer with what the audit came to beside it, and
 *   the source control stands at the end. A reader running down a page of scenes reads each result
 *   in the same column, and the control that produced it is the one next to it. The source control
 *   states the margin that holds the two ends apart, because it is the one drawn at every point:
 *   the result beside the audit control appears only once an audit has run.
 *   The panel is opened only where the scene broke a rule. A clean audit has one thing to say, and
 *   a panel that opened to say it pushed the next scene off the screen to report that nothing was
 *   wrong. The audit control is a disclosure on the same terms: with nothing to disclose it states
 *   no panel.
 *   The last report stands while a run is under way and is replaced when the new one arrives. It
 *   was cleared for the length of the run, and on a scene that audits in a frame that read as the
 *   footer blinking. The control goes off for the same length, which is what says a run is on.
 * @param props - The source, the element to audit, and the scene's title.
 * @returns The footer, and the open panel.
 */
export function Tools({ code, stage, title }: ToolsProps): ReactElement {
  const { audit, open, running, toggleAudit, toggleSource } = usePanels(stage);
  const id = useId();

  return (
    <>
      <Card.Footer>
        <Stack direction="row" gap="sm">
          <Checks
            id={id}
            onPress={toggleAudit}
            open={open === "audit"}
            ran={audit !== undefined && audit.findings.length > 0}
            running={running}
          />
          <Rated audit={audit} />
        </Stack>
        <Opens code={code} id={id} onPress={toggleSource} open={open === "source"} />
      </Card.Footer>
      {open === "source" && code !== null ? (
        <Card.Content id={id}>
          <Code code={code} title={title} />
        </Card.Content>
      ) : null}
      {open === "audit" && audit !== undefined ? (
        <Card.Content id={id}>
          <Findings audit={audit} />
        </Card.Content>
      ) : null}
    </>
  );
}
