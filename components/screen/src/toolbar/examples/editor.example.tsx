import { type ReactElement, useState } from "react";

import { BoldIcon, ItalicIcon, MenuIcon, ShareIcon, UnderlineIcon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Toolbar from "#toolbar/index.ts";

const MARKS = [
  { Mark: BoldIcon, name: "bold" },
  { Mark: ItalicIcon, name: "italic" },
  { Mark: UnderlineIcon, name: "underline" },
] as const;

export function Editor(props: Omit<Toolbar.RootProps, "aria-label">): ReactElement {
  const { t } = useWords("toolbar");
  const [marked, setMarked] = useState<readonly string[]>([]);

  return (
    <Toolbar.Root aria-label={t("editing")} size="sm" {...props}>
      <Toolbar.Start>
        <Toolbar.Item aria-label={t("menu")} as={IconButton} variant="ghost">
          <MenuIcon size="1em" />
        </Toolbar.Item>
      </Toolbar.Start>
      <Toolbar.Center>
        <Text size="sm" weight="medium">
          {t("draft")}
        </Text>
      </Toolbar.Center>
      <Toolbar.End>
        <Toolbar.Group>
          {MARKS.map(({ Mark, name }) => (
            <Toolbar.Item
              aria-label={t(name)}
              aria-pressed={marked.includes(name)}
              as={IconButton}
              key={name}
              onClick={() => {
                setMarked((held) =>
                  held.includes(name) ? held.filter((each) => each !== name) : [...held, name],
                );
              }}
              variant="outline"
            >
              <Mark size="1em" />
            </Toolbar.Item>
          ))}
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Action icon={<ShareIcon size="1em" />} primary>
          {t("share")}
        </Toolbar.Action>
      </Toolbar.End>
    </Toolbar.Root>
  );
}
