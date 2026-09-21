/**
 * Says why a part of the catalogue could not be loaded, and offers the one recovery a reader has.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";

import { useWords } from "#words.ts";

/**
 * Describes what the notice takes.
 */
export interface FailedProps {
  /**
   * Why the load failed, shown as its message.
   */
  readonly failure: Error;

  /**
   * The key of the sentence that says what could not be loaded, which takes the reason.
   */
  readonly said: "page.failed" | "props.failed";
}

/**
 * Reloads the document, which is what fetches a release's chunks again after a deployment.
 */
function reloaded(): void {
  globalThis.location.reload();
}

/**
 * Draws the failure as a sentence with the reason, and a button that reloads the page.
 *
 * @remarks
 *   A chunk the page asked for and a deployment no longer serves fails the import, and the import
 *   is not tried again: the document caches the failure for the chunk's address. Reloading the
 *   document is the one thing that fetches the release now being served, so the notice offers it
 *   and does nothing on its own. A page that reloads itself when a fetch fails loops while the
 *   network is down or the deployment is bad, and a reader who pressed the button once knows what
 *   happened when the page comes back the same.
 * @param props - The failure and which sentence says what failed.
 * @returns The notice.
 */
export function Failed({ failure, said }: FailedProps): ReactElement {
  const { t } = useWords();

  return (
    <Stack gap="sm">
      <Text role="alert" tone="muted">
        {t(said, { reason: failure.message })}
      </Text>
      <Button onClick={reloaded} type="button">
        {t("page.reload")}
      </Button>
    </Stack>
  );
}
