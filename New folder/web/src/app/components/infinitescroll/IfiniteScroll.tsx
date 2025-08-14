import React, { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
    children: React.ReactNode;
    loader: React.ReactNode;
    fetchMore: () => void;
    hasMore: boolean;
    endMessage: React.ReactNode;
    className?: string;
    root?: Element | null;
    rootMargin?: string;
    threshold?: number;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
    children,
    loader,
    fetchMore,
    hasMore,
    endMessage,
    className = '',
    root = null,
    rootMargin = '100px',
    threshold = 0.1,
}) => {
    const observer = useRef<IntersectionObserver | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!loaderRef.current) return;

        if (observer.current) observer.current.disconnect();

        if (hasMore) {
            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        fetchMore();
                    }
                },
                { root, rootMargin, threshold }
            );
            observer.current.observe(loaderRef.current);
        }

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [fetchMore, hasMore, root, rootMargin, threshold, loaderRef]);

    return (
        <div className={className}>
            {children}
            <div ref={loaderRef}>
                {hasMore ? loader : endMessage}
            </div>
        </div>
    );
};

export default InfiniteScroll;
