import { type ReactElement, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Accordion from "#accordion/index.ts";

const STEPS = ["shipping", "payment", "review"] as const;

export function Checkout(): ReactElement {
  const { t } = useWords("accordion");
  const [open, setOpen] = useState<string[]>(["shipping"]);
  const [reached, setReached] = useState(0);
  const [placed, setPlaced] = useState(false);
  const triggers = useRef<Partial<Record<string, HTMLButtonElement | null>>>({});

  return (
    <Accordion.Root
      onValueChange={(details) => {
        setOpen(details.value);
      }}
      value={open}
      variant="outline"
    >
      {STEPS.map((step, at) => (
        <Accordion.Item disabled={at > reached} key={step} value={step}>
          <Accordion.ItemHeading>
            <Accordion.ItemTrigger
              ref={(node) => {
                triggers.current[step] = node;
              }}
            >
              {t(`checkout.${step}.title`)}
              <Accordion.ItemIndicator>
                <ChevronDownIcon size="100%" />
              </Accordion.ItemIndicator>
            </Accordion.ItemTrigger>
          </Accordion.ItemHeading>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Stack align="flex-start" gap="md">
                <Text>{t(`checkout.${step}.summary`)}</Text>
                <Button
                  onClick={() => {
                    const next = STEPS[at + 1];

                    if (next === undefined) {
                      setPlaced(true);
                      return;
                    }
                    flushSync(() => {
                      setReached(Math.max(reached, at + 1));
                      setOpen([next]);
                    });
                    triggers.current[next]?.focus();
                  }}
                  size="sm"
                >
                  {t(`checkout.${step}.next`)}
                </Button>
                {step === "review" ? (
                  <Text as="output">{placed ? t("checkout.placed") : null}</Text>
                ) : null}
              </Stack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
