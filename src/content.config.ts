import { defineCollection } from 'astro:content';
import googleSheetsLoader from './data/google-product-loader';
import { loadEnv } from 'vite';

const { GOOGLE_SHEETS_ID } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), "");

if (!GOOGLE_SHEETS_ID) {
    throw new Error("Missing GOOGLE_SHEETS_ID environment variable in .env file.")
}

const sheetsCollection = defineCollection({
    loader: googleSheetsLoader({
        sheetId: GOOGLE_SHEETS_ID
    })
});

export const collections = {
    products: sheetsCollection,
};