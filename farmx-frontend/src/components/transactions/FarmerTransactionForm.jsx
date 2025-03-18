import { useState, useEffect } from "react";
import { farmerService } from "../../services/farmer.service";
import { transactionService } from "../../services/transaction.service";
import Modal from "../common/Modal";

const FarmerTransactionForm = ({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
}) => {
  const initialState = {
    date: new Date().toISOString().split("T")[0],
    challan_no: "",
    vendor_id: "",
    vendor_type: "farmer",
    bags: "",
    weight: "",
    deduction_per_bag: "2",
    deduction: "0",
    net_weight: "",
    rate: "",
    amount: "",
    expenses: "0",
    final_amount: "",
    payment_status: "pending",
    remarks: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFarmers();
    if (editData) {
      setFormData({
        ...editData,
        date:
          editData.date?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      });
    }
  }, [editData]);

  // Recalculate dependent fields whenever primary fields change
  useEffect(() => {
    calculateDerivedValues();
  }, [
    formData.bags,
    formData.weight,
    formData.deduction_per_bag,
    formData.rate,
    formData.expenses,
  ]);

  const calculateDerivedValues = () => {
    const bags = parseFloat(formData.bags) || 0;
    const weight = parseFloat(formData.weight) || 0;
    const deductionPerBag = parseFloat(formData.deduction_per_bag) || 0;
    const rate = parseFloat(formData.rate) || 0;
    const expenses = parseFloat(formData.expenses) || 0;

    // Calculate deduction
    const deduction = bags * deductionPerBag;

    // Calculate net weight
    const netWeight = Math.max(weight - deduction, 0);

    // Calculate amount
    const amount = netWeight * rate;

    // Calculate final amount
    const finalAmount = Math.max(amount - expenses, 0);

    setFormData((prev) => ({
      ...prev,
      deduction: deduction.toFixed(2),
      net_weight: netWeight.toFixed(2),
      amount: amount.toFixed(2),
      final_amount: finalAmount.toFixed(2),
    }));
  };

  const fetchFarmers = async () => {
    try {
      const response = await farmerService.getAll();
      setFarmers(response.data);
    } catch (err) {
      setError("शेतकरी माहिती लोड करण्यात अयशस्वी");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Convert string values to numbers for numeric fields
      const numericFields = [
        "bags",
        "weight",
        "deduction_per_bag",
        "deduction",
        "net_weight",
        "rate",
        "amount",
        "expenses",
        "final_amount",
      ];

      const processedData = {
        ...formData,
        ...Object.fromEntries(
          numericFields.map((field) => [
            field,
            parseFloat(formData[field]) || 0,
          ])
        ),
      };

      if (editData) {
        await transactionService.update(editData.id, processedData);
      } else {
        await transactionService.create(processedData);
      }

      setFormData(initialState);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editData
            ? "व्यवहार अपडेट करण्यात अयशस्वी"
            : "व्यवहार जोडण्यात अयशस्वी")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "व्यवहार संपादित करा" : "नवीन व्यवहार"}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Field */}
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

          {/* Farmer Select */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              शेतकरी *
            </label>
            <select
              name="vendor_id"
              value={formData.vendor_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">निवडा</option>
              {farmers.map((farmer) => (
                <option key={farmer.id} value={farmer.id}>
                  {farmer.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bags Input */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              डाग *
            </label>
            <input
              type="number"
              name="bags"
              value={formData.bags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              min="0"
            />
          </div>

          {/* Weight Input */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              वजन *
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Deduction Per Bag Input */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              प्रति डाग घट
            </label>
            <input
              type="number"
              name="deduction_per_bag"
              value={formData.deduction_per_bag}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="0.1"
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

          {/* Expenses Input */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              खर्च
            </label>
            <input
              type="number"
              name="expenses"
              value={formData.expenses}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="0.01"
            />
          </div>

          {/* Payment Status Select */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              स्थिती *
            </label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="pending">बाकी</option>
              <option value="paid">पूर्ण</option>
            </select>
          </div>
        </div>

        {/* Hidden Calculated Fields */}
        <input type="hidden" name="deduction" value={formData.deduction} />
        <input type="hidden" name="net_weight" value={formData.net_weight} />
        <input type="hidden" name="amount" value={formData.amount} />
        <input
          type="hidden"
          name="final_amount"
          value={formData.final_amount}
        />

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

        {/* Summary Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">एकूण घट:</span>{" "}
              {parseFloat(formData.deduction).toFixed(2)} kg
            </div>
            <div>
              <span className="font-semibold">पक्के वजन:</span>{" "}
              {parseFloat(formData.net_weight).toFixed(2)} kg
            </div>
            <div>
              <span className="font-semibold">रक्कम:</span> ₹{" "}
              {parseFloat(formData.amount).toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">दिलेली रक्कम:</span> ₹{" "}
              {parseFloat(formData.final_amount).toFixed(2)}
            </div>
          </div>
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

export default FarmerTransactionForm;
