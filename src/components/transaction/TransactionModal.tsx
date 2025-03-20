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
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Transaction } from "@/services/transactionService";
import AccountDropdown from "@/components/accounts/AccountDropdown"; // Atualizado
import CategoryDropdown from "@/components/category/CategoryDropDown";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    account: number,
    amount: number,
    transaction_type: string,
    date: string,
    description: string,
    category: number | null
  ) => void;
  transaction: Transaction | null;
}

const TransactionModal = ({
  isOpen,
  onClose,
  onSave,
  transaction,
}: Props) => {
  const [account, setAccount] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<string>("income");
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<number | null>(null);
  const toast = useToast();

useEffect(() => {
    console.log(`useEffect -> TransactionModal -> transaction:`, transaction)
    if (transaction) {
      setAccount(transaction.account); // Id da conta
      setAmount(transaction.amount); // Valor da transação
      setTransactionType(transaction.transaction_type); // Tipo de transação
      setDate(transaction.date ? new Date(transaction.date).toISOString().slice(0, 10) : ""); // Data formatada para o input date
      setDescription(transaction.description || ""); // Descrição
      setCategory(transaction.category || null); // Categoria
    } else {
      setAccount(null);
      setAmount(0);
      setTransactionType("income");
      setDate(new Date().toISOString().slice(0, 10)); // Valor padrão para hoje
      setDescription("");
      setCategory(null);
    }
  }, [transaction]);


  const handleSubmit = () => {
    if (!account || !transactionType || !date) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    onSave(account, amount, transactionType, date, description, category);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {transaction ? "Edit Transaction" : "Add Transaction"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <FormControl mb={4} isRequired>
          <FormLabel>Account</FormLabel>
          <AccountDropdown
            selectedAccount={account} // Valor do estado
            onAccountChange={(selected) => setAccount(selected)} // Atualiza o estado quando muda
          />
        </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Amount</FormLabel>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Transaction Type</FormLabel>
            <Input
              type="text"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Category</FormLabel>
            <CategoryDropdown
              selectedCategory={category} // Valor do estado
              onCategoryChange={(selected) => setCategory(selected)} // Atualiza o estado quando muda
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
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

export default TransactionModal;
