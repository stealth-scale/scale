import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Blockquote from "#blockquote/index.ts";

export function Testimonial(props: Blockquote.RootProps): ReactElement {
  const { t } = useWords("blockquote");

  return (
    <Blockquote.Root {...props}>
      <Blockquote.Icon />
      <Blockquote.Content>{t("quotation")}</Blockquote.Content>
      <Blockquote.Caption>{t("author")}</Blockquote.Caption>
    </Blockquote.Root>
  );
}
