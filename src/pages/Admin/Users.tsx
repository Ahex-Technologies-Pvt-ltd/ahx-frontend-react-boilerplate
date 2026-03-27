import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Table from '@/components/table/Table';
import type { User } from '@/types';
import type { SortState, PaginationState, FilterState, ColumnConfig } from '@/components/table/types';
import { userService } from '@/services';



type TableUser = User & Record<string, unknown>

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_FIELD = 'created_at';
const DEFAULT_SORT_ORDER: Exclude<SortState['direction'], null> = 'desc';

const parsePositiveInt = (value: string | null, fallback: number) => {
    const parsed = Number.parseInt(value ?? '', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

type UsersParamState = {
    query: string
    sortField: string
    sortOrder: Exclude<SortState['direction'], null>
    page: number
    limit: number
}

const buildOrderedParams = (state: UsersParamState) => {
    const params = new URLSearchParams();

    if (state.query) {
        params.set('query', state.query);
    }

    if (state.sortField !== DEFAULT_SORT_FIELD) {
        params.set('sortField', state.sortField);
    }
    if (state.sortOrder === 'asc') {
        params.set('sortOrder', 'asc');
    }

    if (state.page > DEFAULT_PAGE) {
        params.set('page', state.page.toString());
    }
    if (state.limit !== DEFAULT_PAGE_SIZE) {
        params.set('limit', state.limit.toString());
    }

    return params;
};

const Users: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [users, setUsers] = useState<TableUser[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const page = parsePositiveInt(searchParams.get('page'), DEFAULT_PAGE);
    const pageSize = parsePositiveInt(searchParams.get('limit'), DEFAULT_PAGE_SIZE);
    const query = searchParams.get('query') || '';
    const sortField = searchParams.get('sortField') || DEFAULT_SORT_FIELD;
    const sortOrderFromUrl = searchParams.get('sortOrder');
    const sortDirection: Exclude<SortState['direction'], null> =
        sortOrderFromUrl === 'asc' ? 'asc' : DEFAULT_SORT_ORDER;

    const sortState: SortState = {
        field: sortField,
        direction: sortDirection,
    };
    const filterState: FilterState = { query };
    const paginationState: PaginationState = { page, pageSize, total };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await userService.getUsers({
                page,
                limit: pageSize,
                search: query || undefined,
                sortField,
                sortOrder: sortDirection,
            });

            setUsers(response.data as TableUser[]);
            setTotal(response.total);
        } catch (err: unknown) {
            const message =
                typeof err === 'object' &&
                err !== null &&
                'message' in err &&
                typeof err.message === 'string'
                    ? err.message
                    : 'Something went wrong. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, query, sortDirection, sortField]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSortChange = useCallback((newSort: SortState) => {
        const nextSortDirection: Exclude<SortState['direction'], null> =
            newSort.direction === 'asc' ? 'asc' : DEFAULT_SORT_ORDER;
        setSearchParams(
            buildOrderedParams({
                query,
                sortField: newSort.field,
                sortOrder: nextSortDirection,
                page: DEFAULT_PAGE,
                limit: pageSize,
            }),
        );
    }, [pageSize, query, setSearchParams]);

    const handlePageChange = useCallback((page: number) => {
        setSearchParams(
            buildOrderedParams({
                query,
                sortField,
                sortOrder: sortDirection,
                page,
                limit: pageSize,
            }),
        );
    }, [pageSize, query, setSearchParams, sortDirection, sortField]);

    const handlePageSizeChange = useCallback((pageSize: number) => {
        setSearchParams(
            buildOrderedParams({
                query,
                sortField,
                sortOrder: sortDirection,
                page: DEFAULT_PAGE,
                limit: pageSize,
            }),
        );
    }, [query, setSearchParams, sortDirection, sortField]);

    const handleFilterChange = useCallback((newFilter: FilterState) => {
        setSearchParams(
            buildOrderedParams({
                query: newFilter.query,
                sortField,
                sortOrder: sortDirection,
                page: DEFAULT_PAGE,
                limit: pageSize,
            }),
        );
    }, [pageSize, setSearchParams, sortDirection, sortField]);

    const handleRowClick = (user: TableUser) => {
        navigate(`/admin/users/${user.id}`);
    };

    const getStatusFromRoles = (roles: string[]): string => {
        if (roles.includes('superAdmin')) return 'Super Admin';
        if (roles.includes('admin')) return 'Admin';
        if (roles.includes('support')) return 'Support';
        return 'User';
    };

    const columns: ColumnConfig<TableUser>[] = [
        {
            name: 'Name',
            field: 'name',
            sort: true,
        },
        {
            name: 'Email',
            field: 'email',
            sort: true,
        },
        {
            name: 'Status',
            field: 'roles',
            sort: true,
            render: (_: unknown, row) => getStatusFromRoles(row.roles),
        },
        {
            name: 'Date of Joining',
            field: 'created_at',
            sort: true,
            render: (_: unknown, row) => new Date(row.created_at).toLocaleDateString(),
        },
    ];

    const getEmptyMessage = () => {
        if (error) return error;
        if (filterState.query) return 'No users found with search criteria';
        return 'No users available';
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Users</h1>

            <Table<TableUser>
                columns={columns}
                data={users}
                rowKey="id"
                loading={loading}
                emptyMessage={getEmptyMessage()}
                sortState={sortState}
                onSortChange={handleSortChange}
                onRowClick={handleRowClick}
                pagination={paginationState}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                filterState={filterState}
                onFilterChange={handleFilterChange}
                showSearch
                className="w-full"
            />
        </div>
    );
};

export default Users;
