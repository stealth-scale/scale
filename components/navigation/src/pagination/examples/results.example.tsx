import { type ReactElement } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Pagination from "#pagination/index.ts";

export function Results(props: Pagination.RootProps): ReactElement {
  const { t } = useWords("pagination");

  return (
    <Pagination.Root count={240} defaultPage={12} pageSize={10} {...props}>
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
    </Pagination.Root>
  );
}
