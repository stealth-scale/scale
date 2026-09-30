import { type ReactElement } from "react";

import { DownloadIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";
import * as Section from "#section/index.ts";

const FACTS = ["plan", "seats", "next"] as const;

export function Sizes(props: Page.RootProps): ReactElement {
  const { t } = useWords("section");

  return (
    <Page.Root {...props}>
      <Page.Body>
        <Section.Root>
          <Section.Header>
            <Section.Title as="h3">{t("billing.title")}</Section.Title>
            <Section.Description>{t("billing.about")}</Section.Description>
            <Section.Actions>
              <Section.Action icon={<DownloadIcon size="1em" />}>
                {t("billing.download")}
              </Section.Action>
              <Section.Action primary>{t("billing.pay")}</Section.Action>
            </Section.Actions>
          </Section.Header>
          <Section.Body>
            <Stack direction="row" gap="2xl" wrap>
              {FACTS.map((fact) => (
                <Stack gap="xs" key={fact}>
                  <Text size="sm" tone="muted">
                    {t(`billing.facts.${fact}.label`)}
                  </Text>
                  <Text size="sm">{t(`billing.facts.${fact}.value`)}</Text>
                </Stack>
              ))}
            </Stack>
          </Section.Body>
        </Section.Root>
      </Page.Body>
    </Page.Root>
  );
}
