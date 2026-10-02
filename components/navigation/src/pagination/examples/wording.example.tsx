import { type ReactElement } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Pagination from "#pagination/index.ts";

export function Wording(props: Pagination.PageTextProps): ReactElement {
  const { t } = useWords("pagination");

  return (
    <Pagination.Root count={240} defaultPage={12} pageSize={10} size="sm">
      <Pagination.PrevTrigger label={t("previous")}>
        <ChevronLeftIcon />
      </Pagination.PrevTrigger>
      <Pagination.PageText {...props} />
      <Pagination.NextTrigger label={t("next")}>
        <ChevronRightIcon />
      </Pagination.NextTrigger>
    </Pagination.Root>
  );
}
