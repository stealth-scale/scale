import { type ReactElement } from "react";

import { Grid, Stack } from "@stealthscale/component-layout";
import { Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Toc from "#toc/index.ts";

const SECTIONS: Toc.TocItem[] = [
  { depth: 2, value: "toc-first" },
  { depth: 2, value: "toc-second" },
  { depth: 2, value: "toc-third" },
];

const PARAGRAPHS = ["passage", "second", "third"] as const;

export function Article(props: Omit<Toc.RootProps, "items">): ReactElement {
  const { t } = useWords("toc");

  return (
    <Grid.Root columns="3" gap="xl">
      <Grid.Item span="2">
        <Stack gap="lg">
          {SECTIONS.map((item) => (
            <Stack gap="sm" key={item.value}>
              <Heading as="h3" id={item.value} size="md">
                {t(`headings.${item.value}`)}
              </Heading>
              {PARAGRAPHS.map((paragraph) => (
                <Text key={paragraph}>{t(paragraph)}</Text>
              ))}
            </Stack>
          ))}
        </Stack>
      </Grid.Item>
      <Grid.Item>
        <Toc.Root items={SECTIONS} placement="aside" rootMargin="0px" {...props}>
          <Toc.Title>{t("onThisPage")}</Toc.Title>
          <Toc.List>
            <Toc.Indicator />
            {SECTIONS.map((item) => (
              <Toc.Item item={item} key={item.value}>
                <Toc.Link href={`#${item.value}`} item={item}>
                  {t(`headings.${item.value}`)}
                </Toc.Link>
              </Toc.Item>
            ))}
          </Toc.List>
        </Toc.Root>
      </Grid.Item>
    </Grid.Root>
  );
}
