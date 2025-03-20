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
  Checkbox,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AccountType } from "@/services/accountTypeService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, isDefault: boolean, description: string) => void; // Adiciona descrição
  accountType: AccountType | null;
}

const AccountTypeModal = ({ isOpen, onClose, onSave, accountType }: Props) => {
  const [name, setName] = useState<string>("");
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(""); // Estado para a descrição
  const toast = useToast();

  useEffect(() => {
    // Preenche os campos ao editar um tipo de conta
    if (accountType) {
      setName(accountType.name);
      setIsDefault(accountType.is_default);
      setDescription(accountType.description || ""); // Preenche a descrição se existir
    } else {
      setName("");
      setIsDefault(false);
      setDescription(""); // Limpa a descrição ao criar
    }
  }, [accountType]);

  const handleSubmit = () => {
    // Validações de campos
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    onSave(name.trim(), isDefault, description.trim());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{accountType ? "Edit Account Type" : "Add Account Type"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter account type name"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description (optional)"
            />
          </FormControl>
          <FormControl>
            <Checkbox
              isChecked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            >
              Default
            </Checkbox>
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

export default AccountTypeModal;
