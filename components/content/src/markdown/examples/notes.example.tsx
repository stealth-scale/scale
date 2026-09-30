import { type ReactElement } from "react";

import { InfoIcon, SquareCheckBigIcon, SquareIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { Markdown } from "#markdown/index.ts";

export function Notes(props: Partial<Parameters<typeof Markdown>[0]>): ReactElement {
  const { t } = useWords("markdown");

  return (
    <Markdown
      glyphs={{
        callouts: { note: <InfoIcon /> },
        tasks: { done: <SquareCheckBigIcon />, open: <SquareIcon /> },
      }}
      headingLevel={3}
      source={t("notes.source")}
      {...props}
    />
  );
}
