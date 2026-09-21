/**
 * Tells the page holding a framed document which samples the scene inside offers, so the page can
 * draw a picker per axis over the frame.
 *
 * @remarks
 *   The axes a scene offers are known only where it is drawn, which is inside the frame, so the
 *   matrix or the board there posts them to the page that holds the document and the page draws
 *   the pickers from them. Every framed document on a page posts to the same page, so a report
 *   carries the address the document was loaded at and a frame reads the reports for its own
 *   address alone.
 */

import { useEffect } from "react";

import { type Pick } from "#framed/address.ts";
import { isRecord, isWorded } from "#guards.ts";

/**
 * The type a report carries, which the page reads before anything else in the message.
 */
export const REPORTED = "@stealthscale/specimen/framed";

/**
 * One axis of a scene a picker is drawn for: which part of a pick it sets, the prop it turns, and
 * its values as their cells are captioned.
 */
export interface Choice {
  /**
   * The prop the axis turns, or nothing where the axis names none.
   */
  readonly knob?: string | undefined;

  /**
   * The values, each named the way its cell is captioned.
   */
  readonly names: readonly string[];

  /**
   * The part of a pick the axis sets.
   */
  readonly part: keyof Pick;
}

/**
 * Describes what a framed document posts to the page holding it.
 */
export interface Report {
  /**
   * The fragment the document was loaded at, which is the sample's address.
   */
  readonly address: string;

  /**
   * The axes the scene offers a pick on.
   */
  readonly choices: readonly Choice[];

  /**
   * The type of the message, which is always {@link REPORTED}.
   */
  readonly type: typeof REPORTED;
}

/**
 * The parts of a pick an axis may set.
 */
const PARTS: ReadonlySet<unknown> = new Set<keyof Pick>(["across", "sample", "value"]);

/**
 * Reports whether a value is one axis of a scene.
 */
function isChoice(data: unknown): data is Choice {
  if (!isRecord(data)) return false;

  const { knob, names, part } = data;

  return isWorded(names) && PARTS.has(part) && (knob === undefined || typeof knob === "string");
}

/**
 * Reports whether a message is a framed document's report.
 *
 * @param data - The data a message carried.
 * @returns Whether it is a report.
 */
export function isReport(data: unknown): data is Report {
  if (!isRecord(data)) return false;

  const { address, choices, type } = data;

  if (type !== REPORTED || typeof address !== "string") return false;

  return Array.isArray(choices) && choices.every((choice) => isChoice(choice));
}

/**
 * Posts the axes a scene offers a pick on to the page holding the document, whenever they change.
 *
 * @remarks
 *   Nothing is posted where the document is not framed, because there is nobody to tell, or where
 *   there are no axes to post. The report carries the address the document was loaded at, so the
 *   page can tell which frame it came from. The axes are compared by what they hold rather than by
 *   identity, because a matrix and a board build the list on every render, and a report on every
 *   render is a message the page reads and answers with a render of its own.
 * @param choices - The axes, or nothing outside a framed document.
 */
export function useReportedChoices(choices: readonly Choice[] | undefined): void {
  const written = choices === undefined ? undefined : JSON.stringify(choices);

  useEffect(() => {
    if (written === undefined || window.parent === window) return;

    const message: Report = {
      address: window.location.hash,
      choices: parsed(written),
      type: REPORTED,
    };

    window.parent.postMessage(message, window.location.origin);
  }, [written]);
}

/**
 * Reads the axes back out of the text they were compared as.
 *
 * @remarks
 *   Read back rather than closed over, so the effect depends on the text alone and runs once per
 *   change of what the axes hold. The text was written from a list of axes by the one caller a
 *   moment before, so what it holds is one.
 * @returns The axes.
 */
function parsed(written: string): readonly Choice[] {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- written from a list of axes by the one caller, see the remarks
  return JSON.parse(written) as readonly Choice[];
}
