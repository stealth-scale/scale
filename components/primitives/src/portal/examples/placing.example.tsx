import { type ReactElement, useState } from "react";

import { Button } from "@stealthscale/component-actions";
import { Grid, Group, Stack } from "@stealthscale/component-layout";
import { Card } from "@stealthscale/component-surfaces";
import { useWords } from "@stealthscale/specimen";

import { Portal } from "#portal/index.ts";

const PLACES = ["here", "first", "second"] as const;

export function Placing(): ReactElement {
  const { t } = useWords("portal");
  const [first, setFirst] = useState<HTMLDivElement | null>(null);
  const [second, setSecond] = useState<HTMLDivElement | null>(null);
  const [place, setPlace] = useState<(typeof PLACES)[number]>("first");

  return (
    <Stack gap="md">
      <Group aria-label={t("place")} as="fieldset" attached>
        {PLACES.map((choice) => (
          <Button
            aria-pressed={choice === place}
            key={choice}
            onClick={() => {
              setPlace(choice);
            }}
            size="sm"
            variant="outline"
          >
            {t(`places.${choice}`)}
          </Button>
        ))}
      </Group>
      <Grid.Root columns="2">
        <Card.Root size="sm" variant="outline">
          <Card.Header>
            <Card.Title>{t("panels.first")}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div ref={setFirst} />
          </Card.Content>
        </Card.Root>
        <Card.Root size="sm" variant="outline">
          <Card.Header>
            <Card.Title>{t("panels.second")}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div ref={setSecond} />
          </Card.Content>
        </Card.Root>
      </Grid.Root>
      <Portal container={place === "second" ? second : first} disabled={place === "here"}>
        <Card.Root size="sm" variant="subtle">
          <Card.Content>{t("tile")}</Card.Content>
        </Card.Root>
      </Portal>
    </Stack>
  );
}
