export interface User {
    id: string
    name: string
    email: string
    roles: string[]
    created_at: string
}

export interface UsersResponse {
    data: User[]
    total: number
    page: number
    limit: number
    totalPages: number
}
