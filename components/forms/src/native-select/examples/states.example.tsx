import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as NativeSelect from "#native-select/index.ts";

export function States(): ReactElement {
  const { t } = useWords("native-select");

  return (
    <Stack gap="md">
      <NativeSelect.Root>
        <NativeSelect.Field aria-label={t("account")} disabled placeholder={t("disabled")}>
          <option value="bridge">{t("bridge")}</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator>
          <ChevronDownIcon />
        </NativeSelect.Indicator>
      </NativeSelect.Root>
      <NativeSelect.Root>
        <NativeSelect.Field aria-invalid aria-label={t("account")} placeholder={t("invalid")}>
          <option value="bridge">{t("bridge")}</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator>
          <ChevronDownIcon />
        </NativeSelect.Indicator>
      </NativeSelect.Root>
    </Stack>
  );
}
