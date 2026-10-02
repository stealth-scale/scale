import { type ReactElement } from "react";

import { CircleAlertIcon } from "lucide-react";

import { type FormGlyphs, useAppForm } from "@stealthscale/component-forms/form";
import { useWords } from "@stealthscale/specimen";

interface Draft {
  readonly amount: number | undefined;
  readonly customer: string;
  readonly due: string;
  readonly email: string;
  readonly reminder: boolean;
}

const EMPTY: Draft = { amount: undefined, customer: "", due: "", email: "", reminder: true };

const GLYPHS: FormGlyphs = { error: <CircleAlertIcon /> };

export function Invoice(): ReactElement {
  const { t } = useWords("form");
  const form = useAppForm({ defaultValues: EMPTY });
  const named = ({ value }: { readonly value: string }): string | undefined =>
    value === "" ? t("invoice.customer.missing") : undefined;

  return (
    <form.AppForm>
      <form.Form glyphs={GLYPHS}>
        <form.AppField name="customer" validators={{ onBlur: named, onSubmit: named }}>
          {(field) => <field.Text label={t("invoice.customer.label")} required />}
        </form.AppField>
        <form.AppField name="email">
          {(field) => <field.Text label={t("invoice.email")} type="email" />}
        </form.AppField>
        <form.AppField name="amount">
          {(field) => (
            <field.Number
              formatOptions={{ currency: "EUR", style: "currency" }}
              label={t("invoice.amount")}
            />
          )}
        </form.AppField>
        <form.AppField name="due">
          {(field) => <field.Date label={t("invoice.due")} />}
        </form.AppField>
        <form.AppField name="reminder">
          {(field) => <field.Switch label={t("invoice.reminder")} />}
        </form.AppField>
        <form.Submit>{t("invoice.send")}</form.Submit>
      </form.Form>
    </form.AppForm>
  );
}
