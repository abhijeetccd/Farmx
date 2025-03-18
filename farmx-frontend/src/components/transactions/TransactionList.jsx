import { useState } from "react";
import FarmerTransactionList from "./FarmerTransactionList";
import MerchantTransactionList from "./MerchantTransactionList";

const TransactionList = () => {
  const [activeTab, setActiveTab] = useState("farmer"); // "farmer" or "merchant"

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("farmer")}
            className={`${
              activeTab === "farmer"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
          >
            शेतकरी व्यवहार
          </button>
          <button
            onClick={() => setActiveTab("merchant")}
            className={`${
              activeTab === "merchant"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
          >
            व्यापारी व्यवहार
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "farmer" ? (
        <FarmerTransactionList />
      ) : (
        <MerchantTransactionList />
      )}
    </div>
  );
};

export default TransactionList;
