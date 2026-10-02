import {
  args,
  command,
  defineContract,
  defineQuery,
  extension,
  hostContract,
  props,
  query,
  returns,
  route,
  settingsPage,
  settingsSection,
  slot,
} from "@stealthscale/sdk-core";

export const STOCK = defineQuery<{ readonly count: number }, object>("shop~1~stock");

export const shopContract = defineContract("shop", (self) => ({
  commands: {
    checkout: command({
      ...returns<string>(),
      label: "commands.checkout",
      when: { authenticated: false },
    }),
    decline: command({ label: "commands.decline" }),
    refund: command({
      ...args<{ readonly orderId: string }>(),
      ...returns<string>(),
      label: "commands.refund",
      sample: { orderId: "o1" },
    }),
  },
  extensions: {
    badge: extension({ position: "after", target: hostContract.slots.status }),
    banner: extension({ position: "after", target: self.slot("aisle") }),
    broken: extension({ position: "after", target: self.slot("unused") }),
    linked: extension({ position: "before", target: self.route("cart") }),
    wrapper: extension({ position: "wrap", target: self.extension("banner") }),
  },
  queries: { stock: query({ operation: STOCK, sample: { data: { count: 3 }, variables: {} } }) },
  routes: {
    blind: route({ path: "blind" }),
    cart: route({ navigation: { label: "navigation.cart" }, path: "cart" }),
    crash: route({ path: "crash" }),
    hidden: route({ path: "hidden", when: { authenticated: false } }),
    stock: route({ data: [{ query: self.query("stock") }], path: "stock" }),
  },
  settings: {
    pages: { shop: settingsPage({ label: "settings.title" }) },
    sections: {
      display: settingsSection({
        label: "settings.display",
        schema: {
          additionalProperties: false,
          properties: { size: { default: "md", enum: ["sm", "md"], type: "string" } },
          type: "object",
        },
        target: self.settingsPage("shop"),
      }),
      notice: settingsSection({ label: "settings.notice", target: self.settingsPage("shop") }),
    },
  },
  slots: {
    aisle: slot({ ...props<{ readonly aisle: string }>(), sample: { aisle: "fruit" } }),
    unused: slot(),
  },
  version: "1.0.0",
}));
