export interface LoginPayload {
    email: string
    password: string
}

export interface ForgotPasswordPayload {
    email: string
}

export interface ResetPasswordPayload {
    token: string
    password: string
}

export interface AuthUser {
    id: string
    name: string
    email: string
    role: string
}

export interface LoginResponse {
    user: AuthUser
}
