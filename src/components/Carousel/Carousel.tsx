import Card from "@components/Card/Card";
import type { Product } from "@ts/product.types";
import styles from "./Carousel.module.css";
import { useId } from "react";

type CarouselProps = {
    products: Product[];
    numToDisplay?: number;
};

export default function Carousel({ products, numToDisplay = 5 }: CarouselProps) {
    const id = useId();

    const numEmptyItems = (numToDisplay - products.length % numToDisplay) % numToDisplay;

    return <ol style={{ '--carousel-anchor': `--carousel-${id}` } as React.CSSProperties} className={styles.carousel} >
        {
            products.map(product => (
                <li key={product.sku} data-accname={product.sku} className={styles.carouselItem}>
                    <a href={`/products/${product.sku}`}>
                        <Card thumbnail={product.imageUrl[0]} title={product.name} sku={product.sku} />
                    </a>
                </li>
            ))
        }
        {
            Array.from({ length: numEmptyItems }).map((_, index) => (
                <li
                    key={`empty-${index}`}
                    aria-hidden="true"
                    className={styles.carouselItem}
                />
            ))
        }
    </ol >

}