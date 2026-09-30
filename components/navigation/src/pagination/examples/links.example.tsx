import { type ReactElement, useSyncExternalStore } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Pagination from "#pagination/index.ts";

const ADDRESS = /^#results-page-(\d+)$/u;

function subscribe(changed: () => void): () => void {
  window.addEventListener("hashchange", changed);

  return () => {
    window.removeEventListener("hashchange", changed);
  };
}

export function Links(): ReactElement {
  const { t } = useWords("pagination");
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
  const current = Number(ADDRESS.exec(hash)?.[1] ?? 3);

  return (
    <Pagination.Root
      count={90}
      getPageUrl={({ page }) => `#results-page-${page}`}
      page={current}
      pageSize={10}
      type="link"
    >
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
