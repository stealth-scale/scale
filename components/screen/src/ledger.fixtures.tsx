/**
 * Draws the block of invoices the page and the shell both put in their main region.
 *
 * @remarks
 *   One block written once. The page shows where its own edges fall by holding something real, and
 *   the shell shows what a main region is for by holding the same thing, so a reader moving between
 *   the two pages recognises what they are looking at. Written twice it drifted: the page drew a
 *   ledger and the shell drew four grey blocks standing in for one.
 *   The words are the page's, because that is the namespace the block was written in and a block
 *   drawn on two pages cannot have two sets.
 */

import { type ReactElement } from "react";

import { Divider, Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Section from "#section/index.ts";

/**
 * The invoices the block lists: who owes it, what they owe, and where it has got to.
 */
const ROWS = [
  ["northwind", "1,250.00", "overdue"],
  ["contoso", "980.00", "sent"],
  ["fabrikam", "640.00", "sent"],
  ["tailspin", "275.00", "paid"],
] as const;

/**
 * The ink each state of an invoice is told by.
 *
 * @remarks
 *   The ink rather than a badge. A row of a ledger carries a state on every line, and a filled
 *   shape on every line reads as a column of marks rather than as a list of invoices.
 */
const TONES = { overdue: "error", paid: "success", sent: "info" } as const;

/**
 * Draws the invoices as a block of a page: who owes it, where it has got to, and what it comes to.
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
