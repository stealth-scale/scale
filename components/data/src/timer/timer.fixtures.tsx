/**
 * Fixtures for the timer specs: a timer with its minutes and seconds and a trigger for every
 * action.
 */

import { type ReactElement } from "react";

import { ActionTrigger } from "#timer/action-trigger.tsx";
import { Area, type AreaProps } from "#timer/area.tsx";
import { Control } from "#timer/control.tsx";
import { Item } from "#timer/item.tsx";
import { Root, type RootProps } from "#timer/root.tsx";
import { Separator } from "#timer/separator.tsx";

/**
 * Renders a timer with the props the case sets on the root and the area: the minutes and the
 * seconds, and a trigger named after each action.
 *
 * @param props - The props the case sets on the root.
 * @param area - The props the case sets on the area.
 * @returns The timer.
 */
export function composed(props: RootProps = {}, area: AreaProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Area {...area}>
        <Item type="minutes" />
        <Separator>:</Separator>
        <Item type="seconds" />
      </Area>
      <Control>
        <ActionTrigger action="start">Start</ActionTrigger>
        <ActionTrigger action="pause">Pause</ActionTrigger>
        <ActionTrigger action="resume">Resume</ActionTrigger>
        <ActionTrigger action="reset">Reset</ActionTrigger>
        <ActionTrigger action="restart">Restart</ActionTrigger>
      </Control>
    </Root>
  );
}
