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
  Category,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categoryService";
import CategoryTable from "@/components/category/CategoryTable";
import CategoryModal from "@/components/category/CategoryModal";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<{ next: string | null; previous: string | null }>({
    next: null,
    previous: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const toast = useToast();

  const loadCategories = async (url?: string) => {
    setLoading(true);
    try {
      const data = await fetchCategories(url);
      setCategories(data.results);
      setPagination({ next: data.next, previous: data.previous });
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openModal = (category: Category | null = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

    const handleSave = async (name: string, description: string) => {
      try {
        if (editingCategory) {
          await updateCategory(editingCategory.id, name, description);
          toast({
            title: "Success",
            description: "Category updated successfully.",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        } else {
          await createCategory(name, description);
          toast({
            title: "Success",
            description: "Category created successfully.",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        }
        // Garante que o modal seja fechado e o estado seja limpo
        closeModal();
        setTimeout(() => loadCategories(), 0); // Aguarda fechamento antes de recarregar
      } catch (error) {
        toast({
          title: "Error",
          description: `${error}`,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    };



  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      toast({
        title: "Success",
        description: "Category deleted successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      loadCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}`,
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
          Manage Categories
        </Heading>
        <Button
          colorScheme="teal"
          leftIcon={<AddIcon />}
          onClick={() => openModal()}
        >
          Add Category
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <CategoryTable
            categories={categories}
            onEdit={openModal}
            onDelete={handleDelete}
          />

          <Flex justify="space-between" mt={6}>
            <IconButton
              aria-label="Previous page"
              icon={<ArrowLeftIcon />}
              colorScheme="teal"
              onClick={() => loadCategories(pagination.previous!)}
              isDisabled={!pagination.previous}
            />
            <IconButton
              aria-label="Next page"
              icon={<ArrowRightIcon />}
              colorScheme="teal"
              onClick={() => loadCategories(pagination.next!)}
              isDisabled={!pagination.next}
            />
          </Flex>
        </>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        category={editingCategory}
      />
    </Box>
  );
};

export default CategoriesPage;
