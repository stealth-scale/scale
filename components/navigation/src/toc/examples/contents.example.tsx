import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Toc from "#toc/index.ts";

const HEADINGS: Toc.TocItem[] = [
  { depth: 2, value: "toc-overview" },
  { depth: 2, value: "toc-install" },
  { depth: 3, value: "toc-peers" },
  { depth: 2, value: "toc-usage" },
];

export function Contents(props: Omit<Toc.RootProps, "items">): ReactElement {
  const { t } = useWords("toc");

  return (
    <Toc.Root items={HEADINGS} {...props}>
      <Toc.Title>{t("onThisPage")}</Toc.Title>
      <Toc.List>
        <Toc.Indicator />
        {HEADINGS.map((item) => (
          <Toc.Item item={item} key={item.value}>
            <Toc.Link href={`#${item.value}`} item={item}>
              {t(`headings.${item.value}`)}
            </Toc.Link>
          </Toc.Item>
        ))}
      </Toc.List>
    </Toc.Root>
  );
}
