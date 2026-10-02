import { type ReactElement, useId, useState } from "react";
import { createPortal } from "react-dom";

import { CircleHelpIcon, PlusIcon, SearchIcon, XIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Badge } from "@stealthscale/component-data";
import { SearchInput } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Tour from "#tour/index.ts";

const STOPS = ["search", "create", "overdue"] as const;

const PRIMARY = { size: "sm" } as const;

const SECONDARY = { size: "sm", variant: "outline" } as const;

type Stop = "finish" | "welcome" | (typeof STOPS)[number];

type Label = "back" | "done" | "next" | "skip" | "start";

function stepsOf(
  id: string,
  text: (stop: Stop, part: "description" | "title") => string,
  label: (key: Label) => string,
): Tour.StepDetails[] {
  const onward: Tour.StepAction[] = [
    { action: "prev", label: label("back") },
    { action: "next", label: label("next") },
  ];
  const opening: Tour.StepAction[] = [
    { action: "skip", label: label("skip") },
    { action: "next", label: label("start") },
  ];

  return [
    {
      actions: opening,
      description: text("welcome", "description"),
      id: "welcome",
      title: text("welcome", "title"),
      type: "dialog",
    },
    ...STOPS.map((stop) => ({
      actions: onward,
      description: text(stop, "description"),
      id: stop,
      target: () => document.querySelector<HTMLElement>(`[id="${id}-${stop}"]`),
      title: text(stop, "title"),
    })),
    {
      actions: [{ action: "dismiss", label: label("done") }],
      description: text("finish", "description"),
      id: "finish",
      title: text("finish", "title"),
      type: "dialog",
    },
  ];
}

function card(tour: Tour.TourApi, close: string, progress: string): ReactElement {
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
            <Tour.ProgressText>{progress}</Tour.ProgressText>
            <Tour.Actions>
              {(actions) =>
                actions.map((action, index) => (
                  <ButtonPropsProvider
                    key={typeof action.action === "string" ? action.action : action.label}
                    value={index === actions.length - 1 ? PRIMARY : SECONDARY}
                  >
                    <Tour.ActionTrigger action={action} as={Button} />
                  </ButtonPropsProvider>
                ))
              }
            </Tour.Actions>
          </Tour.Control>
          <Tour.CloseTrigger aria-label={close}>
            <XIcon />
          </Tour.CloseTrigger>
        </Tour.Content>
      </Tour.Positioner>
    </>,
    document.body,
  );
}

export function Onboarding(): ReactElement {
  const { t } = useWords("tour");
  const id = useId();
  const [status, setStatus] = useState<Tour.StatusChangeDetails>();
  const tour = Tour.useTour({
    onStatusChange: setStatus,
    steps: stepsOf(
      id,
      (stop, part) => t(`onboarding.${stop}.${part}`),
      (key) => t(key),
    ),
  });

  return (
    <Stack gap="lg">
      <Stack direction="row" gap="sm" justify="between" wrap>
        <Heading as="h3" size="md">
          {t("onboarding.heading")}
        </Heading>
        <Button
          onClick={() => {
            tour.start();
          }}
          variant="ghost"
        >
          <CircleHelpIcon />
          {t("onboarding.start")}
        </Button>
      </Stack>
      <Stack id={`${id}-search`}>
        <SearchInput aria-label={t("onboarding.search.label")} searchIndicator={<SearchIcon />} />
      </Stack>
      <Stack direction="row" gap="sm" wrap>
        <Button id={`${id}-create`}>
          <PlusIcon />
          {t("onboarding.create.button")}
        </Button>
        <Badge id={`${id}-overdue`} palette="error">
          {t("onboarding.overdue.badge")}
        </Badge>
      </Stack>
      <Text as="output">
        {status === undefined
          ? ""
          : t(`onboarding.status.${status.status}`, { step: status.stepIndex + 1 })}
      </Text>
      <Tour.Root tour={tour}>
        {card(
          tour,
          t("close"),
          t("progress", { current: tour.stepIndex + 1, total: tour.totalSteps }),
        )}
      </Tour.Root>
    </Stack>
  );
}
