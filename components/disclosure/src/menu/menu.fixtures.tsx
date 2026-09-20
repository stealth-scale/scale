/**
 * Builds the menu a part's specification needs above it, every part reading one machine.
 */

import { type ReactElement, type ReactNode } from "react";

import {
  Arrow,
  ArrowTip,
  Content,
  ContextTrigger,
  Indicator,
  Item,
  ItemGroup,
  ItemGroupLabel,
  ItemIndicator,
  ItemText,
  OptionItem,
  Positioner,
  Root,
  type RootProps,
  Separator,
  Trigger,
  TriggerItem,
} from "#menu/index.ts";

/**
 * Draws whatever a case wants measured inside the root that runs the machine.
 *
 * @param children - The part under test.
 * @returns The root, holding it.
 */
export function listed(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Draws a whole menu, so a case can press the control and read what the panel does.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The parts composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger>
        Actions
        <Indicator>v</Indicator>
      </Trigger>
      <Positioner>
        <Content>
          <Arrow>
            <ArrowTip />
          </Arrow>
          <Item value="rename">Rename</Item>
          <Item value="duplicate">Duplicate</Item>
          <Item disabled value="archive">
            Archive
          </Item>
          <Separator />
          <Item tone="critical" value="delete">
            Delete
          </Item>
        </Content>
      </Positioner>
    </Root>
  );
}

/**
 * Draws a menu whose rows are grouped and carry choices, so a case can read a mark and a heading.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The parts composed the way a caller composes them.
 */
export function grouped(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger>View</Trigger>
      <Positioner>
        <Content>
          <ItemGroupLabel value="density">Density</ItemGroupLabel>
          <ItemGroup value="density">
            <OptionItem checked type="radio" value="comfortable">
              <ItemIndicator>*</ItemIndicator>
              <ItemText>Comfortable</ItemText>
            </OptionItem>
            <OptionItem checked={false} type="radio" value="compact">
              <ItemIndicator>*</ItemIndicator>
              <ItemText>Compact</ItemText>
            </OptionItem>
          </ItemGroup>
          <Separator />
          <OptionItem checked type="checkbox" value="gridlines">
            <ItemIndicator>*</ItemIndicator>
            <ItemText>Gridlines</ItemText>
          </OptionItem>
        </Content>
      </Positioner>
    </Root>
  );
}

/**
 * Draws a whole menu whose control carries a handler of the caller's own.
 *
 * @param onClick - Told each time the control is pressed.
 * @param props - Whatever the case sets on the root.
 * @returns The parts composed the way a caller composes them.
 */
export function handled(onClick: () => void, props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger onClick={onClick}>Actions</Trigger>
      <Positioner>
        <Content>
          <Item value="rename">Rename</Item>
        </Content>
      </Positioner>
    </Root>
  );
}

/**
 * Draws a menu opened by a right-click over a region rather than by a control.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The parts composed the way a caller composes them.
 */
export function righted(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <ContextTrigger>The row a reader right-clicks</ContextTrigger>
      <Positioner>
        <Content>
          <Item value="open">Open</Item>
          <Item value="rename">Rename</Item>
        </Content>
      </Positioner>
    </Root>
  );
}

/**
 * Draws a menu holding one row that carries a choice, so a case can turn it off and read what the
 * machine reports.
 *
 * @param onCheckedChange - Told each time the reader turns the row on or off.
 * @param props - Whatever the case sets on the root.
 * @returns The parts composed the way a caller composes them.
 */
export function optioned(
  onCheckedChange: (checked: boolean) => void,
  props: RootProps = {},
): ReactElement {
  return (
    <Root {...props}>
      <Trigger>View</Trigger>
      <Positioner>
        <Content>
          <OptionItem
            checked
            closeOnSelect={false}
            onCheckedChange={onCheckedChange}
            type="checkbox"
            value="gridlines"
          >
            <ItemIndicator>*</ItemIndicator>
            <ItemText>Gridlines</ItemText>
          </OptionItem>
        </Content>
      </Positioner>
    </Root>
  );
}

/**
 * Draws a menu whose rows stay open when chosen, so a case can read what a row that keeps the menu
 * up does.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The parts composed the way a caller composes them.
 */
export function kept(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger>Format</Trigger>
      <Positioner>
        <Content>
          <Item closeOnSelect={false} value="bold">
            Bold
          </Item>
          <Item closeOnSelect={false} value="italic">
            Italic
          </Item>
        </Content>
      </Positioner>
    </Root>
  );
}

/**
 * Draws a menu holding a submenu, so a case can read what the nest does.
 *
 * @param props - Whatever the case sets on the outermost root.
 * @returns The two menus, the inner one written inside the panel of the outer.
 */
export function nested(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger>File</Trigger>
      <Positioner>
        <Content>
          <Item value="new">New</Item>
          <Root>
            <TriggerItem>Share</TriggerItem>
            <Positioner>
              <Content>
                <Item value="email">Email</Item>
                <Item value="link">Copy link</Item>
              </Content>
            </Positioner>
          </Root>
          <Item value="print">Print</Item>
        </Content>
      </Positioner>
    </Root>
  );
}

/**
 * Draws an open menu holding one row named Acme, with whatever a case puts beside the words.
 *
 * @param children - The part under test, drawn in the row before the words.
 * @returns The menu, open, holding the row.
 */
export function rowed(children: ReactNode): ReactElement {
  return (
    <Root defaultOpen>
      <Trigger>Workspace</Trigger>
      <Positioner>
        <Content>
          <Item value="acme">
            {children}
            <ItemText>Acme</ItemText>
          </Item>
        </Content>
      </Positioner>
    </Root>
  );
}
