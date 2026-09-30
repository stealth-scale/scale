import { type ReactElement, useId } from "react";
import { createPortal } from "react-dom";

import { ArrowDownUpIcon, DownloadIcon, FilterIcon, LightbulbIcon, XIcon } from "lucide-react";

import { Button, ButtonPropsProvider, IconButton } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Tour from "#tour/index.ts";

const TOOLS = [
  { icon: FilterIcon, name: "filter" },
  { icon: ArrowDownUpIcon, name: "sort" },
  { icon: DownloadIcon, name: "export" },
] as const;

const PRIMARY = { size: "sm" } as const;

const SECONDARY = { size: "sm", variant: "outline" } as const;

interface Words {
  readonly back: string;
  readonly close: string;
  readonly done: string;
  readonly next: string;
  readonly progress: string;
}

function card(tour: Tour.TourApi, words: Words): ReactElement {
  const forward: Tour.StepAction = tour.lastStep
    ? { action: "dismiss", label: words.done }
    : { action: "next", label: words.next };

  return createPortal(
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
            <Tour.ProgressText>{words.progress}</Tour.ProgressText>
            {tour.firstStep ? null : (
              <ButtonPropsProvider value={SECONDARY}>
                <Tour.ActionTrigger action={{ action: "prev", label: words.back }} as={Button} />
              </ButtonPropsProvider>
            )}
            <ButtonPropsProvider value={PRIMARY}>
              <Tour.ActionTrigger action={forward} as={Button} />
            </ButtonPropsProvider>
          </Tour.Control>
          <Tour.CloseTrigger aria-label={words.close}>
            <XIcon />
          </Tour.CloseTrigger>
        </Tour.Content>
      </Tour.Positioner>
    </>,
    document.body,
  );
}

export function Tips(props: Omit<Tour.RootProps, "tour">): ReactElement {
  const { t } = useWords("tour");
  const id = useId();
  const tour = Tour.useTour({
    steps: TOOLS.map(({ name }) => ({
      description: t(`tips.${name}.description`),
      id: name,
      target: (): HTMLElement | null => document.querySelector<HTMLElement>(`[id="${id}-${name}"]`),
      title: t(`tips.${name}.title`),
    })),
  });

  return (
    <Stack direction="row" gap="xs">
      {TOOLS.map(({ icon: Icon, name }) => (
        <IconButton
          aria-label={t(`tips.${name}.title`)}
          id={`${id}-${name}`}
          key={name}
          variant="outline"
        >
          <Icon />
        </IconButton>
      ))}
      <IconButton
        aria-label={t("tips.start")}
        onClick={() => {
          tour.start();
        }}
        variant="ghost"
      >
        <LightbulbIcon />
      </IconButton>
      <Tour.Root tour={tour} {...props}>
        {card(tour, {
          back: t("back"),
          close: t("close"),
          done: t("done"),
          next: t("next"),
          progress: t("progress", { current: tour.stepIndex + 1, total: tour.totalSteps }),
        })}
      </Tour.Root>
    </Stack>
  );
}
