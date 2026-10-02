import { type ReactElement } from "react";

import {
  CheckIcon,
  CopyIcon,
  InfoIcon,
  SquareCheckBigIcon,
  SquareIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { Markdown } from "#markdown/index.ts";

export function Policy(): ReactElement {
  const { t } = useWords("markdown");

  return (
    <Markdown
      copiedLabel={t("policy.copied")}
      copyLabel={t("policy.copy")}
      glyphs={{
        callouts: { note: <InfoIcon />, warning: <TriangleAlertIcon /> },
        copy: {
          copied: <CheckIcon aria-hidden size="1em" />,
          idle: <CopyIcon aria-hidden size="1em" />,
        },
        tasks: { done: <SquareCheckBigIcon />, open: <SquareIcon /> },
      }}
      headingLevel={3}
      source={t("policy.source")}
    />
  );
}
