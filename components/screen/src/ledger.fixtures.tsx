/**
 * Renders the block of invoices the app shell's specimen puts in its main region.
 *
 * @remarks
 *   The words are the page's, in the `page` namespace, because the page's locale defines the
 *   invoice keys.
 */

import { type ReactElement } from "react";

import { Divider, Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Section from "#section/index.ts";

/**
 * Invoices of the block: the payer, the amount and the state.
 */
const ROWS = [
  ["northwind", "1,250.00", "overdue"],
  ["contoso", "980.00", "sent"],
  ["fabrikam", "640.00", "sent"],
  ["tailspin", "275.00", "paid"],
] as const;

/**
 * Text tone of each invoice state.
 *
 * @remarks
 *   The state is coloured text and not a badge, because a badge on every row reads as a column of
 *   marks instead of a list.
 */
const TONES = { overdue: "error", paid: "success", sent: "info" } as const;

/**
 * Renders the invoices in a `surface` section, each row with its payer, state and amount.
 */
export function Ledger(): ReactElement {
  const { t } = useWords("page");

  return (
    <Section.Root as="div" variant="surface">
      <Section.Header>
        <Section.Title as="h4">{t("outstanding")}</Section.Title>
        <Section.Description>{t("owed")}</Section.Description>
      </Section.Header>
      <Section.Body>
        <Stack gap="sm">
          {ROWS.map(([payer, amount, state], at) => (
            <Stack gap="sm" key={payer}>
              {at === 0 ? null : <Divider />}
              <Stack direction="row" justify="between">
                <Stack direction="row" gap="sm">
                  <Text>{t(payer)}</Text>
                  <Text size="sm" tone={TONES[state]} weight="medium">
                    {t(state)}
                  </Text>
                </Stack>
                <Text tone="muted">{amount}</Text>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Section.Body>
    </Section.Root>
  );
}
