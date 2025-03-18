import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { XMarkIcon } from "@heroicons/react/24/outline";

const PrintPreviewModal = ({
  isOpen,
  onClose,
  transactions,
  expenses,
  merchant,
  date,
  totals,
  expenseTotal,
  finalTotal,
}) => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${merchant?.name}_${date}`,

    onBeforeGetContent: () => {
      if (!componentRef.current) {
        return Promise.reject("Print content not ready");
      }
      return Promise.resolve();
    },
    onPrintError: (error) => {
      console.error("Print failed:", error);
    },
  });

  if (!isOpen) return null;

  // Shared content component to avoid duplication
  const PrintContent = () => (
    <>
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold">व्यापारी व्यवहार</h2>
        <p className="text-gray-600">
          {merchant?.name} - {new Date(date).toLocaleDateString("mr-IN")}
        </p>
      </div>

      {/* Transactions Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2 text-left">अनु</th>
              <th className="border p-2 text-left">शेतकरी</th>
              <th className="border p-2 text-left">डाग</th>
              <th className="border p-2 text-left">वजन</th>
              <th className="border p-2 text-left">घट</th>
              <th className="border p-2 text-left">पक्के वजन</th>
              <th className="border p-2 text-left">भाव</th>
              <th className="border p-2 text-left">रक्कम</th>
              <th className="border p-2 text-left">टीप</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={t.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{t.farmer_name}</td>
                <td className="border p-2">{t.bags}</td>
                <td className="border p-2">{t.weight}</td>
                <td className="border p-2">{t.deduction}</td>
                <td className="border p-2">{t.net_weight}</td>
                <td className="border p-2">₹{t.rate}</td>
                <td className="border p-2">₹{t.amount}</td>
                <td className="border p-2">{t.remarks}</td>
              </tr>
            ))}
            {/* Totals row */}
            <tr className="bg-gray-50 font-semibold">
              <td className="border p-2" colSpan="2">
                एकूण
              </td>
              <td className="border p-2">{totals.bags}</td>
              <td className="border p-2">{totals.weight.toFixed(2)}</td>
              <td className="border p-2">{totals.deduction.toFixed(2)}</td>
              <td className="border p-2">{totals.net_weight.toFixed(2)}</td>
              <td className="border p-2"></td>
              <td className="border p-2">₹{totals.amount.toFixed(2)}</td>
              <td className="border p-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Expenses Table */}
      {expenses.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">खर्च विवरण</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">अनु</th>
                <th className="border p-2 text-left">विवरण</th>
                <th className="border p-2 text-left">रक्कम</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, index) => (
                <tr key={e.id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{e.description}</td>
                  <td className="border p-2">₹{e.amount}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="border p-2" colSpan="2">
                  एकूण खर्च
                </td>
                <td className="border p-2">₹{expenseTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Final Summary */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-right">
          <div className="text-gray-600">एकूण रक्कम:</div>
          <div className="font-semibold">₹{totals.amount.toFixed(2)}</div>

          <div className="text-gray-600">एकूण खर्च:</div>
          <div className="font-semibold">₹{expenseTotal.toFixed(2)}</div>

          <div className="text-gray-600">
            कमिशन ({totals.weight.toFixed(2)} kg × ₹0.8):
          </div>
          <div className="font-semibold">₹{totals.commission.toFixed(2)}</div>

          <div className="text-gray-600 text-lg font-bold">एकूण देय रक्कम:</div>
          <div className="text-lg font-bold">
            ₹{(totals.final_total + expenseTotal).toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Hidden printable content */}
      <div style={{ display: "none" }}>
        <div ref={componentRef} className="print-content p-8">
          <PrintContent />
        </div>
      </div>

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="relative bg-white rounded-lg max-w-4xl w-full">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">प्रिंट पूर्वावलोकन</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Modal Body - Preview */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: "70vh" }}>
            <div className="bg-white p-8">
              <PrintContent />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-4 p-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              बंद करा
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              प्रिंट करा
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewModal;
