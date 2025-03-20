import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDebounce } from "use-debounce";
import { fetchCategoriesWithSearch, Category } from "@/services/categoryService";

interface Props {
  onCategoryChange: (selectedCategory: number | null) => void;
  selectedCategory: number | null;
}

const CategoryDropdown = ({ onCategoryChange, selectedCategory }: Props) => {
  const [options, setOptions] = useState<{ value: number; label: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextPage, setNextPage] = useState<string | null>(null);

  // Função para carregar categorias
  const loadCategories = async (query: string = "", resetOptions: boolean = true, url?: string) => {
    setLoading(true);
    try {
      const data = url
        ? await fetchCategoriesWithSearch("", url)
        : await fetchCategoriesWithSearch(query);

      const formattedCategories = data.results.map((cat: Category) => ({
        value: cat.id,
        label: cat.name,
      }));

      setOptions((prevOptions) =>
        resetOptions ? formattedCategories : [...prevOptions, ...formattedCategories]
      );
      setNextPage(data.next);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Busca inicial e quando o termo de pesquisa muda
  useEffect(() => {
    if (debouncedSearchTerm) {
      loadCategories(debouncedSearchTerm, true);
    } else {
      loadCategories("", true);
    }
  }, [debouncedSearchTerm]);

  // Busca a categoria inicial baseada no ID
  useEffect(() => {
    if (selectedCategory) {
      const matchedOption = options.find((option) => option.value === selectedCategory);
      if (!matchedOption) {
        setOptions((prevOptions) => [
          ...prevOptions,
          { value: selectedCategory, label: "Loading..." },
        ]);
      }
    }
  }, [selectedCategory]);

  // Carrega mais categorias ao rolar
  const handleLoadMore = async () => {
    if (nextPage) {
      await loadCategories("", false, nextPage);
    }
  };

  // Quando o usuário seleciona uma categoria
  const handleChange = (selectedOption: { value: number; label: string } | null) => {
    onCategoryChange(selectedOption ? selectedOption.value : null);
  };

  return (
    <div>
      <Select
        options={options}
        value={options.find((option) => option.value === selectedCategory) || null}
        onChange={handleChange}
        isClearable
        isLoading={loading}
        onInputChange={(value) => setSearchTerm(value.trim())}
        placeholder="Select or type to search..."
        onMenuScrollToBottom={handleLoadMore}
      />
    </div>
  );
};

export default CategoryDropdown;
