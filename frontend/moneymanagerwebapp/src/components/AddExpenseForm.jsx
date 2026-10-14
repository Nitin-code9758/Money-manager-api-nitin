import { useEffect, useState } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./Input.jsx";
import { LoaderCircle } from "lucide-react";

const AddExpenseForm = ({ onAddExpense, categories = [] }) => {
  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    date: "",
    icon: "",
    categoryId: "",
  });
  const [loading, setLoading] = useState(false);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  useEffect(() => {
    if (categories.length > 0 && !expense.categoryId) {
      setExpense((previous) => ({
        ...previous,
        categoryId: categories[0].id,
      }));
    }
  }, [categories, expense.categoryId]);

  const handleChange = (key, value) => {
    setExpense((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onAddExpense(expense);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(icon) => handleChange("icon", icon)}
      />

      <Input
        value={expense.name}
        onChange={({ target }) => handleChange("name", target.value)}
        label="Expense Name"
        placeholder="e.g., Groceries, Rent, Travel"
        type="text"
      />

      <Input
        label="Category"
        value={expense.categoryId}
        onChange={({ target }) => handleChange("categoryId", target.value)}
        isSelect
        options={categoryOptions}
      />

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="e.g., 500"
        type="number"
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        type="date"
      />

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="add-btn add-btn-fill"
        >
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Expense"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;