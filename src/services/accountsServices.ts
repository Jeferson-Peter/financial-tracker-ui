import { api, handleApiError } from "@/services/api";
import { getAccessToken } from "@/services/authService";
import { AccountType } from "@/services/accountTypeService";

export interface Account {
  id: number;
  balance: number;
  account_type: AccountType;
  account_type_name: string;

}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Fetch paginated accounts
export const fetchAccounts = async (url?: string): Promise<PaginatedResponse<Account>> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = await api.get<PaginatedResponse<Account>>(url || "/accounts/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to fetch accounts");
  }
};

// Create a new account
export const createAccount = async (accountTypeId: number, balance: number): Promise<Account> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = await api.post<Account>(
      "/accounts/",
      { account_type: accountTypeId, balance },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to create account");
  }
};

// Update an existing account
export const updateAccount = async (
  id: number,
  accountTypeId: number,
  balance: number
): Promise<Account> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = await api.put<Account>(
      `/accounts/${id}/`,
      { account_type: accountTypeId, balance },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to update account");
  }
};

// Delete an account
export const deleteAccount = async (id: number): Promise<void> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    await api.delete(`/accounts/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to delete account");
  }
};

export const fetchAccountsWithSearch = async (
  search: string = "",
  url?: string
): Promise<PaginatedResponse<Account>> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = url
      ? await api.get<PaginatedResponse<Account>>(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      : await api.get<PaginatedResponse<Account>>(
          `/accounts/?search=${search}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to fetch accounts");
  }
};