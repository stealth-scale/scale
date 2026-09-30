import { type ReactElement, useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { SegmentGroup } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Pagination from "#pagination/index.ts";

const INVOICES = Array.from({ length: 23 }, (_, index) => ({
  amount: (180 + index * 37).toFixed(2),
  number: 2001 + index,
}));

const SIZES = ["5", "10", "20"] as const;

export function Invoices(): ReactElement {
  const { t } = useWords("pagination");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const shown = INVOICES.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Stack gap="md">
      <Stack as="ul" gap="xs">
        {shown.map((invoice) => (
          <Stack as="li" direction="row" justify="between" key={invoice.number}>
            <Text as="span">{t("table.invoice", { number: invoice.number })}</Text>
            <Text as="span" tone="muted">
              {t("table.amount", { amount: invoice.amount })}
            </Text>
          </Stack>
        ))}
      </Stack>
      <Stack align="baseline" direction="row" gap="md" justify="between" wrap>
        <Stack align="baseline" direction="row" gap="sm">
          <Text aria-hidden as="span" size="sm" tone="muted">
            {t("table.perPage")}
          </Text>
          <SegmentGroup.Root
            aria-label={t("table.perPage")}
            onValueChange={({ value }) => {
              setPageSize(Number(value));
              setPage(1);
            }}
            size="sm"
            value={String(pageSize)}
          >
            {SIZES.map((size) => (
              <SegmentGroup.Item key={size} value={size}>
                <SegmentGroup.ItemText>{size}</SegmentGroup.ItemText>
              </SegmentGroup.Item>
            ))}
          </SegmentGroup.Root>
        </Stack>
        <Pagination.Root
          count={INVOICES.length}
          onPageChange={(details) => {
            setPage(details.page);
          }}
          page={page}
          pageSize={pageSize}
          size="sm"
        >
          <Pagination.PageText format="long" />
          <Pagination.PrevTrigger label={t("previous")}>
            <ChevronLeftIcon />
          </Pagination.PrevTrigger>
          <Pagination.NextTrigger label={t("next")}>
            <ChevronRightIcon />
          </Pagination.NextTrigger>
        </Pagination.Root>
      </Stack>
    </Stack>
  );
}
