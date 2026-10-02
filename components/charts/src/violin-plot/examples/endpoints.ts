/**
 * Lists the response times in milliseconds of 50 requests to each of three endpoints of a shop's
 * API, which the violin plot's examples share: search responds from a cache or from its index, and
 * checkout and profile have one peak each.
 */

/**
 * Lists the search endpoint's response times: 30 cache hits near 22ms and 20 index reads near
 * 167ms.
 */
export const SEARCH = [
  20, 21, 22, 23, 18, 19, 25, 16, 22, 19, 16, 23, 22, 21, 27, 19, 19, 24, 25, 16, 21, 20, 20, 24,
  19, 25, 26, 28, 12, 24, 138, 147, 135, 170, 170, 201, 148, 207, 156, 174, 181, 229, 174, 177, 159,
  160, 159, 212, 202, 157,
];

/**
 * Lists the checkout endpoint's response times.
 */
export const CHECKOUT = [
  96, 89, 89, 80, 70, 62, 87, 107, 91, 100, 73, 72, 119, 115, 93, 87, 77, 79, 68, 102, 89, 84, 103,
  96, 64, 69, 89, 72, 85, 104, 72, 85, 98, 92, 98, 79, 107, 94, 100, 101, 86, 112, 92, 94, 104, 76,
  85, 97, 78, 80,
];

/**
 * Lists the profile endpoint's response times.
 */
export const PROFILE = [
  68, 108, 52, 30, 57, 41, 79, 123, 91, 41, 40, 74, 57, 73, 49, 36, 77, 41, 44, 77, 115, 40, 65,
  121, 55, 61, 66, 55, 67, 113, 71, 90, 69, 96, 92, 78, 67, 112, 42, 37, 53, 75, 61, 91, 38, 55, 39,
  103, 31, 119,
];
