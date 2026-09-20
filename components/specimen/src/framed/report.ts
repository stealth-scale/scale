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
 * Reports whether a value is an object whose fields can be read.
 */
function isRecord(data: unknown): data is Record<string, unknown> {
  return typeof data === "object" && data !== null;
}

/**
 * Reports whether a value is a list of words.
 */
function isWorded(data: unknown): data is readonly string[] {
  return Array.isArray(data) && data.every((name) => typeof name === "string");
}

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
 *   page can tell which frame it came from.
 * @param choices - The axes, or nothing outside a framed document.
 */
export function useReportedChoices(choices: readonly Choice[] | undefined): void {
  useEffect(() => {
    if (choices === undefined || window.parent === window) return;

    const message: Report = { address: window.location.hash, choices, type: REPORTED };

    window.parent.postMessage(message, window.location.origin);
  }, [choices]);
}
