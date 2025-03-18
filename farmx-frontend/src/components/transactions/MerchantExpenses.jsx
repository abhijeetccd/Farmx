import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { merchantExpenseService } from "../../services/merchant_expense.service";
import MerchantExpenseForm from "./MerchantExpenseForm";

const MerchantExpenses = ({ expenses, onRefresh, date, merchantId }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleAdd = async (formData) => {
    try {
      await merchantExpenseService.create({
        ...formData,
        date,
        vendor_id: merchantId,
      });
      onRefresh();
      setSelectedExpense(null);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const handleEdit = async (formData) => {
    try {
      await merchantExpenseService.update(selectedExpense.id, {
        ...formData,
        date,
        vendor_id: merchantId,
      });
      onRefresh();
      setSelectedExpense(null);
    } catch (err) {
      console.error("Error updating expense:", err);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("तुम्हाला खात्री आहे की तुम्ही हा खर्च हटवू इच्छिता?")
    ) {
      return;
    }

    try {
      await merchantExpenseService.delete(id);
      onRefresh();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const openForm = (expense = null) => {
    setSelectedExpense(expense);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedExpense(null);
  };

  const total = expenses.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">खर्च</h3>
        <button
          type="button"
          onClick={() => openForm()}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          नवीन खर्च
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                वर्णन
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                रक्कम
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                कृती
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {expense.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  ₹{parseFloat(expense.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openForm(expense)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                एकूण
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                ₹{total.toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <MerchantExpenseForm
        isOpen={showForm}
        onClose={closeForm}
        onSuccess={selectedExpense ? handleEdit : handleAdd}
        expense={selectedExpense}
      />
    </div>
  );
};

export default MerchantExpenses;
