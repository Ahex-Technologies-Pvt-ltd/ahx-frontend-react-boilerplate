import React, { useCallback, useEffect } from 'react';
import type { TableProps, SortDirection } from './types';
import Pagination from './Pagination';
import { Table as UITable, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui';
import { cn } from '@/lib/utils';
// import Skeleton from "../ui";
import { useSearchParams } from 'react-router-dom';



/** Sort icon: shows active direction or neutral indicator */
const SortIcon: React.FC<{ direction: SortDirection }> = ({ direction }) => {
    if (direction === 'asc')
        return (
            <svg
                className="inline-block w-2.5 h-2.5 ml-1 flex-shrink-0 transition-transform"
                viewBox="0 0 12 12"
                fill="currentColor"
            >
                <path d="M6 2l4 7H2z" />
            </svg>
        );
    if (direction === 'desc')
        return (
            <svg
                className="inline-block w-2.5 h-2.5 ml-1 flex-shrink-0 rotate-180 transition-transform"
                viewBox="0 0 12 12"
                fill="currentColor"
            >
                <path d="M6 2l4 7H2z" />
            </svg>
        );
    return (
        <svg
            className="inline-block w-2.5 h-2.5 ml-1 flex-shrink-0 opacity-30"
            viewBox="0 0 12 12"
            fill="currentColor"
        >
            <path d="M6 1l3 4H3zM6 11l-3-4h6z" />
        </svg>
    );
};

/** Search / filter bar */
const FilterBar: React.FC<{
    value: string
    onChange: (v: string) => void
}> = ({ value, onChange }) => (
    <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1.8}
        >
            <circle cx={6.5} cy={6.5} r={4.5} />
            <path d="M10.5 10.5l3 3" strokeLinecap="round" />
        </svg>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search…"
            className="border-none outline-none bg-transparent text-sm text-foreground w-full placeholder:text-muted-foreground"
        />
        {value && (
            <button
                onClick={() => onChange('')}
                className="border-none bg-transparent cursor-pointer text-muted-foreground hover:text-foreground text-lg leading-none"
            >
                ×
            </button>
        )}
    </div>
);

function Table<T extends Record<string, unknown>>({
    columns,
    data,
    rowKey,
    loading = false,
    emptyMessage = 'No data available.',
    loadingRows = 5,
    sortState,
    onSortChange,
    onRowClick,
    pagination,
    onPageChange,
    onPageSizeChange,
    filterState,
    onFilterChange,
    showSearch = false,
    className,
    stickyHeader = false,
}: TableProps<T>) {
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        const sortField = searchParams.get('sortField');
        const sortOrder = searchParams.get('sortOrder');
        const query = searchParams.get('query');

        if (sortField && onSortChange) {
            onSortChange({
                field: sortField,
                direction: sortOrder as 'asc' | 'desc',
            });
        }

        if (query && onFilterChange) {
            onFilterChange({ query });
        }
    }, [searchParams, onSortChange, onFilterChange]);
    const handleSort = (field: string) => {
        if (!onSortChange) return;

        const activeDirection = sortState?.field === field ? sortState.direction : null;

        const next = activeDirection === 'asc' ? 'desc' : activeDirection === 'desc' ? null : 'asc';

        const params = new URLSearchParams(searchParams);

        params.set('sortField', field);

        if (next) {
            params.set('sortOrder', next);
        } else {
            params.delete('sortOrder');
        }

        setSearchParams(params);

        onSortChange({
            field,
            direction: next,
        });
    };

    const handleSearch = useCallback(
        (query: string) => {
            if (!onFilterChange) return;

            const params = new URLSearchParams(searchParams);

            if (query) {
                params.set('query', query);
                params.set('page', '1'); // reset page when filtering
            } else {
                params.delete('query');
            }

            setSearchParams(params);

            onFilterChange({ ...(filterState ?? { query: '' }), query });
        },
        [filterState, onFilterChange, searchParams, setSearchParams],
    );

    const isClickable = Boolean(onRowClick);

    return (
        <>
            <div
                className={cn(
                    'w-full rounded-lg border border-border overflow-hidden font-sans text-sm text-foreground bg-background shadow-sm',
                    className,
                )}
            >
                {/* ── Filter bar ── */}
                {showSearch && (
                    <FilterBar value={filterState?.query ?? ''} onChange={handleSearch} />
                )}

                {/* ── Table ── */}
                <div className="overflow-x-auto">
                    <UITable>
                        <TableHeader
                            className={cn('bg-muted/20', stickyHeader && 'sticky top-0 z-10')}
                        >
                            <TableRow>
                                {columns.map((col) => (
                                    <TableHead
                                        key={col.field}
                                        className={cn(
                                            'text-xs uppercase whitespace-nowrap',
                                            sortState?.field === col.field
                                                ? 'text-primary'
                                                : 'text-muted-foreground',
                                            col.sort &&
                                                'cursor-pointer select-none hover:text-primary',
                                        )}
                                        style={{ width: col.width }}
                                        onClick={col.sort ? () => handleSort(col.field) : undefined}
                                        aria-sort={(() => {
                                            const dir =
                                                sortState?.field === col.field
                                                    ? sortState?.direction
                                                    : null;
                                            return dir === 'asc'
                                                ? 'ascending'
                                                : dir === 'desc'
                                                    ? 'descending'
                                                    : undefined;
                                        })()}
                                    >
                                        <div className="flex items-center">
                                            {col.name}
                                            {col.sort && (
                                                <SortIcon
                                                    direction={
                                                        sortState?.field === col.field
                                                            ? (sortState?.direction ?? null)
                                                            : null
                                                    }
                                                />
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {/* ── Loading skeleton ── */}
                            {loading &&
                                Array.from({ length: loadingRows }).map((_, ri) => (
                                    <TableRow key={`skeleton-${ri}`}>
                                        {columns.map((col) => (
                                            <TableCell
                                                key={col.field}
                                                className={cn(
                                                    col.align === 'center'
                                                        ? 'text-center'
                                                        : col.align === 'right'
                                                            ? 'text-right'
                                                            : 'text-left',
                                                )}
                                            >
                                                {/* <Skeleton
                                                   variant="line"
                                                   width={ri % 2 === 0 ? '60%' : '80%'}
                                                /> */}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}

                            {/* ── Empty state ── */}
                            {!loading && data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="text-center py-12"
                                    >
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* ── Data rows ── */}
                            {!loading &&
                                data.map((row) => (
                                    <TableRow
                                        key={String(row[rowKey])}
                                        className={cn(
                                            'hover:bg-muted/20',
                                            isClickable && 'cursor-pointer',
                                        )}
                                        onClick={isClickable ? () => onRowClick!(row) : undefined}
                                        tabIndex={isClickable ? 0 : undefined}
                                        onKeyDown={
                                            isClickable
                                                ? (e) => e.key === 'Enter' && onRowClick!(row)
                                                : undefined
                                        }
                                    >
                                        {columns.map((col) => (
                                            <TableCell
                                                key={col.field}
                                                className={cn(
                                                    col.align === 'center'
                                                        ? 'text-center'
                                                        : col.align === 'right'
                                                            ? 'text-right'
                                                            : 'text-left',
                                                )}
                                            >
                                                {col.render
                                                    ? col.render(row[col.field], row)
                                                    : String(row[col.field] ?? '')}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </UITable>
                </div>

                {/* ── Pagination ── */}
                {pagination && onPageChange && onPageSizeChange && (
                    <Pagination
                        pagination={pagination}
                        onPageChange={onPageChange}
                        onPageSizeChange={onPageSizeChange}
                    />
                )}
            </div>
        </>
    );
}

export default Table;
