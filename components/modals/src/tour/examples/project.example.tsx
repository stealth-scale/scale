import { type ReactElement, useId } from "react";
import { createPortal } from "react-dom";

import { FolderPlusIcon, XIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Input } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Tour from "#tour/index.ts";

const PRIMARY = { size: "sm" } as const;

function at(id: string): () => HTMLElement | null {
  return () => document.querySelector<HTMLElement>(`[id="${id}"]`);
}

function named(id: string): Tour.StepDetails["effect"] {
  return ({ next, show }) => {
    const field = document.querySelector(`[id="${id}-name"] input`);
    const typed = (): void => {
      if (field instanceof HTMLInputElement && field.value.trim() !== "") next();
    };

    show();
    field?.addEventListener("input", typed);

    return () => field?.removeEventListener("input", typed);
  };
}

export function Project(): ReactElement {
  const { t } = useWords("tour");
  const id = useId();
  const tour = Tour.useTour({
    steps: [
      {
        description: t("project.name.description"),
        effect: named(id),
        id: "name",
        target: at(`${id}-name`),
        title: t("project.name.title"),
      },
      {
        actions: [{ action: "dismiss", label: t("done") }],
        description: t("project.create.description"),
        id: "create",
        target: at(`${id}-create`),
        title: t("project.create.title"),
      },
    ],
  });

  return (
    <Stack gap="sm">
      <Stack id={`${id}-name`}>
        <Input aria-label={t("project.label")} placeholder={t("project.placeholder")} />
      </Stack>
      <Stack direction="row" gap="sm" wrap>
        <Button id={`${id}-create`}>
          <FolderPlusIcon />
          {t("project.create.button")}
        </Button>
        <Button
          onClick={() => {
            tour.start();
          }}
          variant="ghost"
        >
          {t("project.start")}
        </Button>
      </Stack>
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
                <Tour.CloseTrigger aria-label={t("close")}>
                  <XIcon />
                </Tour.CloseTrigger>
              </Tour.Content>
            </Tour.Positioner>
          </>,
          document.body,
        )}
      </Tour.Root>
    </Stack>
  );
}
