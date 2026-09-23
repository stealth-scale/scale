import { type ReactElement } from "react";

import { InfoIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Alert from "#alert/index.ts";

export function Saved(props: Alert.RootProps): ReactElement {
  const { t } = useWords("alert");

  return (
    <Alert.Root {...props}>
      <Alert.Indicator>
        <InfoIcon />
      </Alert.Indicator>
      <Alert.Content>
        <Alert.Title>{t("saved")}</Alert.Title>
        <Alert.Description>{t("restored")}</Alert.Description>
      </Alert.Content>
      <Alert.CloseTrigger label={t("dismiss", { name: t("saved") })}>
        <XIcon />
      </Alert.CloseTrigger>
    </Alert.Root>
  );
}
