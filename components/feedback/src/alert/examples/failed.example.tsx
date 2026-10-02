import { type ReactElement } from "react";

import { TriangleAlertIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Alert from "#alert/index.ts";

export function Failed(props: Alert.RootProps): ReactElement {
  const { t } = useWords("alert");

  return (
    <Alert.Root {...props}>
      <Alert.Indicator>
        <TriangleAlertIcon />
      </Alert.Indicator>
      <Alert.Content>
        <Alert.Title>{t("failed")}</Alert.Title>
        <Alert.Description>{t("declined")}</Alert.Description>
      </Alert.Content>
      <Alert.CloseTrigger label={t("dismiss", { name: t("failed") })}>
        <XIcon />
      </Alert.CloseTrigger>
    </Alert.Root>
  );
}
