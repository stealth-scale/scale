import { type ReactElement } from "react";

import { BoldIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as ToggleGroup from "#toggle-group/index.ts";

const STYLES = [
  { Icon: BoldIcon, value: "bold" },
  { Icon: ItalicIcon, value: "italic" },
  { Icon: UnderlineIcon, value: "underline" },
  { Icon: StrikethroughIcon, value: "strikethrough" },
] as const;

export function Formatting(props: ToggleGroup.RootProps): ReactElement {
  const { t } = useWords("toggle-group");

  return (
    <ToggleGroup.Root
      aria-label={t("style")}
      defaultValue={["bold", "italic"]}
      multiple
      variant="outline"
      {...props}
    >
      {STYLES.map(({ Icon, value }) => (
        <ToggleGroup.Item
          aria-label={t(`styles.${value}`)}
          key={value}
          shape="square"
          value={value}
        >
          <Icon size="1em" />
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
