import { type ReactElement } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Card } from "@stealthscale/component-surfaces";
import { useWords } from "@stealthscale/specimen";

import * as Carousel from "#carousel/index.ts";

import { PICTURES } from "./pictures.ts";

export function Cards(): ReactElement {
  const { t } = useWords("carousel");

  return (
    <Carousel.Root
      aria-label={t("cardsLabel")}
      slideCount={PICTURES.length}
      slidesPerMove={1}
      slidesPerPage={2}
    >
      <Carousel.ItemGroup>
        {PICTURES.map((picture, index) => (
          <Carousel.Item
            aria-label={t("slide", { count: PICTURES.length, index: index + 1 })}
            index={index}
            key={picture.key}
          >
            <Card.Root>
              <Card.Media>
                <img alt="" src={picture.src} />
              </Card.Media>
              <Card.Header>
                <Card.Title>{t(`prints.${picture.key}`)}</Card.Title>
                <Card.Description>{t("price")}</Card.Description>
              </Card.Header>
              <Card.Footer>
                <Button size="sm" variant="subtle">
                  {t("add")}
                </Button>
              </Card.Footer>
            </Card.Root>
          </Carousel.Item>
        ))}
      </Carousel.ItemGroup>
      <Carousel.Control>
        <Carousel.PrevTrigger label={t("previous")}>
          <ChevronLeftIcon />
        </Carousel.PrevTrigger>
        <Carousel.NextTrigger label={t("next")}>
          <ChevronRightIcon />
        </Carousel.NextTrigger>
      </Carousel.Control>
    </Carousel.Root>
  );
}
