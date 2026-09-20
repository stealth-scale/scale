/**
 * Holds which of a scene's two panels is open, and runs the audit one of them shows.
 */

import { type RefObject, useCallback, useState } from "react";

import { type Audit, audited } from "#catalogue/audited.ts";

/**
 * Selects the panel a reader has open, or neither.
 */
export type Open = "audit" | "none" | "source";

/**
 * Describes what {@link usePanels} returns.
 */
export interface Panels {
  /**
   * The last audit, or nothing until one has run.
   */
  readonly audit: Audit | undefined;

  /**
   * The panel a reader has open.
   */
  readonly open: Open;

  /**
   * Whether an audit is under way, which is what holds its control off.
   */
  readonly running: boolean;

  /**
   * Opens the audit, running it first, or closes it.
   */
  readonly toggleAudit: () => void;

  /**
   * Opens the source, or closes it.
   */
  readonly toggleSource: () => void;
}

/**
 * Returns which panel is open, the last audit, and the two ways to change either.
 *
 * @remarks
 *   One panel is open at a time. Both are long, and two open at once pushes the scene they belong
 *   to off the screen, so opening either closes the other.
 *   Whether the audit is open is read off what a reader asked for and what has arrived, rather than
 *   held as a third piece of state. Set when the run finished, it would have to be set from an
 *   effect, which draws the page once with the control pressed and no panel under it.
 *   A clean audit opens no panel. It has one thing to say and the footer says it, so a panel would
 *   be a card's height of room holding one line a reader has already read.
 *   The audit is run again on every asking rather than kept, because a scene holds state and a
 *   reader who has opened a menu or typed into a field wants the audit of what is on the screen. A
 *   run against nothing does not start: the element is filled once the scene is drawn, so a control
 *   pressed before then reports nothing rather than auditing the whole document.
 * @param stage - The element the scene was drawn into.
 * @returns The open panel, the last audit, and the two ways to change either.
 */
export function usePanels(stage: RefObject<HTMLElement | null>): Panels {
  const [source, setSource] = useState(false);
  const [asked, setAsked] = useState(false);
  const [audit, setAudit] = useState<Audit | undefined>();
  const [running, setRunning] = useState(false);

  const toggleSource = useCallback((): void => {
    setAsked(false);
    setSource((held) => !held);
  }, []);

  const toggleAudit = useCallback((): void => {
    setAsked((held) => !held);
    setSource(false);

    const element = stage.current;

    if (asked || element === null) return;

    setRunning(true);

    void (async (): Promise<void> => {
      try {
        setAudit(await audited(element));
      } finally {
        setRunning(false);
      }
    })();
  }, [asked, stage]);

  return {
    audit,
    open: opened(asked && (audit?.findings.length ?? 0) > 0, source),
    running,
    toggleAudit,
    toggleSource,
  };
}

/**
 * Reads which panel is open from whether each of the two has anything to show.
 */
function opened(audit: boolean, source: boolean): Open {
  if (audit) return "audit";

  return source ? "source" : "none";
}
