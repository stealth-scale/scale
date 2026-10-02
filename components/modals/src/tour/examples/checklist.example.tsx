import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { ListChecksIcon, XIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import * as Tour from "#tour/index.ts";

const TASKS = ["invite", "bank", "invoice"] as const;

const PRIMARY = { size: "sm" } as const;

const SECONDARY = { size: "sm", variant: "outline" } as const;

export function Checklist(): ReactElement {
  const { t } = useWords("tour");
  const tour = Tour.useTour({
    closeOnInteractOutside: false,
    steps: TASKS.map((task) => ({
      description: t(`checklist.${task}.description`),
      id: task,
      title: t(`checklist.${task}.title`),
      type: "floating",
    })),
  });
  const forward: Tour.StepAction = tour.lastStep
    ? { action: "dismiss", label: t("done") }
    : { action: "next", label: t("next") };

  return (
    <>
      <Button
        onClick={() => {
          tour.start();
        }}
        variant="outline"
      >
        <ListChecksIcon />
        {t("checklist.start")}
      </Button>
      <Tour.Root tour={tour}>
        {createPortal(
          <Tour.Positioner>
            <Tour.Content>
              <Tour.Title />
              <Tour.Description />
              <Tour.Control>
                <Tour.ProgressText>
                  {t("progress", { current: tour.stepIndex + 1, total: tour.totalSteps })}
                </Tour.ProgressText>
                {tour.firstStep ? null : (
                  <ButtonPropsProvider value={SECONDARY}>
                    <Tour.ActionTrigger action={{ action: "prev", label: t("back") }} as={Button} />
                  </ButtonPropsProvider>
                )}
                <ButtonPropsProvider value={PRIMARY}>
                  <Tour.ActionTrigger action={forward} as={Button} />
                </ButtonPropsProvider>
              </Tour.Control>
              <Tour.CloseTrigger aria-label={t("close")}>
                <XIcon />
              </Tour.CloseTrigger>
            </Tour.Content>
          </Tour.Positioner>,
          document.body,
        )}
      </Tour.Root>
    </>
  );
}
