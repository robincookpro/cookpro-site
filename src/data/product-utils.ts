import type { Product, ProductFilter } from "@ts/product.types";

export function filterProducts(
    products: Product[],
    criteria: ProductFilter,
): Product[] {
    const filteredProducts = products.filter((product) => {
        for (const [field, selections] of Object.entries(criteria) as Array<
            [keyof Product, Product[keyof Product]]
        >) {
            if (selections.length == 0) continue;
            const productData = ([] as string[]).concat(product[field]);
            const matchesCriterion =
                new Set(productData).intersection(new Set(selections)).size >
                0;
            if (!matchesCriterion) {
                return false;
            }
        }
        return true;
    });
    return filteredProducts;
}