export interface LoginPayload {
    email: string
    password: string
}

export interface RegisterPayload {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export interface GoogleAuthPayload {
    token: string
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
    token: string
}

export interface RegisterResponse {
    user: AuthUser
    token: string
}

export interface GoogleAuthResponse {
    user: AuthUser
    token: string
}
