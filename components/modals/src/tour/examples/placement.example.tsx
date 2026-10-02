import { type ReactElement, useId } from "react";
import { createPortal } from "react-dom";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import * as Tour from "#tour/index.ts";

const SIDES = ["top", "right", "bottom", "left"] as const;

const PRIMARY = { size: "sm" } as const;

const SECONDARY = { size: "sm", variant: "outline" } as const;

export function Placement(): ReactElement {
  const { t } = useWords("tour");
  const id = useId();
  const tour = Tour.useTour({
    steps: SIDES.map((side) => ({
      description: t(`placement.${side}`),
      id: side,
      placement: side,
      target: (): HTMLElement | null => document.querySelector<HTMLElement>(`[id="${id}"]`),
      title: t("placement.heading"),
    })),
  });
  const forward: Tour.StepAction = tour.lastStep
    ? { action: "dismiss", label: t("done") }
    : { action: "next", label: t("next") };

  return (
    <>
      <Button
        id={id}
        onClick={() => {
          tour.start();
        }}
        variant="outline"
      >
        {t("placement.start")}
      </Button>
      <Tour.Root tour={tour}>
        {createPortal(
          <>
            <Tour.Backdrop />
            <Tour.Spotlight />
            <Tour.Positioner>
              <Tour.Content>
                <Tour.Arrow>
                  <Tour.ArrowTip />
                </Tour.Arrow>
                <Tour.Title />
                <Tour.Description />
                <Tour.Control>
                  {tour.firstStep ? null : (
                    <ButtonPropsProvider value={SECONDARY}>
                      <Tour.ActionTrigger
                        action={{ action: "prev", label: t("back") }}
                        as={Button}
                      />
                    </ButtonPropsProvider>
                  )}
                  <ButtonPropsProvider value={PRIMARY}>
                    <Tour.ActionTrigger action={forward} as={Button} />
                  </ButtonPropsProvider>
                </Tour.Control>
              </Tour.Content>
            </Tour.Positioner>
          </>,
          document.body,
        )}
      </Tour.Root>
    </>
  );
}
