import { type ReactElement, useState } from "react";

import { CheckIcon, DownloadIcon, EllipsisIcon, Share2Icon, XIcon } from "lucide-react";

import { Checkbox } from "@stealthscale/component-forms";
import { Grid, Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as ActionBar from "#action-bar/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const PHOTOS = ["harbour", "market", "bridge", "garden", "tower", "square"] as const;

const ACTIONS = [
  { name: "album" },
  { name: "trash" },
  { Icon: DownloadIcon, name: "download" },
  { Icon: Share2Icon, name: "share", primary: true },
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

export function Photos(): ReactElement {
  const { t } = useWords("action-bar");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [done, setDone] = useState("");
  const count = selected.length;
  const toggle = (photo: string, on: boolean): void => {
    setSelected((held) => (on ? [...held, photo] : held.filter((each) => each !== photo)));
  };

  return (
    <Stack gap="sm">
      <Grid.Root columns="2" justify="start">
        {choices(PHOTOS, (photo) => t(`photos.names.${photo}`), selected, toggle)}
      </Grid.Root>
      <Text as="output">{done}</Text>
      <ActionBar.Root
        announcement={t("photos.announcement")}
        onOpenChange={() => {
          setSelected([]);
        }}
        open={count > 0}
        placement="bottom-end"
      >
        <ActionBar.Positioner>
          <ActionBar.Content>
            <Toolbar.Root
              aria-label={t("photos.label")}
              more={t("photos.more")}
              moreIcon={<EllipsisIcon size="1em" />}
              size="sm"
            >
              <Toolbar.Start>
                <ActionBar.CloseTrigger aria-label={t("clear")}>
                  <XIcon size="1em" />
                </ActionBar.CloseTrigger>
                <Text size="sm">{t("photos.count", { count })}</Text>
              </Toolbar.Start>
              <Toolbar.End>
                {ACTIONS.map((action) => (
                  <Toolbar.Action
                    icon={"Icon" in action ? <action.Icon size="1em" /> : undefined}
                    key={action.name}
                    onClick={() => {
                      setDone(t("photos.done", { action: t(`photos.${action.name}`), count }));
                    }}
                    primary={"primary" in action}
                    priority={"primary" in action ? "primary" : undefined}
                  >
                    {t(`photos.${action.name}`)}
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
