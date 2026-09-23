import type { Product } from "../data/google-product-loader";

type ProductFilter = Pick<Record<keyof Product, string[]>, "brand" | "categories">;

export type { Product, ProductFilter };