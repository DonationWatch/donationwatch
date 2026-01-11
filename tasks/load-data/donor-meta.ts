/**
 * @deprecated
 *
 * This file is deprecated. Donor meta is now defined directly in each country loader
 * at `tasks/load-data/{countryCode}/donor-meta.ts` and exposed via the abstract
 * `donorMeta` property on the DataLoader base class.
 *
 * To access donor meta for a specific country:
 * - Use the loader's `donorMeta` property: `loaders[countryCode].donorMeta`
 * - Or dynamically import from: `tasks/load-data/{countryCode}/donor-meta.ts`
 *
 * This file is kept for backwards compatibility but should not be used for new code.
 */

export { }
