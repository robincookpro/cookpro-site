import { getCollection } from "astro:content";

export async function GET() {
    const collection = await getCollection("products");

    const index = await Promise.all(
        collection.map(async (product) => {
            return {
                "slug": `/products/${product.id}`,
                sku: product.data.sku,
                title: product.data.name,
                body: product.data.description,
            }
        })
    );

    return new Response(JSON.stringify(index));
}