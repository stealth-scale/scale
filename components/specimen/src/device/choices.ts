/**
 * Reads the choices a framed document reports for its scene, for the pickers rendered over the
 * frame.
 */

import { useEffect, useState } from "react";

import { type Choice, isReport } from "#framed/report.ts";

/**
 * Checks that a message came from an iframe this page contains, at this page's own origin.
 *
 * @remarks
 *   Every window that can post to this one hits the same listener, so the message has to be vetted
 *   before its contents are trusted. An iframe of this document is the only document the pickers
 *   control, and the same server serves the framed catalogue, so a cross-origin message cannot be
 *   one of ours.
 */
function framed(event: MessageEvent): boolean {
  if (event.origin !== window.location.origin) return false;

  return [...document.querySelectorAll("iframe")].some(
    (frame) => frame.contentWindow === event.source,
  );
}

/**
 * Subscribes to the choices reported by the framed document at a given address.
 *
 * @remarks
 *   Every framed document on the page hits the same listener, so reports are filtered down to the
 *   given address. Two frames at one address show the same sample, so a report from either is
 *   correct for both. Changing the address within a scene keeps the choices already held, because
 *   picking a sample does not change what the scene offers. A report from another origin, or from
 *   a window this document does not frame, is dropped.
 * @param address - The fragment the frame's document is loaded at.
 * @returns The choices, or an empty array until the first report arrives.
 */
export function useChoices(address: string): readonly Choice[] {
  const [choices, setChoices] = useState<readonly Choice[]>([]);

  useEffect(() => {
    /**
     * Stores the choices from a report at this address, and ignores every other message.
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
