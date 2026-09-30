import { type ReactElement } from "react";

import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Carousel from "#carousel/index.ts";

import { PICTURES } from "./pictures.ts";

export function Rotation(): ReactElement {
  const { t } = useWords("carousel");

  return (
    <Carousel.Root
      aria-label={t("rotationLabel")}
      autoplay={{ delay: 5000 }}
      ratio="wide"
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
        <Carousel.AutoplayTrigger startLabel={t("start")} stopLabel={t("stop")}>
          <Carousel.AutoplayIndicator pause={<PauseIcon />} play={<PlayIcon />} />
        </Carousel.AutoplayTrigger>
        <Carousel.PrevTrigger label={t("previous")}>
          <ChevronLeftIcon />
        </Carousel.PrevTrigger>
        <Carousel.IndicatorGroup>
          <Carousel.Indicators label={(page) => t("goTo", { page })} />
        </Carousel.IndicatorGroup>
        <Carousel.NextTrigger label={t("next")}>
          <ChevronRightIcon />
        </Carousel.NextTrigger>
        <Carousel.ProgressText text={(details) => t("progress", { ...details })} />
      </Carousel.Control>
    </Carousel.Root>
  );
}
