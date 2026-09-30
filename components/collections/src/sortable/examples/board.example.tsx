import { type ReactElement, useState } from "react";

import { GripVerticalIcon } from "lucide-react";

import { Badge } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Sortable from "#sortable/index.ts";

type Card = "api" | "copy" | "icons" | "spec" | "tests";

const LISTS = ["todo", "doing", "done"] as const;

const LIMIT = 3;

const START: Record<(typeof LISTS)[number], Array<{ id: Card }>> = {
  doing: [{ id: "api" }, { id: "tests" }],
  done: [],
  todo: [{ id: "spec" }, { id: "icons" }, { id: "copy" }],
};

export function Board(): ReactElement {
  const { t } = useWords("sortable");
  const [columns, setColumns] = useState(START);
  const [saved, setSaved] = useState<Sortable.SortableMove>();
  const titles = new Map<string, string>(LISTS.map((list) => [list, t(`board.${list}`)]));

  return (
    <Stack gap="md">
      <Sortable.Root
        canMove={(card, from, to) => from !== "todo" || to !== "done"}
        items={columns}
        onItemMove={setSaved}
        onItemsChange={setColumns}
      >
        <Sortable.Board>
          {LISTS.map((list) => (
            <Sortable.List
              key={list}
              label={titles.get(list)}
              limit={list === "doing" ? LIMIT : undefined}
              value={list}
            >
              <Stack align="baseline" direction="row" justify="between">
                <Heading as="h3" size="sm">
                  {titles.get(list)}
                </Heading>
                <Badge>
                  {list === "doing"
                    ? t("board.limit", { count: columns[list].length, limit: LIMIT })
                    : columns[list].length}
                </Badge>
              </Stack>
              <Sortable.Items>
                {columns[list].map((card, index) => (
                  <Sortable.Item
                    index={index}
                    key={card.id}
                    label={t(`board.cards.${card.id}`)}
                    value={card.id}
                  >
                    <Sortable.Handle>
                      <GripVerticalIcon />
                    </Sortable.Handle>
                    {t(`board.cards.${card.id}`)}
                  </Sortable.Item>
                ))}
              </Sortable.Items>
              <Sortable.Empty>{t("board.empty")}</Sortable.Empty>
            </Sortable.List>
          ))}
        </Sortable.Board>
      </Sortable.Root>
      <Text as="output" size="sm">
        {saved === undefined
          ? t("board.none")
          : t("board.saved", {
              list: titles.get(saved.to.list ?? ""),
              position: saved.to.index + 1,
            })}
      </Text>
    </Stack>
  );
}
