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
import { Category } from "@/services/categoryService";
import { HamburgerIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

const CategoryTable = ({ categories, onEdit, onDelete }: Props) => {
  return (
    <Table variant="simple" bg="white" shadow="md" borderRadius="md" overflow="hidden" size="sm">
      <Thead bg="teal.500">
        <Tr>
          <Th color="white" py={2}>
            Name
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
        {categories.length > 0 ? (
          categories.map((category) => (
            <Tr key={category.id} _hover={{ bg: "gray.100" }}>
              <Td py={2}>{category.name}</Td>
              <Td py={2}>{category.description || "No description"}</Td>
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
                    <MenuItem icon={<EditIcon />} onClick={() => onEdit(category)}>
                      Edit
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />} onClick={() => onDelete(category.id)} color="red.500">
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
              No categories found.
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

export default CategoryTable;
