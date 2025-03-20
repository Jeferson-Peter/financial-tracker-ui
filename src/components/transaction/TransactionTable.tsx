import React from "react";
import {Table, Tbody, Td, Th, Thead, Tr, IconButton, Menu, MenuButton, MenuList, MenuItem} from "@chakra-ui/react";
import {EditIcon, DeleteIcon, HamburgerIcon} from "@chakra-ui/icons";
import { Transaction } from "@/services/transactionService";

interface Props {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

const TransactionTable = ({ transactions, onEdit, onDelete }: Props) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Account</Th>
          <Th>Amount</Th>
          <Th>Type</Th>
          <Th>Date</Th>
          <Th>Category</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {transactions.map((transaction) => (
          <Tr key={transaction.id}>
            <Td>{transaction.account_name}</Td> {/* Usa o campo descritivo */}
            <Td>{Number(transaction.amount).toFixed(2)}</Td>
            <Td>{transaction.transaction_type}</Td>
            <Td>
              {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
                new Date(transaction.date)
              )}
            </Td>
            <Td>{transaction.category_name}</Td> {/* Usa o campo descritivo */}
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
                  <MenuItem icon={<EditIcon />} onClick={() => onEdit(transaction)}>
                    Edit
                  </MenuItem>
                  <MenuItem icon={<DeleteIcon />} onClick={() => onDelete(transaction.id)} color="red.500">
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default TransactionTable;
