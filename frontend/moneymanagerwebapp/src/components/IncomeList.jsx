import { Download, LoaderCircle, Mail } from "lucide-react";
import moment from "moment";
import TransactionInfoCard from "../components/TransactionInfoCard.jsx"; 
import { useState } from "react";

const IncomeList = ({ transactions,onDelete, onDownload, onEmail }) => {
  const [loading, setLoading] = useState(false);
  const handleEmail = async () => {
  setLoading(true);
  try {
    await onEmail();
  } finally {
    setLoading(false);
  }
};

const handleDownload = async () => {
  setLoading(true);
  try {
    await onDownload();
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold text-gray-800">Income Sources</h5>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="card-btn"
            disabled={loading}
             onClick={handleEmail}
          >
           {loading ? (
  <>
    <LoaderCircle className="h-4 w-4 animate-spin" />
    Emailing...
  </>
) : (
  <>
    <Mail size={15} className="text-base" />
    Email
  </>
)}
          </button>

          <button
            type="button"
            className="card-btn"
            disabled={loading}
            onClick={handleDownload}
          >
           {loading ? (
  <>
    <LoaderCircle className="w-4 h-4 animate-spin" />
    Downloading...
  </>
) : (
  <>
    <Download size={15} className="text-base" />
    Download
  </>
)} 
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
  {/* display the incomes */}
  {transactions?.map((income) => (
  <TransactionInfoCard
    key={income.id}
    title={income.name}
    icon={income.icon}
    date={moment(income.date).format("Do MMM YYYY")}
    amount={income.amount}
    type="income"
    onDelete={() => onDelete(income.id)}
  />
))}
</div>
    </div>
  );
};

export default IncomeList;