import { api, handleApiError } from "@/services/api";
import { getAccessToken } from "@/services/authService";

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const fetchCategories = async (url?: string): Promise<PaginatedResponse<Category>> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = await api.get<PaginatedResponse<Category>>(url || "/categories/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to fetch categories.");
  }
};

export const createCategory = async (name: string, description: string): Promise<Category> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = await api.post<Category>(
      "/categories/",
      { name, description },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to create category.");
  }
};

export const updateCategory = async (
  id: number,
  name: string,
  description: string
): Promise<Category> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = await api.put<Category>(
      `/categories/${id}/`,
      { name, description },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to update category.");
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    await api.delete(`/categories/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to delete category.");
  }
};

export const fetchCategoriesWithSearch = async (
  search: string = "",
  url?: string
): Promise<PaginatedResponse<Category>> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("Access token not found. Please log in.");

  try {
    const response = url
      ? await api.get<PaginatedResponse<Category>>(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      : await api.get<PaginatedResponse<Category>>(
          `/categories/?search=${search}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to fetch categories");
  }
};

