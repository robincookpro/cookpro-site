import type { ProductFilter } from "@ts/product.types";
import styles from "./SearchFilters.module.css";
import type { SearchStateOptions, SearchStateResolvable } from "../../hooks/useSearchParams";

type SearchFilterProps = {
    searchParams: URLSearchParams,
    onChange: (resolver: SearchStateResolvable, options?: SearchStateOptions) => void;
}

const createToggler = (onChange: SearchFilterProps['onChange']) => {
    return (field: string, value: string) => {
        onChange(prev => {
            const next = new URLSearchParams(prev);

            const values = next.getAll(field);

            if (values.includes(value)) {
                next.delete(field);
                values
                    .filter(v => v !== value)
                    .forEach(v => next.append(field, v));
            } else {
                next.append(field, value);
            }

            next.delete('page');
            next.set("page", "1");

            return next;
        }, { replace: true });
    };
};

export default function SearchFilters({ searchParams, onChange }: SearchFilterProps) {
    const groups: ProductFilter = {
        "brand": ["Cook Pro", "Excelsteel", "Clean Pro", "Hydrosteel", "Cooks On Fire"],
        "categories": ["Colanders", "Hydration", "Utensils", "Cleaning", "Cookware", "Gadgets", "Storage", "Organization", "Specialty Cookware"],
    }

    const clearFilters = () => {
        onChange(new URLSearchParams())
    }

    const toggleFilter = createToggler(onChange);

    return (
        <aside className={styles.filters}>
            <h2>Refine Results</h2>

            {Object.entries(groups).map(([group, options]) =>
                <div key={group}>
                    <h3>{group.toUpperCase()}</h3>
                    {options.map(option =>
                        <label key={option}>
                            <input
                                type="checkbox"
                                name={group}
                                value={option.toLowerCase().replace(/\s+/g, "-")} // is this necessary?
                                checked={searchParams.getAll(group.toLowerCase()).includes(option.toLowerCase())}
                                onChange={() => toggleFilter((group as keyof ProductFilter).toLowerCase(), option.toLowerCase())}
                            />
                            {option}
                        </label>
                    )}
                </div>
            )}
            <button onClick={clearFilters}>Clear All Filters</button>
        </aside>
    );
}