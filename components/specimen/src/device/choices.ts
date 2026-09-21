/**
 * Reads the axes a framed document reports its scene offers, for the pickers over the frame.
 */

import { useEffect, useState } from "react";

import { type Choice, isReport } from "#framed/report.ts";

/**
 * Reports whether a message came from a document this page frames, at this page's own origin.
 *
 * @remarks
 *   Every framed document on the page reports to the same listener, and so does any other window
 *   that can post to this one. A report is read only from a frame this page holds, because that is
 *   the only document whose scene the pickers stand over, and only at the page's own origin,
 *   because the framed catalogue is served by the page's own server.
 */
function framed(event: MessageEvent): boolean {
  if (event.origin !== window.location.origin) return false;

  return [...document.querySelectorAll("iframe")].some(
    (frame) => frame.contentWindow === event.source,
  );
}

/**
 * Reads the axes the frame's document reports its scene offers.
 *
 * @remarks
 *   Only a report under the frame's own address is read, because every framed document on the
 *   page reports to the same listener. Two frames at one address show one sample, so a report
 *   read by both is right for both. What was reported is kept as the address moves within the
 *   scene, because the scene's axes do not change with the sample picked. A report from a window
 *   the page does not frame, or from another origin, is passed over whatever it carries.
 * @param address - The fragment the frame's document is loaded at.
 * @returns The axes, or none until reported.
 */
export function useChoices(address: string): readonly Choice[] {
  const [choices, setChoices] = useState<readonly Choice[]>([]);

  useEffect(() => {
    /**
     * Keeps the axes a report from a document at this frame's address carries.
     */
    const onMessage = (event: MessageEvent): void => {
      if (!framed(event) || !isReport(event.data) || event.data.address !== address) return;

      setChoices(event.data.choices);
    };

    window.addEventListener("message", onMessage);

    return (): void => {
      window.removeEventListener("message", onMessage);
    };
  }, [address]);

  return choices;
}
