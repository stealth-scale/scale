/**
 * Lists the orders of the data table's pivot examples in the order they were placed: each
 * quarter's orders by product, then by region, each with its value in euros. The west region sells
 * no docks, and the south region sold no monitors in the second quarter.
 */

/**
 * Describes the key of a region, the word its name is written under.
 */
export type Region = "north" | "south" | "west";

/**
 * Describes the key of a product, the word its name is written under.
 */
export type Product = "docks" | "laptops" | "monitors";

/**
 * Describes the key of a quarter, the word its name is written under.
 */
export type Quarter = "q1" | "q2" | "q3" | "q4";

/**
 * Describes one order.
 */
export interface Sale {
  /**
   * Key of the product ordered.
   */
  readonly product: Product;

  /**
   * Key of the quarter the order was placed in.
   */
  readonly quarter: Quarter;

  /**
   * Key of the region the order came from.
   */
  readonly region: Region;

  /**
   * Value of the order, in euros.
   */
  readonly value: number;
}

/**
 * Lists the quarters in their order.
 */
const QUARTERS: readonly Quarter[] = ["q1", "q2", "q3", "q4"];

/**
 * Lists the products in the order the orders list them.
 */
const PRODUCTS: readonly Product[] = ["laptops", "monitors", "docks"];

/**
 * Lists the regions in the order the orders list them.
 */
const REGIONS: readonly Region[] = ["north", "south", "west"];

/**
 * Lists each product's price in euros.
 */
const PRICES: Readonly<Record<Product, number>> = { docks: 240, laptops: 1450, monitors: 380 };

/**
 * Returns whether a region sold a product in a quarter.
 */
function sold(region: Region, product: Product, quarter: Quarter): boolean {
  if (region === "west" && product === "docks") return false;

  return !(region === "south" && product === "monitors" && quarter === "q2");
}

/**
 * Lists the year's orders: one to three for each region, product and quarter that sold, each of
 * one to four units.
 */
export const SALES: readonly Sale[] = QUARTERS.flatMap((quarter, q) =>
  PRODUCTS.flatMap((product, p) =>
    REGIONS.flatMap((region, r) =>
      sold(region, product, quarter)
        ? Array.from({ length: 1 + ((q + p + r) % 3) }, (_, n) => ({
            product,
            quarter,
            region,
            value: PRICES[product] * (1 + ((q + p + r + n) % 4)),
          }))
        : [],
    ),
  ),
);
