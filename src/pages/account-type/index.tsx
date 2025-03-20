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
  AccountType,
  fetchAccountTypes,
  createAccountType,
  updateAccountType,
  deleteAccountType,
} from "@/services/accountTypeService";
import AccountTypeTable from "@/components/accountType/AccountTypeTable";
import AccountTypeModal from "@/components/accountType/AccountTypeModal";

const AccountTypesPage = () => {
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [pagination, setPagination] = useState<{ next: string | null; previous: string | null }>(
    { next: null, previous: null }
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAccountType, setEditingAccountType] = useState<AccountType | null>(null);
  const toast = useToast();

  const loadAccountTypes = async (url?: string) => {
    setLoading(true);
    try {
      const data = await fetchAccountTypes(url);
      setAccountTypes(data.results);
      setPagination({ next: data.next, previous: data.previous });
    } catch (error) {
      console.error("Error loading account types:", error);
      toast({
        title: "Error",
        description: "Failed to load account types.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccountTypes();
  }, []);

  const openModal = (accountType: AccountType | null = null) => {
    setEditingAccountType(accountType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAccountType(null);
  };

  const handleSave = async (name: string, isDefault: boolean, description: string) => {
    try {
      if (editingAccountType) {
        // Update existing account type
        await updateAccountType(editingAccountType.slug, name, isDefault, description);
        toast({
          title: "Success",
          description: "Account type updated successfully.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        // Create a new account type
        await createAccountType(name, isDefault, description);
        toast({
          title: "Success",
          description: "Account type created successfully.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
      closeModal();
      loadAccountTypes(); // Refresh the list after save
    } catch (error) {
      console.error("Error saving account type:", error);
      toast({
        title: "Error",
        description: "Failed to save account type.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteAccountType(slug);
      toast({
        title: "Success",
        description: "Account type deleted successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      loadAccountTypes(); // Refresh the list after delete
    } catch (error) {
      console.error("Error deleting account type:", error);
      toast({
        title: "Error",
        description: "Failed to delete account type.",
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
          Manage Account Types
        </Heading>
        <Button
          colorScheme="teal"
          leftIcon={<AddIcon />}
          onClick={() => openModal()}
        >
          Add Account Type
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <AccountTypeTable
            accountTypes={accountTypes}
            onEdit={openModal}
            onDelete={handleDelete}
          />

          {/* Pagination Controls */}
          <Flex justify="space-between" mt={6}>
            <IconButton
              aria-label="Previous page"
              icon={<ArrowLeftIcon />}
              colorScheme="teal"
              onClick={() => loadAccountTypes(pagination.previous!)}
              isDisabled={!pagination.previous}
            />
            <IconButton
              aria-label="Next page"
              icon={<ArrowRightIcon />}
              colorScheme="teal"
              onClick={() => loadAccountTypes(pagination.next!)}
              isDisabled={!pagination.next}
            />
          </Flex>
        </>
      )}

      <AccountTypeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        accountType={editingAccountType}
      />
    </Box>
  );
};

export default AccountTypesPage;
