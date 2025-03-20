import { api, handleApiError } from "@/services/api";
import { getAccessToken } from "@/services/authService";

export interface Transaction {
  id: number;
  account: number;
  account_name: string;
  amount: number;
  transaction_type: string;
  date: string;
  description: string;
  category: number | null;
  category_name: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const fetchTransactions = async (url?: string): Promise<PaginatedResponse<Transaction>> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = await api.get<PaginatedResponse<Transaction>>(url || "/transactions/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to fetch transactions.");
  }
};

export const createTransaction = async (
  account: number,
  amount: number,
  transaction_type: string,
  date: string,
  description: string,
  category: number | null
): Promise<Transaction> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = await api.post<Transaction>(
      "/transactions/",
      { account, amount, transaction_type, date, description, category },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to create transaction.");
  }
};

export const updateTransaction = async (
  id: number,
  account: number,
  amount: number,
  transaction_type: string,
  date: string,
  description: string,
  category: number | null
): Promise<Transaction> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = await api.put<Transaction>(
      `/transactions/${id}/`,
      { account, amount, transaction_type, date, description, category },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to update transaction.");
  }
};

export const deleteTransaction = async (id: number): Promise<void> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    await api.delete(`/transactions/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to delete transaction.");
  }
};
