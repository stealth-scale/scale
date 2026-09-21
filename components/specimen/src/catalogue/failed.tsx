/**
 * Renders the failure notice for a part of the catalogue that could not be loaded.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";

import { useWords } from "#words.ts";

/**
 * Describes the props {@link Failed} accepts.
 */
export interface FailedProps {
  /**
   * The error the load rejected with. Its message is rendered as the reason.
   */
  readonly failure: Error;

  /**
   * The translation key of the failure text, which interpolates the reason.
   */
  readonly said: "page.failed" | "props.failed";
}

/**
 * Reloads the document, so the browser fetches the chunks of the release now served.
 */
function reloaded(): void {
  globalThis.location.reload();
}

/**
 * Renders the failure message and a button that reloads the document.
 *
 * @remarks
 *   The browser caches a failed dynamic import against the chunk's address and never retries it,
 *   so a chunk the current deployment does not serve fails every later import. A reload is the only
 *   recovery, and the component offers it instead of reloading by itself: an automatic reload
 *   loops while the network is down or the deployment is broken.
 * @param props - The error to report and the key naming which text to render.
 * @returns The failure message and the reload button.
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
