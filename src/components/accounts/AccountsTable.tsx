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
import { HamburgerIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Account } from "@/services/accountsServices";

interface Props {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (id: number) => void;
}

const AccountsTable = ({ accounts, onEdit, onDelete }: Props) => {
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
            Account Type
          </Th>
          <Th color="white" py={2}>
            Balance
          </Th>
          <Th color="white" textAlign="center" py={2}>
            Actions
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {Array.isArray(accounts) && accounts.length > 0 ? (
          accounts.map((account) => (
            <Tr key={account.id} _hover={{ bg: "gray.100" }}>
              <Td py={2}>{account.account_type_name}</Td>
              <Td py={2}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(account.balance)}
              </Td>
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
                    <MenuItem icon={<EditIcon />} onClick={() => onEdit(account)}>
                      Edit
                    </MenuItem>
                    <MenuItem
                      icon={<DeleteIcon />}
                      onClick={() => onDelete(account.id)}
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
            <Td colSpan={3} textAlign="center" py={2}>
              No accounts found.
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

export default AccountsTable;
