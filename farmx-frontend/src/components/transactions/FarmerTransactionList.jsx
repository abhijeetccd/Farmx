import { useState, useEffect, useRef } from "react";
import { transactionService } from "../../services/transaction.service";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import FarmerTransactionForm from "./FarmerTransactionForm";
import ConfirmationModal from "../common/ConfirmationModal";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";
import MerchantTransactionForm from "./MerchantTransactionForm";
import FarmerTransactionPrint from "./FarmerTransactionPrint";

const FarmerTransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });
  const [showMerchantForm, setShowMerchantForm] = useState(false);
  const [selectedTransactionForMerchant, setSelectedTransactionForMerchant] = useState(null);
  const [showRemoveMerchantConfirmation, setShowRemoveMerchantConfirmation] = useState(false);
  const [transactionToRemoveMerchant, setTransactionToRemoveMerchant] = useState(null);

  // Added for village filter
  const [villageFilter, setVillageFilter] = useState("");

  // Extract unique villages (format: 1-pune, 3-mumbai)
  const uniqueVillages = Array.from(
    new Set(
      transactions
        .map((t) => t.vendor?.address)
        .filter((v) => v && typeof v === "string")
    )
  ).map((village) => {
    const [id, ...nameParts] = village.split("-");
    return { id: id.trim(), name: nameParts.join("-").trim(), raw: village };
  });

  // const [transactions, setTransactions] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [searchQuery, setSearchQuery] = useState("");
  // const [showForm, setShowForm] = useState(false);
  // const [selectedTransaction, setSelectedTransaction] = useState(null);
  // const [showFilters, setShowFilters] = useState(false);
  // const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  // const [transactionToDelete, setTransactionToDelete] = useState(null);
  // const [dateFilter, setDateFilter] = useState({
  //   start_date: new Date().toISOString().split("T")[0],
  //   end_date: new Date().toISOString().split("T")[0],
  // });
  // const [showMerchantForm, setShowMerchantForm] = useState(false);
  // const [selectedTransactionForMerchant, setSelectedTransactionForMerchant] =
  //   useState(null);
  // const [showRemoveMerchantConfirmation, setShowRemoveMerchantConfirmation] =
  //   useState(false);


  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getAll({
        vendor_type: "farmer",
        start_date: dateFilter.start_date,
        end_date: dateFilter.end_date,
      });
      setTransactions(response.data);
      setError(null);
    } catch (err) {
      setError("व्यवहार माहिती लोड करण्यात अयशस्वी");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [dateFilter]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.vendor?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.amount?.toString().includes(searchQuery);

    // Village filter logic
    const matchesVillage =
      !villageFilter ||
      (transaction.vendor?.address && transaction.vendor.address.startsWith(villageFilter + "-"));

    return matchesSearch && matchesVillage;
  });

  console.log(filteredTransactions);

  const handleFormClose = () => {
    setSelectedTransaction(null);
    setShowForm(false);
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowForm(true);
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await transactionService.delete(transactionToDelete.id);
      fetchTransactions();
      setShowDeleteConfirmation(false);
    } catch (err) {
      setError("व्यवहार काढून टाकण्यात अयशस्वी");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSellClick = (transaction) => {
    setSelectedTransactionForMerchant(transaction);
    setShowMerchantForm(true);
  };

  const handleRemoveMerchantClick = (transaction) => {
    setTransactionToRemoveMerchant(transaction);
    setShowRemoveMerchantConfirmation(true);
  };

  const handleRemoveMerchantConfirm = async () => {
    try {
      await transactionService.update(transactionToRemoveMerchant.id, {
        merchant_vendor_id: null,
      });
      fetchTransactions();
      setShowRemoveMerchantConfirmation(false);
      setTransactionToRemoveMerchant(null);
    } catch (err) {
      console.error("Error removing merchant:", err);
      setError("व्यापारी काढून टाकण्यात अयशस्वी");
    }
  };

  const handlePrint = () => {
    const printContent = document.createElement("div");
    const printTemplate = FarmerTransactionPrint({
      transactions: filteredTransactions,
      dateFilter,
    });

    printContent.innerHTML = printTemplate.getTemplate();

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  if (loading) return <div className="text-center py-4">लोड करत आहे...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">शेतकरी व्यवहार</h1>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              प्रिंट करा
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              नवीन व्यवहार
            </button>
          </div>
        </div>

        {/* Date Filter */}
        <div className="mt-4 flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              पासून
            </label>
            <input
              type="date"
              name="start_date"
              value={dateFilter.start_date}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              पर्यंत
            </label>
            <input
              type="date"
              name="end_date"
              value={dateFilter.end_date}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Village Filter Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">गाव</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={villageFilter}
              onChange={e => setVillageFilter(e.target.value)}
            >
              <option value="">सर्व गावे</option>
              {uniqueVillages.map(v => (
                <option key={v.id} value={v.id}>{v.id}-{v.name} </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  अनु
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  व्यापारी
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  दिनांक
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  सौदकरी नाव
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  डाग
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  वजन
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  घट
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  पक्के
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  भाव
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  रक्कम
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  खर्च
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  दिलेली रक्कम
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  स्थिती
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  शेरा
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  शेरा
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 transition-colors "
                  // onClick={() => handleEdit(transaction)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.merchant_vendor_id ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">
                          {transaction.merchant?.name}
                        </span>
                        <button
                          onClick={() => handleRemoveMerchantClick(transaction)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSellClick(transaction)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        विक्री
                      </button>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString("mr-IN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.vendor?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.bags}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.weight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.deduction}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.net_weight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{transaction.rate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{transaction.expenses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{transaction.final_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.payment_status === "paid" ? "पूर्ण" : "बाकी"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="p-2 hover:bg-gray-100 rounded-full">
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(transaction);
                              }}
                              className={`${
                                active ? "bg-gray-100" : ""
                              } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                            >
                              <PencilSquareIcon className="h-4 w-4 mr-2" />
                              संपादित करा
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(transaction);
                              }}
                              className={`${
                                active ? "bg-red-50" : ""
                              } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                            >
                              <TrashIcon className="h-4 w-4 mr-2" />
                              काढून टाका
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results Message */}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">कोणताही व्यवहार आढळला नाही</p>
        </div>
      )}

      {/* Form Modal */}
      <FarmerTransactionForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSuccess={() => {
          handleFormClose();
          fetchTransactions();
        }}
        editData={selectedTransaction}
      />

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteConfirm}
        title="व्यवहार काढून टाका"
        message={
          transactionToDelete
            ? `तुम्हाला खात्री आहे की तुम्ही हा व्यवहार काढून टाकू इच्छिता?`
            : ""
        }
        confirmText="काढून टाका"
        cancelText="रद्द करा"
        type="danger"
      />

      <MerchantTransactionForm
        isOpen={showMerchantForm}
        onClose={() => {
          setSelectedTransactionForMerchant(null);
          setShowMerchantForm(false);
        }}
        onSuccess={() => {
          setSelectedTransactionForMerchant(null);
          setShowMerchantForm(false);
          fetchTransactions();
        }}
        transaction={selectedTransactionForMerchant}
      />

      <ConfirmationModal
        isOpen={showRemoveMerchantConfirmation}
        onClose={() => {
          setTransactionToRemoveMerchant(null);
          setShowRemoveMerchantConfirmation(false);
        }}
        onConfirm={handleRemoveMerchantConfirm}
        title="व्यापारी काढून टाका"
        message={
          transactionToRemoveMerchant
            ? `तुम्हाला खात्री आहे की तुम्ही ${transactionToRemoveMerchant.merchant?.name} व्यापारी काढून टाकू इच्छिता?`
            : ""
        }
        confirmText="काढून टाका"
        cancelText="रद्द करा"
        type="danger"
      />
    </div>
  );
};

export default FarmerTransactionList;
