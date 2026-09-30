import { type ReactElement } from "react";

import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import { Spinner } from "#spinner/index.ts";
import * as Toast from "#toast/index.ts";

import { toaster } from "./toaster.ts";

const MARKS: Readonly<Record<string, ReactElement>> = {
  error: <CircleAlertIcon />,
  info: <InfoIcon />,
  loading: <Spinner size="sm" />,
  success: <CircleCheckIcon />,
  warning: <TriangleAlertIcon />,
};

export function Toasts(): ReactElement {
  const { t } = useWords("toast");

  return (
    <>
      <Button
        onClick={() => {
          toaster.create({ description: t("region.description"), title: t("region.heading") });
        }}
        variant="outline"
      >
        {t("region.show")}
      </Button>
      <Toast.Region toaster={toaster}>
        {(toast) => (
          <Toast.Root>
            <Toast.Indicator>{MARKS[toast.type ?? "info"]}</Toast.Indicator>
            <Toast.Content>
              <Toast.Title>{toast.title}</Toast.Title>
              <Toast.Description>{toast.description}</Toast.Description>
            </Toast.Content>
            {toast.action === undefined ? null : (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            <Toast.CloseTrigger aria-label={t("dismiss")}>
              <XIcon />
            </Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toast.Region>
    </>
  );
}
