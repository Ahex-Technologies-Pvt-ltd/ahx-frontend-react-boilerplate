import React, { useMemo } from 'react';
import type { PaginationState } from './types';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';



export interface PaginationProps {
    pagination: PaginationState
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
    pageSizeOptions?: number[]
    maxPageButtons?: number
    hidePageSize?: boolean
    hideTotalCount?: boolean
    className?: string
}

function buildPageWindows(current: number, total: number, max: number): (number | '…')[] {
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

    const half = Math.floor((max - 3) / 2);
    const leftEdge = 1;
    const rightEdge = total;

    let start = Math.max(2, current - half);
    let end = Math.min(total - 1, current + half);

    if (current - half <= 2) {
        end = Math.min(total - 1, max - 2);
        start = 2;
    }
    if (current + half >= total - 1) {
        start = Math.max(2, total - max + 2);
        end = total - 1;
    }

    const pages: (number | '…')[] = [leftEdge];
    if (start > 2) pages.push('…');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push('…');
    pages.push(rightEdge);
    return pages;
}

const ChevronLeft = () => (
    <svg
        width={14}
        height={14}
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
    >
        <path d="M9 2L4 7l5 5" />
    </svg>
);
const ChevronRight = () => (
    <svg
        width={14}
        height={14}
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
    >
        <path d="M5 2l5 5-5 5" />
    </svg>
);
const ChevronsLeft = () => (
    <svg
        width={14}
        height={14}
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
    >
        <path d="M7 2L2 7l5 5M12 2L7 7l5 5" />
    </svg>
);
const ChevronsRight = () => (
    <svg
        width={14}
        height={14}
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
    >
        <path d="M7 2l5 5-5 5M2 2l5 5-5 5" />
    </svg>
);

const Pagination: React.FC<PaginationProps> = ({
    pagination,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50, 100],
    maxPageButtons = 5,
    hidePageSize = false,
    hideTotalCount = false,
    className,
}) => {
    const { page, pageSize, total } = pagination;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const [searchParams, setSearchParams] = useSearchParams();

    // Derived display values
    const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);

    const pages = useMemo(
        () => buildPageWindows(page, totalPages, maxPageButtons),
        [page, totalPages, maxPageButtons],
    );

    const go = (p: number) => {
        if (p < 1 || p > totalPages || p === page) return;

        const params = new URLSearchParams(searchParams);
        params.set('page', String(p));

        setSearchParams(params);

        onPageChange(p);
    };

    const pageButtonClass = (active: boolean, disabled: boolean) => {
        return cn(
            'min-w-[32px] h-8 px-2 inline-flex items-center justify-center rounded-md text-xs font-medium transition-all duration-100 outline-none',
            active
                ? 'border-2 border-primary bg-primary text-primary-foreground font-semibold'
                : disabled
                    ? 'border border-border bg-muted/20 text-muted-foreground cursor-not-allowed'
                    : 'border border-border bg-background text-foreground/70 hover:bg-muted/20 cursor-pointer',
        );
    };

    return (
        <div
            className={cn(
                'flex items-center justify-between flex-wrap gap-3 px-4 py-3 border-t border-border bg-background font-sans text-xs text-muted-foreground select-none',
                className,
            )}
        >
            {/* ── Left: total count + page-size selector ── */}
            <div className="flex items-center gap-2">
                {!hideTotalCount && (
                    <span>
                        {total === 0
                            ? 'No results'
                            : `Showing ${from}–${to} of ${total.toLocaleString()}`}
                    </span>
                )}

                {!hidePageSize && (
                    <label className={cn('flex items-center gap-1.5', !hideTotalCount && 'ml-4')}>
                        <span>Rows per page</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                const newSize = Number(e.target.value);

                                const params = new URLSearchParams(searchParams);
                                params.set('pageSize', String(newSize));
                                params.set('page', '1');

                                setSearchParams(params);

                                onPageSizeChange(newSize);
                            }}
                            className="h-8 px-2 border border-border rounded-md bg-background text-foreground text-xs cursor-pointer outline-none focus:ring-1 focus:ring-ring"
                            aria-label="Page size"
                        >
                            {pageSizeOptions.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
            </div>

            {/* ── Right: navigation controls ── */}
            <div className="flex items-center gap-1">
                {/* First */}
                <button
                    onClick={() => go(1)}
                    disabled={page <= 1}
                    className={pageButtonClass(false, page <= 1)}
                    aria-label="First page"
                    title="First page"
                >
                    <ChevronsLeft />
                </button>

                {/* Prev */}
                <button
                    onClick={() => go(page - 1)}
                    disabled={page <= 1}
                    className={pageButtonClass(false, page <= 1)}
                    aria-label="Previous page"
                    title="Previous page"
                >
                    <ChevronLeft />
                </button>

                {/* Page number buttons */}
                {pages.map((p, idx) =>
                    p === '…' ? (
                        <span
                            key={`ellipsis-${idx}`}
                            className="min-w-[32px] text-center text-muted-foreground/50 tracking-wide"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => go(p)}
                            disabled={p === page}
                            className={pageButtonClass(p === page, false)}
                            aria-label={`Page ${p}`}
                            aria-current={p === page ? 'page' : undefined}
                        >
                            {p}
                        </button>
                    ),
                )}

                {/* Next */}
                <button
                    onClick={() => go(page + 1)}
                    disabled={page >= totalPages}
                    className={pageButtonClass(false, page >= totalPages)}
                    aria-label="Next page"
                    title="Next page"
                >
                    <ChevronRight />
                </button>

                {/* Last */}
                <button
                    onClick={() => go(totalPages)}
                    disabled={page >= totalPages}
                    className={pageButtonClass(false, page >= totalPages)}
                    aria-label="Last page"
                    title="Last page"
                >
                    <ChevronsRight />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
