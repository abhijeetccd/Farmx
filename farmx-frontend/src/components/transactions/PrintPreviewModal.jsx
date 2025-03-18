import React, { useRef } from "react";

const PrintPreviewModal = ({
  isOpen,
  onClose,
  transactions,
  merchant,
  date,
  totals,
  expenses,
  expenseTotal,
  finalTotal,
}) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current;
    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>Print Preview</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2, h3 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid black; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            .summary { margin-top: 15px; font-size: 16px; font-weight: bold; }
            .final-total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 10px; }
            .border-top {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  text-align: right;
}

.text-gray {
  color: #4b5563;
}

.font-semibold {
  font-weight: 600;
}

.text-lg {
  font-size: 1.125rem;
}

.font-bold {
  font-weight: 700;
}

          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.print();
    newWin.close();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-40 ">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl shadow-lg">
        <div ref={printRef}>
          <h2 className="text-2xl font-bold">व्यापारी व्यवहार अहवाल</h2>
          <h3 className="text-lg">
            व्यापारी: {merchant?.name || "निवडलेला नाही"}
          </h3>
          <p>दिनांक: {new Date(date).toLocaleDateString("mr-IN")}</p>

          {/* Transactions Table */}
          <h3 className="text-lg mt-4">व्यवहारांची यादी</h3>
          <table className="border border-black w-full mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th>अनु</th>

                <th>शेतकरी</th>
                <th>डाग</th>
                <th>वजन</th>
                <th>घट</th>
                <th>पक्के</th>
                <th>भाव</th>
                <th>रक्कम</th>
                <th>शेरा</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={t.id} className="border">
                  <td>{index + 1}</td>
                  <td>{t.farmer_name}</td>
                  <td>{t.bags}</td>
                  <td>{t.weight}</td>
                  <td>{t.deduction}</td>
                  <td>{t.net_weight}</td>
                  <td>{t.rate}</td>
                  <td>{t.amount}</td>
                  <td>{t.remarks}</td>
                </tr>
              ))}
              {/* Transactions Total */}
              <tr className="bg-gray-300 font-bold">
                <td colSpan="2">एकूण</td>
                <td>{totals.bags.toFixed(0)}</td>
                <td>{totals.weight.toFixed(2)}</td>
                <td>{totals.deduction.toFixed(2)}</td>
                <td>{totals.net_weight.toFixed(2)}</td>
                <td></td>
                <td>{totals.amount.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* Expenses Table */}
          <h3 className="text-lg mt-4">खर्चाची यादी</h3>
          <table className="border border-black w-full mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th>अनु</th>
                <th>खर्चाचा प्रकार</th>
                <th>रक्कम</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, index) => (
                <tr key={e.id} className="border">
                  <td>{index + 1}</td>
                  <td>{e.description}</td>
                  <td>{Number(e.amount || 0).toFixed(2)}</td>
                </tr>
              ))}
              {/* Expense Total Row */}
              <tr className="bg-gray-300 font-bold">
                <td></td>
                <td>एकूण खर्च</td>
                <td>{Number(expenseTotal || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Final Amount After Expenses
          <p className="final-total mt-4">
            एकूण देय रक्कम: {finalTotal.toFixed(2)}
          </p> */}
          {/* Final Summary */}
          <div className="border-top">
            <div className="grid-container">
              <div className="text-gray">एकूण रक्कम:</div>
              <div className="text-gray">₹{totals.amount.toFixed(2)}</div>

              <div className="text-gray">एकूण खर्च:</div>
              <div className="text-gray">₹{expenseTotal.toFixed(2)}</div>

              <div className="text-gray">कमिशन:</div>
              <div className="text-gray">₹{totals.commission.toFixed(2)}</div>

              <div className="text-gray text-lg font-bold">एकूण देय रक्कम:</div>
              <div className="text-lg font-bold">₹{finalTotal}</div>
            </div>
          </div>
        </div>

        {/* Print & Close Buttons */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            प्रिंट करा
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            बंद करा
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewModal;
