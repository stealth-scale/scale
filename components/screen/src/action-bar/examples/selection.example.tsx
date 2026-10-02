import { type ReactElement, useState } from "react";

import { CheckIcon, DownloadIcon, ReceiptIcon, XIcon } from "lucide-react";

import { Checkbox } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as ActionBar from "#action-bar/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const INVOICES = ["1042", "1043", "1044", "1045"] as const;

const ACTIONS = [
  { Icon: DownloadIcon, name: "download", primary: false },
  { Icon: ReceiptIcon, name: "mark", primary: true },
] as const;

function choices<Name extends string>(
  names: readonly Name[],
  label: (name: Name) => string,
  selected: readonly string[],
  toggle: (name: Name, on: boolean) => void,
): ReactElement[] {
  return names.map((name) => (
    <Checkbox.Root
      checked={selected.includes(name)}
      key={name}
      onCheckedChange={({ checked }) => {
        toggle(name, checked === true);
      }}
    >
      <Checkbox.Control>
        <Checkbox.Indicator>
          <CheckIcon strokeWidth={3} />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label>{label(name)}</Checkbox.Label>
    </Checkbox.Root>
  ));
}

export function Selection(props: Omit<ActionBar.RootProps, "open">): ReactElement {
  const { t } = useWords("action-bar");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [done, setDone] = useState("");
  const count = selected.length;
  const toggle = (number: string, on: boolean): void => {
    setSelected((held) => (on ? [...held, number] : held.filter((each) => each !== number)));
  };

  return (
    <Stack gap="sm">
      {choices(INVOICES, (number) => t("selection.invoice", { number }), selected, toggle)}
      <Text as="output">{done}</Text>
      <ActionBar.Root
        {...props}
        onOpenChange={() => {
          setSelected([]);
        }}
        open={count > 0}
      >
        <ActionBar.Positioner>
          <ActionBar.Content>
            <Toolbar.Root aria-label={t("selection.label")} size="sm">
              <Toolbar.Start>
                <ActionBar.CloseTrigger aria-label={t("clear")}>
                  <XIcon size="1em" />
                </ActionBar.CloseTrigger>
                <Text size="sm">{t("selection.count", { count })}</Text>
              </Toolbar.Start>
              <Toolbar.End>
                {ACTIONS.map(({ Icon, name, primary }) => (
                  <Toolbar.Action
                    icon={<Icon size="1em" />}
                    key={name}
                    onClick={() => {
                      setDone(t(`selection.${name}.done`, { count }));
                    }}
                    primary={primary}
                    priority={primary ? "primary" : undefined}
                  >
                    {t(`selection.${name}.label`)}
                  </Toolbar.Action>
                ))}
              </Toolbar.End>
            </Toolbar.Root>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </ActionBar.Root>
    </Stack>
  );
}
