declare const tags: unique symbol;
export type Brand<BaseType, BrandName extends string> = BaseType & {
  [tags]: { [K in BrandName]: never };
};

/**
 * Create a branded instance of the value
 * @param value
 * @example const newDonor = makeBrand<DonorUuid>("123e4567-e89b-12d3-a456-426614174000");
 */
export const makeBrand = <T>(value: unknown): T => value as T;
