import { type ReactElement } from "react";

import { Video, type VideoProps } from "#video/index.ts";

import clip from "./clip.webm";
import poster from "./poster.webp";

export function Clip(props: VideoProps): ReactElement {
  return <Video poster={poster} preload="none" src={clip} {...props} />;
}
