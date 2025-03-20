import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Button,
  Spinner,
  useToast,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  Transaction,
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/services/transactionService";
import {Account, fetchAccounts} from "@/services/accountsServices";
import TransactionTable from "@/components/transaction/TransactionTable";
import TransactionModal from "@/components/transaction/TransactionModal";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [pagination, setPagination] = useState<{ next: string | null; previous: string | null }>({
    next: null,
    previous: null,
  });

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const toast = useToast();

  const loadTransactions = async (url?: string) => {
    setLoading(true);
    try {
      const data = await fetchTransactions(url);
      setTransactions(data.results);
      setPagination({ next: data.next, previous: data.previous });
    } catch (error) {
      toast({ title: "Error", description: `${error}`, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadAccountsAndCategories = async () => {
    try {
      const accountData = await fetchAccounts();
      setAccounts(accountData.results);
    } catch (error) {
      toast({ title: "Error", description: `${error}`, status: "error" });
    }
  };


  useEffect(() => {
    loadTransactions();
    loadAccountsAndCategories();
  }, []);

  const openModal = (transaction: Transaction | null = null) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSave = async (
    account: number,
    amount: number,
    transaction_type: string,
    date: string,
    description: string,
    category: number | null
  ) => {
    try {
      if (editingTransaction) {
        await updateTransaction(
          editingTransaction.id,
          account,
          amount,
          transaction_type,
          date,
          description,
          category
        );
        toast({ title: "Success", description: "Transaction updated." });
      } else {
        await createTransaction(account, amount, transaction_type, date, description, category);
        toast({ title: "Success", description: "Transaction added." });
      }
      closeModal();
      loadTransactions();
    } catch (error) {
      toast({ title: "Error", description: `${error}`, status: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      toast({ title: "Success", description: "Transaction deleted." });
      loadTransactions();
    } catch (error) {
      toast({ title: "Error", description: `${error}`, status: "error" });
    }
  };

  return (
    <Box p={8} bg="gray.50">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="lg" color="teal.600">
          Manage Transactions
        </Heading>
        <Button colorScheme="teal" leftIcon={<AddIcon />} onClick={() => openModal()}>
          Add Transaction
        </Button>
      </Flex>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <>
          <TransactionTable
            transactions={transactions}
            onEdit={openModal}
            onDelete={handleDelete}
          />
          <Flex justify="space-between" mt={4}>
            <IconButton
              aria-label="Previous page"
              icon={<ArrowLeftIcon />}
              onClick={() => loadTransactions(pagination.previous!)}
              isDisabled={!pagination.previous}
            />
            <IconButton
              aria-label="Next page"
              icon={<ArrowRightIcon />}
              onClick={() => loadTransactions(pagination.next!)}
              isDisabled={!pagination.next}
            />
          </Flex>
        </>
      )}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        transaction={editingTransaction}
        // accounts={accounts}
      />
    </Box>
  );
};

export default TransactionsPage;
