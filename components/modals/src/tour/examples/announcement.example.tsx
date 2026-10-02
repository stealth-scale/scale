import { type ReactElement, useId } from "react";
import { createPortal } from "react-dom";

import { DownloadIcon, SparklesIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Tour from "#tour/index.ts";

const PRIMARY = { size: "sm" } as const;

export function Announcement(): ReactElement {
  const { t } = useWords("tour");
  const id = useId();
  const tour = Tour.useTour({
    steps: [
      {
        actions: [{ action: "dismiss", label: t("announcement.dismiss") }],
        backdrop: false,
        description: t("announcement.description"),
        id: "export",
        placement: "bottom-start",
        target: (): HTMLElement | null =>
          document.querySelector<HTMLElement>(`[id="${id}-export"]`),
        title: t("announcement.heading"),
      },
    ],
  });

  return (
    <Stack direction="row" gap="sm" wrap>
      <Button id={`${id}-export`} variant="outline">
        <DownloadIcon />
        {t("announcement.export")}
      </Button>
      <Button
        onClick={() => {
          tour.start();
        }}
        variant="ghost"
      >
        <SparklesIcon />
        {t("announcement.start")}
      </Button>
      <Tour.Root tour={tour}>
        {createPortal(
          <>
            <Tour.Spotlight />
            <Tour.Positioner>
              <Tour.Content>
                <Tour.Arrow>
                  <Tour.ArrowTip />
                </Tour.Arrow>
                <Tour.Title />
                <Tour.Description />
                <Tour.Control>
                  <Tour.Actions>
                    {(actions) =>
                      actions.map((action) => (
                        <ButtonPropsProvider key={action.label} value={PRIMARY}>
                          <Tour.ActionTrigger action={action} as={Button} />
                        </ButtonPropsProvider>
                      ))
                    }
                  </Tour.Actions>
                </Tour.Control>
              </Tour.Content>
            </Tour.Positioner>
          </>,
          document.body,
        )}
      </Tour.Root>
    </Stack>
  );
}
