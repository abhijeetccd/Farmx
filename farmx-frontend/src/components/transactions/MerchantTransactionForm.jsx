import { useState, useEffect } from "react";
import { merchantService } from "../../services/merchant.service";
import { merchantTransactionService } from "../../services/merchant_transaction.service";
import Modal from "../common/Modal";
import { transactionService } from "../../services/transaction.service";

const MerchantTransactionForm = ({
  isOpen,
  onClose,
  onSuccess,
  transaction,
}) => {
  const initialState = {
    vendor_id: "",
    transaction_id: transaction?.id || null,
    farmer_name: transaction?.vendor?.name || "",
    bags: transaction?.bags || "",
    weight: transaction?.weight || "",
    deduction_per_bag: transaction?.deduction_per_bag || "2",
    deduction: transaction?.deduction || "0",
    net_weight: transaction?.net_weight || "",
    rate: transaction?.rate || "",
    amount: transaction?.amount || "",
    date: new Date().toISOString().split("T")[0],
    remarks: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMerchants();
    if (transaction) {
      setFormData({
        ...initialState,
        transaction_id: transaction.id,
        farmer_name: transaction.vendor?.name || "",
        bags: transaction.bags,
        weight: transaction.weight,
        deduction_per_bag: transaction.deduction_per_bag,
        deduction: transaction.deduction,
        net_weight: transaction.net_weight,
      });
    }
  }, [transaction]);

  const fetchMerchants = async () => {
    try {
      const response = await merchantService.getAll();
      setMerchants(response.data.filter((m) => m.type === "merchant"));
    } catch (err) {
      setError("व्यापारी माहिती लोड करण्यात अयशस्वी");
    }
  };

  useEffect(() => {
    calculateDerivedValues();
  }, [
    formData.bags,
    formData.weight,
    formData.deduction_per_bag,
    formData.rate,
  ]);

  const calculateDerivedValues = () => {
    const bags = parseFloat(formData.bags) || 0;
    const deductionPerBag = parseFloat(formData.deduction_per_bag) || 0;
    const weight = parseFloat(formData.weight) || 0;
    const rate = parseFloat(formData.rate) || 0;

    // Calculate deduction
    const deduction = bags * deductionPerBag;

    // Calculate net weight
    const netWeight = Math.max(weight - deduction, 0);

    // Calculate amount
    const amount = netWeight * rate;

    setFormData((prev) => ({
      ...prev,
      deduction: deduction.toFixed(2),
      net_weight: netWeight.toFixed(2),
      amount: amount.toFixed(2),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First create merchant transaction
      const merchantTransactionResponse =
        await merchantTransactionService.create({
          ...formData,
          // Convert string values to numbers
          bags: parseFloat(formData.bags),
          weight: parseFloat(formData.weight),
          deduction_per_bag: parseFloat(formData.deduction_per_bag),
          deduction: parseFloat(formData.deduction),
          net_weight: parseFloat(formData.net_weight),
          rate: parseFloat(formData.rate),
          amount: parseFloat(formData.amount),
        });

      // Then update the original transaction with merchant_vendor_id

      if (transaction?.id) {
        await transactionService.update(transaction.id, {
          merchant_vendor_id: formData.vendor_id,
        });
      }

      if (onSuccess) {
        onSuccess(merchantTransactionResponse.data);
      }
      onClose();
    } catch (err) {
      console.error("Error creating merchant transaction:", err);
      setError(
        err.response?.data?.message || err.message || "व्यवहार जोडण्यात अयशस्वी"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="व्यापारी व्यवहार">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Merchant Select */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              व्यापारी *
            </label>
            <select
              name="vendor_id"
              value={formData.vendor_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">निवडा</option>
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              दिनांक *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Rate Input */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              भाव *
            </label>
            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Summary Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">शेतकरी:</span>{" "}
              {formData.farmer_name}
            </div>
            <div>
              <span className="font-semibold">डाग:</span> {formData.bags}
            </div>
            <div>
              <span className="font-semibold">वजन:</span> {formData.weight} kg
            </div>
            <div>
              <span className="font-semibold">घट:</span> {formData.deduction} kg
            </div>
            <div>
              <span className="font-semibold">पक्के वजन:</span>{" "}
              {formData.net_weight} kg
            </div>
            <div>
              <span className="font-semibold">रक्कम:</span> ₹{formData.amount}
            </div>
          </div>
        </div>

        {/* Remarks Textarea */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            टीप
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            रद्द करा
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "जतन करत आहे..." : "जतन करा"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MerchantTransactionForm;
