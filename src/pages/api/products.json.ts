import { getCollection } from 'astro:content';

export async function GET() {
    const collection = await getCollection('products');
    const products = collection.map(({ data }) => data);

    return new Response(JSON.stringify(products), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}