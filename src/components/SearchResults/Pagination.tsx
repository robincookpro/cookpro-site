import styles from "./Pagination.module.css";

type PaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    const numButtons = Math.min(totalPages, 7);
    const half = Math.floor(numButtons / 2);
    const start = Math.min(Math.max(page - half, 1), totalPages - numButtons + 1);

    return (
        <div className={styles.pagination}>
            <div>
                <button onClick={() => onPageChange(1)}>«</button>
                <button onClick={() => onPageChange(Math.max(1, page - 1))}>‹</button>
                {
                    Array.from({ length: numButtons }, (_, i) => start + i)
                        .map(i => (
                            <button
                                key={i}
                                onClick={() => onPageChange(i)}
                                className={i == page ? styles.selected : ''}
                            >
                                {i}
                            </button>)

                        )
                }
                <button onClick={() => onPageChange(Math.min(totalPages, page + 1))}>›</button>
                <button onClick={() => onPageChange(totalPages)}>»</button>
            </div >
        </div >
    )
}