import { Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./SearchBar.module.css";
import MiniSearch from "minisearch";
import type { Product } from "@ts/product.types";

type Document = {
  slug: `/${Product['sku']}`;
  sku: Product["sku"];
  title: Product["name"];
  body: Product["description"];
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Omit<Document, "sku">[]>([]);

  const dropdownId = useId();
  const searchbarRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const miniSearch = useMemo(() => {
    const searchEngine = new MiniSearch<Document>({
      fields: ['sku', 'title', 'body'],  // search indices
      idField: 'slug',
      storeFields: ['slug', 'title', 'body'], // returned fields of results
      searchOptions: {
        prefix: true,
        boost: {
          title: 3,
          body: 2,
          sku: 10,
        },
        fuzzy: true
      }
    });
    return searchEngine;
  }, []);

  useEffect(() => {
    fetch('/api/search-index.json')
      .then(res => res.json())
      .then(data => miniSearch.addAll(data))
  }, []);

  useEffect(() => {
    const MIN_QUERY_LENGTH = 3;
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setSearchResults([])
      return;
    }

    const timer = setTimeout(() => {
      const results = miniSearch.search(query.trim()).map((result) => {
        const { slug, title, body } = result;
        return { slug, title, body };
      });
      setSearchResults(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (searchResults.length > 0) {
      resultsRef.current?.showPopover();
    } else {
      resultsRef.current?.hidePopover();
    }
  }, [searchResults])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (searchbarRef.current?.contains(target) && searchResults.length > 0) {
        resultsRef.current?.showPopover();
        return;
      }
      if (!searchbarRef.current?.contains(target) && !resultsRef.current?.contains(target)) {
        resultsRef.current?.hidePopover();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [searchResults]);

  return (
    <>
      <div ref={searchbarRef} className={styles.searchBar}>
        <input
          type="search"
          placeholder="Search for products, categories..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button popoverTarget={dropdownId}>
          <Search />
        </button>
      </div>

      <div className={styles.dropdown} ref={resultsRef} id={dropdownId} popover="manual">
        {searchResults.length == 0 ?
          <>
            <h4>No results found</h4>
            <p>Try a different search term or check your spelling</p>
          </>
          :
          <>
            <div className={styles.resultsHeader}>
              <h4>Product Suggestions</h4>
              <span>{searchResults.length} results</span>
            </div>
            <ol className={styles.results} >
              {searchResults.map(result => (
                <li key={result.slug}>
                  <a href={result.slug} >
                    <span>{result.title}</span>
                  </a >
                </li >
              ))}
            </ol>
            <div className={styles.viewAll}>
              <p>View all results for "{query}"</p>
            </div>
          </>
        }
      </div>
    </>
  );
}