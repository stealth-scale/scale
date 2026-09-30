import { type ReactElement } from "react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Pagination from "#pagination/index.ts";

export function Edges(): ReactElement {
  const { t } = useWords("pagination");

  return (
    <Pagination.Root count={240} defaultPage={12} pageSize={10} siblingCount={0}>
      <Pagination.FirstTrigger label={t("first")}>
        <ChevronsLeftIcon />
      </Pagination.FirstTrigger>
      <Pagination.PrevTrigger label={t("previous")}>
        <ChevronLeftIcon />
      </Pagination.PrevTrigger>
      <Pagination.Items
        label={(page) => t("page", { page })}
        summary={({ page, totalPages }) => t("summary", { page, totalPages })}
      />
      <Pagination.NextTrigger label={t("next")}>
        <ChevronRightIcon />
      </Pagination.NextTrigger>
      <Pagination.LastTrigger label={t("last")}>
        <ChevronsRightIcon />
      </Pagination.LastTrigger>
    </Pagination.Root>
  );
}
