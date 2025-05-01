export interface User {
    email: string;
    id: string;
    createdAt: {
        _seconds: number;
        _nanoseconds: number;
    };
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
    isNewUser: boolean;
}