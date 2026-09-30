import { type ReactElement, useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Menu } from "@stealthscale/component-disclosure";
import { Stack } from "@stealthscale/component-layout";
import { Link } from "@stealthscale/component-navigation";
import { Portal } from "@stealthscale/component-primitives";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";

const SECTIONS = ["general", "members", "billing"] as const;

type Section = (typeof SECTIONS)[number];

export function Settings(props: Page.NavProps): ReactElement {
  const { t } = useWords("page");
  const [current, setCurrent] = useState<Section>("general");

  return (
    <Page.Root>
      <Page.Header>
        <Page.Title as="h3">{t("settings")}</Page.Title>
      </Page.Header>
      <Page.Nav aria-label={t("sections")} {...props}>
        <Page.When when="wide">
          <Stack direction="row" gap="xl">
            {SECTIONS.map((section) => (
              <Link
                aria-current={section === current ? "page" : undefined}
                href={`#${section}`}
                inherit={section !== current}
                key={section}
                onClick={() => {
                  setCurrent(section);
                }}
                variant="plain"
              >
                {t(section)}
              </Link>
            ))}
          </Stack>
        </Page.When>
        <Page.When when="narrow">
          <Menu.Root
            onSelect={({ value }) => {
              setCurrent(SECTIONS.find((section) => section === value) ?? current);
            }}
          >
            <Menu.Trigger as={Page.Picker}>
              {t(current)}
              <ChevronDownIcon size="1em" />
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content as={Page.Palette}>
                  {SECTIONS.map((section) => (
                    <Menu.Item key={section} value={section}>
                      {t(section)}
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Page.When>
      </Page.Nav>
      <Page.Body>
        <Text size="sm" tone="muted">
          {t(`${current}Body`)}
        </Text>
      </Page.Body>
    </Page.Root>
  );
}
