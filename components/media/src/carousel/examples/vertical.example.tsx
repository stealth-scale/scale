import { type ReactElement } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Carousel from "#carousel/index.ts";

import { PICTURES } from "./pictures.ts";

export function Vertical(): ReactElement {
  const { t } = useWords("carousel");

  return (
    <Carousel.Root
      aria-label={t("verticalLabel")}
      orientation="vertical"
      slideCount={PICTURES.length}
    >
      <Carousel.ItemGroup>
        {PICTURES.map((picture, index) => (
          <Carousel.Item
            aria-label={t("slide", { count: PICTURES.length, index: index + 1 })}
            index={index}
            key={picture.key}
          >
            <img alt={t(`pictures.${picture.key}`)} src={picture.src} />
          </Carousel.Item>
        ))}
      </Carousel.ItemGroup>
      <Carousel.Control>
        <Carousel.PrevTrigger label={t("previous")}>
          <ChevronUpIcon />
        </Carousel.PrevTrigger>
        <Carousel.IndicatorGroup>
          <Carousel.Indicators label={(page) => t("goTo", { page })} />
        </Carousel.IndicatorGroup>
        <Carousel.NextTrigger label={t("next")}>
          <ChevronDownIcon />
        </Carousel.NextTrigger>
      </Carousel.Control>
    </Carousel.Root>
  );
}
