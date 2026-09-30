import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as ToggleGroup from "#toggle-group/index.ts";

const STATUSES = ["open", "pending", "paid", "archived"] as const;

export function Filters(): ReactElement {
  const { t } = useWords("toggle-group");

  return (
    <ToggleGroup.Root
      aria-label={t("show")}
      attached={false}
      defaultValue={["open", "pending"]}
      gap="xs"
      multiple
      palette="neutral"
      size="sm"
      variant="ghost"
    >
      {STATUSES.map((status) => (
        <ToggleGroup.Item disabled={status === "archived"} key={status} value={status}>
          {t(`statuses.${status}`)}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
