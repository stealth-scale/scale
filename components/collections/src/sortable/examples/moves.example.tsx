import { type ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import { EllipsisIcon, GripVerticalIcon } from "lucide-react";

import { ButtonPropsProvider, IconButton } from "@stealthscale/component-actions";
import { Menu } from "@stealthscale/component-disclosure";
import { useWords } from "@stealthscale/specimen";

import * as Sortable from "#sortable/index.ts";

const TASKS = ["invoices", "payroll", "audit", "taxes"] as const;

const ACTIONS = ["first", "up", "down", "last"] as const;

function indexFor(action: string, index: number, count: number): number {
  if (action === "first") return 0;

  if (action === "last") return count - 1;

  return action === "up" ? index - 1 : index + 1;
}

export function Moves(): ReactElement {
  const { t } = useWords("sortable");
  const [tasks, setTasks] = useState(TASKS.map((id) => ({ id })));

  return (
    <Sortable.Root items={tasks} onItemsChange={setTasks}>
      {({ move }) => (
        <Sortable.Items aria-label={t("moves.label")}>
          {tasks.map((task, index) => (
            <Sortable.Item
              index={index}
              key={task.id}
              label={t(`moves.${task.id}`)}
              value={task.id}
            >
              <Sortable.Handle>
                <GripVerticalIcon />
              </Sortable.Handle>
              <Sortable.ItemContent>{t(`moves.${task.id}`)}</Sortable.ItemContent>
              <Menu.Root
                onSelect={({ value }) => {
                  move(task.id, { index: indexFor(value, index, tasks.length) });
                }}
              >
                <ButtonPropsProvider value={{ size: "xs", variant: "ghost" }}>
                  <Menu.Trigger
                    aria-label={t("moves.more", { name: t(`moves.${task.id}`) })}
                    as={IconButton}
                  >
                    <EllipsisIcon />
                  </Menu.Trigger>
                </ButtonPropsProvider>
                {createPortal(
                  <Menu.Positioner>
                    <Menu.Content>
                      {ACTIONS.map((action) => (
                        <Menu.Item
                          disabled={
                            ["first", "up"].includes(action)
                              ? index === 0
                              : index === tasks.length - 1
                          }
                          key={action}
                          value={action}
                        >
                          {t(`moves.${action}`)}
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>,
                  document.body,
                )}
              </Menu.Root>
            </Sortable.Item>
          ))}
        </Sortable.Items>
      )}
    </Sortable.Root>
  );
}
