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
  Account,
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "@/services/accountsServices";
import AccountsTable from "@/components/accounts/AccountsTable";
import AccountModal from "@/components/accounts/AccountModal";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [pagination, setPagination] = useState<{ next: string | null; previous: string | null }>({
    next: null,
    previous: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const toast = useToast();

  const loadAccounts = async (url?: string) => {
    setLoading(true);
    try {
      const data = await fetchAccounts(url);
      setAccounts(data.results);
      setPagination({ next: data.next, previous: data.previous });
    } catch (error) {
      console.error("Error loading accounts:", error);
      toast({
        title: "Error",
        description: "Failed to load accounts.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const openModal = (account: Account | null = null) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleSave = async (balance: number, accountTypeId: number) => {
    try {
      if (editingAccount) {
        await updateAccount(editingAccount.id, balance, accountTypeId);
        toast({
          title: "Success",
          description: "Account updated successfully.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        await createAccount(balance, accountTypeId);
        toast({
          title: "Success",
          description: "Account created successfully.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
      closeModal();
      loadAccounts();
    } catch (error) {
      console.error("Error saving account:", error);
      toast({
        title: "Error",
        description: "Failed to save account.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAccount(id);
      toast({
        title: "Success",
        description: "Account deleted successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      loadAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="lg" color="teal.600">
          Manage Accounts
        </Heading>
        <Button
          colorScheme="teal"
          leftIcon={<AddIcon />}
          onClick={() => openModal()}
        >
          Add Account
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <AccountsTable
            accounts={accounts}
            onEdit={openModal}
            onDelete={handleDelete}
          />

          {/* Pagination Controls */}
          <Flex justify="space-between" mt={6}>
            <IconButton
              aria-label="Previous page"
              icon={<ArrowLeftIcon />}
              colorScheme="teal"
              onClick={() => loadAccounts(pagination.previous!)}
              isDisabled={!pagination.previous}
            />
            <IconButton
              aria-label="Next page"
              icon={<ArrowRightIcon />}
              colorScheme="teal"
              onClick={() => loadAccounts(pagination.next!)}
              isDisabled={!pagination.next}
            />
          </Flex>
        </>
      )}

      <AccountModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        account={editingAccount}
      />
    </Box>
  );
};

export default AccountsPage;
