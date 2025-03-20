import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AccountType, fetchAccountTypes } from "@/services/accountTypeService";
import { Account } from "@/services/accountsServices";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountTypeId: number, balance: number) => void;
  account: Account | null;
}

const AccountModal = ({ isOpen, onClose, onSave, account }: Props) => {
  const [balance, setBalance] = useState<number>(0);
  const [accountTypeId, setAccountTypeId] = useState<number | null>(null);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch account types when the modal opens
  useEffect(() => {
    const loadAccountTypes = async () => {
      setLoading(true);
      try {
        const data = await fetchAccountTypes(); // Adjust the service to handle pagination if needed
        setAccountTypes(data.results); // Ensure you're setting the fetched results
      } catch (error) {
        console.error("Error fetching account types:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadAccountTypes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (account) {
      setBalance(account.balance);
      setAccountTypeId(account.account_type.id);
    } else {
      setBalance(0);
      setAccountTypeId(null);
    }
  }, [account]);

  const handleSubmit = () => {
    if (!accountTypeId) return; // Ensure account type is selected
    onSave(accountTypeId, balance);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{account ? "Edit Account" : "Add Account"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Account Type</FormLabel>
            {loading ? (
              <Spinner />
            ) : (
              <Select
                value={accountTypeId || ""}
                onChange={(e) => setAccountTypeId(parseInt(e.target.value, 10))}
                placeholder="Select an account type"
              >
                {accountTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            )}
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Balance</FormLabel>
            <Input
              type="number"
              value={balance}
              onChange={(e) => setBalance(parseFloat(e.target.value))}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit} isDisabled={loading || !accountTypeId}>
            Save
          </Button>
          <Button ml={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AccountModal;
