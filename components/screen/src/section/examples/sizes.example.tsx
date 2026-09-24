import { type ReactElement } from "react";

import { PencilIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Section from "#section/index.ts";

const SECTIONS = [
  ["sm", "profile", "profileAbout"],
  ["md", "payment", "cards"],
  ["lg", "billing", "plan"],
] as const;

export function Sizes(): ReactElement {
  const { t } = useWords("section");

  return (
    <Stack gap="lg">
      {SECTIONS.map(([size, title, about]) => (
        <Section.Root key={size} size={size} variant="surface">
          <Section.Header>
            <Section.Title as="h3">{t(title)}</Section.Title>
            <Section.Description>{t(about)}</Section.Description>
            <Section.Actions>
              <ButtonPropsProvider value={{ size, variant: "subtle" }}>
                <Section.Action as={Button} priority="secondary">
                  <PencilIcon size="1em" />
                  <span>{t("edit")}</span>
                </Section.Action>
              </ButtonPropsProvider>
            </Section.Actions>
          </Section.Header>
          <Section.Body>
            <Text>{t("usage")}</Text>
          </Section.Body>
        </Section.Root>
      ))}
    </Stack>
  );
}
