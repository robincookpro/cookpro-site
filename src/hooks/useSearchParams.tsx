import { useCallback, useEffect, useState } from "react"

export type SearchStateResolvable =
    | ((prev: URLSearchParams) => URLSearchParams)
    | URLSearchParams
    | Record<string, string>;

export type SearchStateOptions = {
    replace: boolean
}

export function useSearchParams() {
    const [searchParams, setSearchParams] = useState(
        () => new URLSearchParams()
    );

    const setParams = useCallback((
        resolver: SearchStateResolvable,
        options: SearchStateOptions = { replace: false }
    ) => {
        setSearchParams(prev => {
            let next;

            if (typeof resolver === 'function') {
                next = resolver(new URLSearchParams(prev));
            } else if (resolver instanceof URLSearchParams) {
                next = resolver;
            } else {
                next = new URLSearchParams(resolver);
            }

            const searchString = next.toString();
            const nextSearch = searchString ? `?${searchString}` : '';
            const nextUrl = window.location.pathname + nextSearch + window.location.hash;

            if (options.replace) {
                window.history.replaceState(null, '', nextUrl);
            } else {
                window.history.pushState(null, '', nextUrl);
            }

            return next;
        })
    }, []);

    useEffect(() => {
        setSearchParams(new URLSearchParams(window.location.search))

        const handlePopState = () => {
            setSearchParams(new URLSearchParams(window.location.search));
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    return [searchParams, setParams] as const;
}