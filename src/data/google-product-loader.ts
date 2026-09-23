import { Readable } from 'stream';
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'csv-parse';

type GoogleSheetsParams = {
    sheetId: string;
};

const ProductSchema = z.object({
    sku: z.string(),
    name: z.string(),
    description: z.string(),
    bullets: z.array(z.string()),
    brand: z.string().toLowerCase(),
    imageUrl: z.tuple([z.url()]).rest(z.url()),
    composition: z.string(),
    categories: z.array(z.string().toLowerCase()),
    "primary variant": z.string(),
})

export type Product = z.infer<typeof ProductSchema>
type RawCsvRow = {
    [K in keyof Product]: string;
}

function googleSheetsLoader({ sheetId }: GoogleSheetsParams) {
    return {
        name: "google-products-loader",
        load: async ({ store, parseData }) => {
            const response = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`)

            if (!response.body) {
                throw new Error('Failed to get read stream from response')
            }

            store.clear();

            const nodeStream = Readable.fromWeb(response.body as any)
                .pipe(parse({
                    columns: true,
                    on_record: (record: RawCsvRow): Product => {
                        const mappedRecord = {
                            ...record,
                            bullets: (record.bullets ?? '')
                                .split('\n')
                                .map(item => item.trim())
                                .filter(Boolean),
                            imageUrl: (record.imageUrl ?? '')
                                .split(';')
                                .map(item => item.trim())
                                .filter(Boolean),
                            categories: (record.categories ?? '')
                                .split('&')
                                .map(item => item.trim())
                                .filter(Boolean),
                        }

                        return mappedRecord as Product;
                    }
                }));

            for await (const product of nodeStream) {
                try {
                    const parsed = await parseData({
                        id: product.sku,
                        data: product,
                    });

                    store.set({
                        id: parsed.sku,
                        data: parsed,
                    })

                    // console.log(`${parsed.sku} added to the collection`)
                } catch (err) {
                    if (err instanceof Error) {
                        console.error(`Failed to add ${product.sku} to the collection:\n${err.message}`);
                    } else {
                        console.error("An unexpected error occurred", err);
                    }
                }
            }
        },
        schema: ProductSchema
    } satisfies Loader;
}

export default googleSheetsLoader;