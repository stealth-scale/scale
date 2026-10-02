import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as NativeSelect from "#native-select/index.ts";

const ACCOUNTS = ["bridge", "halden", "perrin"] as const;

export function Accounts(props: NativeSelect.RootProps): ReactElement {
  const { t } = useWords("native-select");

  return (
    <NativeSelect.Root {...props}>
      <NativeSelect.Field aria-label={t("account")} placeholder={t("pick")}>
        {ACCOUNTS.map((account) => (
          <option key={account} value={account}>
            {t(account)}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator>
        <ChevronDownIcon />
      </NativeSelect.Indicator>
    </NativeSelect.Root>
  );
}
