// types/account-type.ts
export type AccountType = {
    id: number;
    name: string;
    slug: string;
    is_default: boolean;
    description?: string;
};
