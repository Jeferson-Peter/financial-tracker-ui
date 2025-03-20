import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { AccountType } from "@/services/accountTypeService";
import { HamburgerIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";

interface Props {
  accountTypes: AccountType[];
  onEdit: (accountType: AccountType) => void;
  onDelete: (slug: string) => void;
}

const AccountTypeTable = ({ accountTypes, onEdit, onDelete }: Props) => {
  return (
    <Table
      variant="simple"
      bg="white"
      shadow="md"
      borderRadius="md"
      overflow="hidden"
      size="sm"
    >
      <Thead bg="teal.500">
        <Tr>
          <Th color="white" py={2}>
            Name
          </Th>
          <Th color="white" py={2}>
            Default
          </Th>
          <Th color="white" py={2}>
            Description
          </Th>
          <Th color="white" textAlign="center" py={2}>
            Actions
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {Array.isArray(accountTypes) && accountTypes.length > 0 ? (
          accountTypes.map((type) => (
            <Tr key={type.id} _hover={{ bg: "gray.100" }}>
              <Td py={2}>{type.name}</Td>
              <Td py={2}>{type.is_default ? "Yes" : "No"}</Td>
              <Td py={2}>{type.description || "No description"}</Td> {/* Nova coluna */}
              <Td textAlign="center" py={2}>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Actions"
                    icon={<HamburgerIcon />}
                    variant="outline"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem icon={<EditIcon />} onClick={() => onEdit(type)}>
                      Edit
                    </MenuItem>
                    <MenuItem
                      icon={<DeleteIcon />}
                      onClick={() => onDelete(type.slug)}
                      color="red.500"
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={4} textAlign="center" py={2}>
              No account types found.
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

export default AccountTypeTable;
