export declare enum UserRole {
    LOCAL = "local",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
    isLocalUser(): boolean;
    isAdmin(): boolean;
    isSuperAdmin(): boolean;
}
