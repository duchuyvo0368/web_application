interface LocalUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
}
export declare function saveUserToLocalStorage(user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
}): void;
export declare function getUserFromLocalStorage(): LocalUser | null;
export declare function removeUserFromLocalStorage(): void;
export {};
