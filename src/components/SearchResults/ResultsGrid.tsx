import Card from "@components/Card/Card";
import type { Product } from "@ts/product.types";
import styles from "./ResultsGrid.module.css";
import { type Dispatch, type SetStateAction } from "react";
import Pagination from "./Pagination";

type ResultsGridProps = {
    products: Product[];
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
}

export default function ResultsGrid({ products, page, setPage }: ResultsGridProps) {
    const pageSize = 15;

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, products.length);

    const totalPages = Math.ceil(products.length / pageSize);

    return (
        <div className={styles.results}>
            <div className={styles.heading}>
                <h1>Results</h1>
                <span>Sort by:</span>
                <select>
                    <option>Featured</option>
                    <option>New Arrivals</option>
                    <option>Most viewed</option>
                </select>
            </div>
            {products.length == 0 ?
                <div>
                    <h3>No results found</h3>
                    <p>Please try again</p>
                </div>
                :
                <>
                    <p>Showing {start} to {end} of {products.length} products</p>
                    <div className={styles.productGrid}>
                        {
                            products.slice(start - 1, end).map(product => (
                                <a href={`/products/${product.sku}`} key={product.sku}>
                                    <Card thumbnail={product.imageUrl[0]} title={product.name} sku={product.sku} />
                                </a>
                            ))
                        }
                    </div>
                    <div className={styles.pagination}>
                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                </>
            }
        </div>
    )
}