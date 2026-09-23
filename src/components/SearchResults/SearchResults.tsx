import { useEffect, useState } from "react";
import SearchFilters from "./SearchFilters";
import { filterProducts } from "../../data/product-utils";
import type { Product } from "@ts/product.types";
import ResultsGrid from "./ResultsGrid";
import styles from "./SearchResults.module.css";
import { useSearchParams } from "../../hooks/useSearchParams";

export default function SearchResults() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const keys = ["brand", "categories"] as const;

  const filters = keys.reduce(
    (acc, key) => {
      acc[key] = searchParams.getAll(key);
      return acc;
    },
    {} as Record<(typeof keys)[number], string[]>
  );

  const filteredProducts = filterProducts(products, filters);

  const page = Number(searchParams.get('page') ?? '1');

  useEffect(() => {
    fetch('/api/products.json')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className={styles.searchResults}>
      <SearchFilters searchParams={searchParams} onChange={setSearchParams} />
      <ResultsGrid products={filteredProducts} page={page} setPage={
        (selectedPage) => setSearchParams((prev) => {
          const next = new URLSearchParams(prev)
          next.set('page', String(selectedPage))
          return next;
        })
      } />
    </div>
  )
}