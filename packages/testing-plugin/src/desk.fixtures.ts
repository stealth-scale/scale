import { defineContract, extension, hostContract, route } from "@stealthscale/sdk-core";

export const deskContract = defineContract("desk", () => ({
  extensions: {
    note: extension({
      position: "after",
      required: true,
      target: hostContract.slots.status,
      when: { authenticated: false },
    }),
    pin: extension({ position: "after", required: true, target: hostContract.slots.status }),
  },
  routes: { board: route({ navigation: { label: "navigation.board" }, path: "board" }) },
  version: "1.0.0",
}));

export const memoContract = defineContract("memo", () => ({
  extensions: {
    tag: extension({ position: "after", required: true, target: hostContract.slots.status }),
  },
  version: "1.0.0",
}));
