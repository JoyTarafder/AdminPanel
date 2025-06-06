"use client";

import AddCategoryModal from "@/components/AddCategoryModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import EditCategoryModal from "@/components/EditCategoryModal";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Category, useCategories } from "@/context/CategoriesContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiBox,
  FiEdit2,
  FiFolder,
  FiLayers,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

export default function CategoryManagement() {
  // Add router for navigation
  const router = useRouter();

  // Use the categories context instead of local state
  const { categories, addCategory, deleteCategory, updateCategory } =
    useCategories();

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // State for feedback message
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  // Clear feedback after 3 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Function to navigate to category detail page
  const navigateToCategoryPage = (categoryId: string, categoryName: string) => {
    router.push(`/categories/${categoryId}`);
  };

  // Function to initiate deletion confirmation
  const confirmDeleteCategory = (category: Category, e: React.MouseEvent) => {
    // Stop event propagation to prevent navigation when clicking delete button
    e.stopPropagation();
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  // Function to delete a category
  const handleDeleteCategory = () => {
    try {
      if (categoryToDelete) {
        deleteCategory(categoryToDelete.id);
        setFeedback({
          message: `${categoryToDelete.name} category deleted successfully`,
          type: "success",
        });
      }
    } catch (error) {
      setFeedback({ message: "Failed to delete category", type: "error" });
      console.error("Error deleting category:", error);
    }
    setCategoryToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Function to add a new category
  const handleAddCategory = (categoryName: string) => {
    try {
      // Add the category using the context function
      addCategory(categoryName);
      setFeedback({ message: "Category added successfully", type: "success" });
    } catch (error) {
      if (error instanceof Error) {
        setFeedback({ message: error.message, type: "error" });
      } else {
        setFeedback({ message: "Failed to add category", type: "error" });
      }
      console.error("Error adding category:", error);
    }
  };

  // Function to initiate category edit
  const initiateEditCategory = (category: Category, e: React.MouseEvent) => {
    // Stop event propagation to prevent navigation when clicking edit button
    e.stopPropagation();
    setCategoryToEdit(category);
    setIsEditModalOpen(true);
  };

  // Function to update a category
  const handleUpdateCategory = (categoryId: string, newName: string) => {
    try {
      updateCategory(categoryId, newName);
      setFeedback({
        message: `Category updated successfully`,
        type: "success",
      });
    } catch (error) {
      if (error instanceof Error) {
        setFeedback({ message: error.message, type: "error" });
      } else {
        setFeedback({ message: "Failed to update category", type: "error" });
      }
      console.error("Error updating category:", error);
    }
  };

  // Animation variants for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Category Management" />
        <main className="p-6 overflow-y-auto">
          {/* Header with gradient background */}
          <div className="mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 shadow-md">
            <div className="flex flex-col text-white">
              <h1 className="text-3xl font-bold">Category Management</h1>
              <p className="mt-2 text-indigo-100">
                Organize your products with custom categories
              </p>
            </div>
          </div>

          {/* Feedback Message */}
          {feedback.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-6 p-4 rounded-lg shadow-sm ${
                feedback.type === "success"
                  ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                  : "bg-red-100 text-red-800 border-l-4 border-red-500"
              }`}
            >
              {feedback.message}
            </motion.div>
          )}

          {/* Add New Category Button */}
          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-8 bg-indigo-600 rounded-lg"></div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Your Categories
              </h2>
              <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                {categories.length}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all duration-300 ease-in-out"
              aria-label="Add new category"
            >
              <FiPlus className="h-5 w-5 mr-2" />
              Add New Category
            </motion.button>
          </div>

          {/* Categories Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={item}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer"
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
                onClick={() =>
                  navigateToCategoryPage(category.id, category.name)
                }
              >
                <div className="border-b border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                      <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                      {category.name}
                    </h3>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        aria-label={`Edit ${category.name} category`}
                        onClick={(e) => initiateEditCategory(category, e)}
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => confirmDeleteCategory(category, e)}
                        className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label={`Delete ${category.name} category`}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <FiFolder className="h-6 w-6 text-indigo-500 mb-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Sub-Categories
                      </p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        {category.subCategories}
                      </p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <FiBox className="h-6 w-6 text-purple-500 mb-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Products
                      </p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        {category.products}
                      </p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <FiLayers className="h-6 w-6 text-pink-500 mb-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Variants
                      </p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        {category.variants}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Add Category Modal */}
          <AddCategoryModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddCategory}
          />

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteCategory}
            itemName={categoryToDelete?.name || ""}
          />

          {/* Edit Category Modal */}
          <EditCategoryModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={handleUpdateCategory}
            category={categoryToEdit}
          />
        </main>
      </div>
    </div>
  );
}
