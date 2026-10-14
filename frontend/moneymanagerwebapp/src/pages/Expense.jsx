import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import Dashboard from "../components/Dashboard.jsx";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import Modal from "../components/Model.jsx";
import { useUser } from "../hooks/useUser.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoint.js";

const Expense = () => {
  useUser();

  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const fetchExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
      if (response.status === 200) setExpenseData(response.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      toast.error(error.response?.data?.message || "Failed to fetch expenses");
    }
  };

  const fetchExpenseCategories = async () => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.CATEGORY_BY_TYPE("expense")
      );
      if (response.status === 200) setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch expense categories:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch expense categories"
      );
    }
  };

  const handleAddExpense = async (expense) => {
    const { name, amount, date, icon, categoryId } = expense;

    if (!name.trim()) {
      toast.error("Please enter an expense name");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter an amount greater than 0");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId: Number(categoryId),
      });

      if (response.status === 201) {
        setOpenAddExpenseModal(false);
        toast.success("Expense added successfully");
        await fetchExpenseDetails();
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully");
      await fetchExpenseDetails();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    fetchExpenseCategories();
  }, []);

  return (
    <Dashboard activeMenu="Expense">
      <div className="my-5 mx-auto grid grid-cols-1 gap-6">
        <div className="flex justify-end">
          <button
            className="add-btn"
            onClick={() => setOpenAddExpenseModal(true)}
          >
            <Plus size={15} />
            Add Expense
          </button>
        </div>

        <ExpenseList
          transactions={expenseData}
          onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
        />

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm
            onAddExpense={handleAddExpense}
            categories={categories}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default Expense;