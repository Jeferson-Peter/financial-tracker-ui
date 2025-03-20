import { api, handleApiError } from "@/services/api";
import {getAccessToken} from "@/services/authService";

export interface AccountType {
  id: number;
  name: string;
  is_default: boolean;
  slug: string;
  description: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}


export const fetchAccountTypes = async (url?: string): Promise<PaginatedResponse<AccountType>> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = await api.get<PaginatedResponse<AccountType>>(url || "/account-types/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to fetch account types");
  }
};

export const createAccountType = async (name: string, is_default: boolean,   description: string): Promise<AccountType> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = await api.post<AccountType>(
      "/account-types/",
      { name, is_default, description },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to create account type");
  }
};

export const updateAccountType = async (
  slug: string,
  name: string,
  is_default: boolean,
  description: string
): Promise<AccountType> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = await api.put<AccountType>(
      `/account-types/${slug}/`,
      { name, is_default, description },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to update account type");
  }
};

export const deleteAccountType = async (slug: string): Promise<void> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    await api.delete(`/account-types/${slug}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to delete account type");
  }
};
