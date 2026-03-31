export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_blacklisted: boolean;
    created_at: Date;
}

export interface CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
}