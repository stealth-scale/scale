import { type ReactElement } from "react";

import { ChevronDownIcon, CircleAlertIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as NativeSelect from "#native-select/index.ts";

const CURRENCIES = ["eur", "gbp", "usd"] as const;

export function Currency(props: Field.RootProps): ReactElement {
  const { t } = useWords("native-select");

  return (
    <Field.Root required {...props}>
      <Field.Label>
        {t("currency")}
        <Field.RequiredIndicator />
      </Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field placeholder={t("pickCurrency")}>
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {t(currency)}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator>
          <ChevronDownIcon />
        </NativeSelect.Indicator>
      </NativeSelect.Root>
      <Field.HelperText>{t("currencyHelp")}</Field.HelperText>
      <Field.ErrorText>
        <CircleAlertIcon />
        {t("currencyError")}
      </Field.ErrorText>
    </Field.Root>
  );
}
