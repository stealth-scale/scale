import { type ReactElement } from "react";

import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as ToggleGroup from "#toggle-group/index.ts";

const ALIGNMENTS = [
  { Icon: AlignLeftIcon, value: "left" },
  { Icon: AlignCenterIcon, value: "center" },
  { Icon: AlignRightIcon, value: "right" },
] as const;

export function Alignment(props: ToggleGroup.RootProps): ReactElement {
  const { t } = useWords("toggle-group");

  return (
    <ToggleGroup.Root
      aria-label={t("align")}
      defaultValue={["left"]}
      deselectable={false}
      variant="outline"
      {...props}
    >
      {ALIGNMENTS.map(({ Icon, value }) => (
        <ToggleGroup.Item key={value} value={value}>
          <Icon size="1em" />
          {t(`alignments.${value}`)}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
