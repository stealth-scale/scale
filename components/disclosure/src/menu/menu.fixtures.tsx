/**
 * Renders the menus the part specifications test.
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
 * Renders a part inside a closed root.
 *
 * @param children - The part under test.
 * @returns The root.
 */
export function listed(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Renders a menu with a trigger, an arrow, four rows and a separator. The third row is disabled
 * and the fourth is critical.
 *
 * @param props - The root's props.
 * @returns The menu.
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
 * Renders a menu with a labelled radio group and a checked checkbox row.
 *
 * @param props - The root's props.
 * @returns The menu.
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
 * Renders a menu whose trigger takes a caller's click handler.
 *
 * @param onClick - The trigger's click handler.
 * @param props - The root's props.
 * @returns The menu.
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
 * Renders a menu that a context trigger opens.
 *
 * @param props - The root's props.
 * @returns The menu.
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
 * Renders a menu with one checked checkbox row that keeps the menu open on select.
 *
 * @param onCheckedChange - The row's change handler.
 * @param props - The root's props.
 * @returns The menu.
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
 * Renders a menu whose two rows keep it open on select.
 *
 * @param props - The root's props.
 * @returns The menu.
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
 * Renders a menu with a submenu between two rows.
 *
 * @param props - The outer root's props.
 * @returns The outer menu, with the submenu inside its content.
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
 * Renders an open menu with one row whose text reads Acme.
 *
 * @param children - The part under test, rendered before the text.
 * @returns The open menu.
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
