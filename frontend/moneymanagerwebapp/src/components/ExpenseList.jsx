import moment from "moment";
import TransactionInfoCard from "./TransactionInfoCard.jsx";

const ExpenseList = ({ transactions = [], onDelete }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h5 className="text-lg font-semibold text-gray-800">Expense Sources</h5>

      {transactions.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          No expenses found for this month.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {transactions.map((expense) => (
            <TransactionInfoCard
              key={expense.id}
              title={expense.name}
              icon={expense.icon}
              date={moment(expense.date).format("Do MMM YYYY")}
              amount={expense.amount}
              type="expense"
              onDelete={() => onDelete(expense.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;