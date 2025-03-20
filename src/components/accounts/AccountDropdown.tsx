import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDebounce } from "use-debounce";
import { fetchAccountsWithSearch, Account } from "@/services/accountsServices";

interface Props {
  onAccountChange: (selectedAccount: number | null) => void;
  selectedAccount: number | null;
}

const AccountDropdown = ({ onAccountChange, selectedAccount }: Props) => {
  console.log("selectedAccount: ", selectedAccount)
  const [options, setOptions] = useState<{ value: number; label: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Termo de busca
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300); // Debounce de 300ms
  const [loading, setLoading] = useState<boolean>(false); // Controle de carregamento
  const [nextPage, setNextPage] = useState<string | null>(null); // Próxima página
  const [currentSelection, setCurrentSelection] = useState<{ value: number; label: string } | null>(
    null
  );

  // Função para carregar contas
  const loadAccounts = async (query: string, resetOptions: boolean = true, url?: string) => {
    setLoading(true);
    try {
      const data = url
        ? await fetchAccountsWithSearch("", url)
        : await fetchAccountsWithSearch(query);

      const formattedAccounts = data.results.map((account: Account) => ({
        value: account.id,
        label: account.account_type_name,
      }));

      setOptions((prevOptions) => {
        const newOptions = formattedAccounts.filter(
          (newOption) => !prevOptions.some((prevOption) => prevOption.value === newOption.value)
        );
        return resetOptions ? formattedAccounts : [...prevOptions, ...newOptions];
      });

      setNextPage(data.next); // Atualiza a próxima página corretamente
    } catch (error) {
      console.error("Failed to load accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Busca inicial e quando o termo de pesquisa muda
  useEffect(() => {
    if (debouncedSearchTerm) {
      loadAccounts(debouncedSearchTerm, true);
    } else {
      loadAccounts("", true);
    }
  }, [debouncedSearchTerm]);

  // Função para carregar mais contas na rolagem
  const handleLoadMore = async () => {
    if (nextPage) {
      await loadAccounts("", false, nextPage);
    }
  };

  // Quando o usuário seleciona uma conta
  const handleChange = (selectedOption: { value: number; label: string } | null) => {
    onAccountChange(selectedOption ? selectedOption.value : null);
  };

  return (
    <div>
    <Select
      options={options}
      value={options.find((option) => option.value === selectedAccount) || null}
      onChange={handleChange}
      isClearable
      isLoading={loading}
      onInputChange={(value) => setSearchTerm(value)}
      placeholder="Select or type to search..."
      onMenuScrollToBottom={handleLoadMore}
    />
    </div>
  );
};

export default AccountDropdown;
