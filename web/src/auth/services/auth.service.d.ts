interface LoginData {
    email: string;
    password: string;
}
export declare const login: ({ data, onSuccess, onError, }: {
    data: LoginData;
    onSuccess?: (res: any) => void;
    onError?: (err: any) => void;
}) => Promise<void>;
export declare const logout: () => void;
export declare const isAuthenticated: () => boolean;
export {};
