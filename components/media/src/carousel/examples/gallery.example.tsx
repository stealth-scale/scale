import { type ReactElement } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Carousel from "#carousel/index.ts";

import { PICTURES } from "./pictures.ts";

export function Gallery(props: Omit<Carousel.RootProps, "slideCount">): ReactElement {
  const { t } = useWords("carousel");

  return (
    <Carousel.Root
      allowMouseDrag
      aria-label={t("galleryLabel")}
      controls="overlay"
      loop
      slideCount={PICTURES.length}
      {...props}
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
          <ChevronLeftIcon />
        </Carousel.PrevTrigger>
        <Carousel.IndicatorGroup>
          <Carousel.Indicators label={(page) => t("goTo", { page })} />
        </Carousel.IndicatorGroup>
        <Carousel.NextTrigger label={t("next")}>
          <ChevronRightIcon />
        </Carousel.NextTrigger>
      </Carousel.Control>
    </Carousel.Root>
  );
}
