import { calculateTotals } from "../../utils/transactionCalculations";

const FarmerTransactionPrint = ({ transactions, dateFilter }) => {
  const totals = calculateTotals(transactions);

  const getTemplate = () => `
    <html>
      <head>
        <title>शेतकरी व्यवहार यादी</title>
        <style>
          body { 
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          table { 
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td { 
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th { 
            background-color: #f3f4f6;
          }
          .header { 
            text-align: center;
            margin-bottom: 20px;
          }
          @media print {
            @page { 
              size: landscape;
              margin: 15mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>शेतकरी व्यवहार यादी</h2>
          <p>दिनांक: ${dateFilter.start_date} ते ${dateFilter.end_date}</p>
        </div>
        <div style="font-weight: bold; margin-bottom: 8px;">
          पत्ता: ${Array.from(new Set(transactions.map(t => t.vendor?.address).filter(Boolean))).join(', ')}
        </div>
        <table>
          <thead>
            <tr>
              <th>अनु</th>
              <th>शेतकरी नाव</th>
              <th>मोबाईल नंबर</th>
              <th>डाग</th>
              <th>वजन</th>
              <th>घट</th>
              <th>पक्के वजन</th>
              <th>भाव</th>
              <th>रक्कम</th>
              <th>खर्च</th>
              <th>एकूण रक्कम</th>
              <th>खाते क्रमांक</th>
              <th>शेरा</th>

            </tr>
          </thead>
          <tbody>
            ${transactions
              .map(
                (t, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${t.vendor?.name || ""}</td>
                <td>${t.vendor?.phone_no || ""}</td>
                <td>${t.bags || 0}</td>
                <td>${Number(t.weight || 0).toFixed(2)}</td>
                <td>${Number(t.deduction || 0).toFixed(2)}</td>
                <td>${Number(t.net_weight || 0).toFixed(2)}</td>
                <td>${Number(t.rate || 0).toFixed(2)}</td>
                <td>${Number(t.amount || 0).toFixed(2)}</td>
                <td>${Number(t.expenses || 0).toFixed(2)}</td>
                <td>${Number(t.final_amount || 0).toFixed(2)}</td>
                <td>${t.vendor?.account_no || ""}</td>
                <td></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3"><strong>एकूण</strong></td>
              <td><strong>${totals.bags}</strong></td>
              <td><strong>${totals.weight.toFixed(2)}</strong></td>
              <td><strong>${totals.deduction.toFixed(2)}</strong></td>
              <td><strong>${totals.net_weight.toFixed(2)}</strong></td>
              <td></td>
              <td><strong>${totals.amount.toFixed(2)}</strong></td>

              <td><strong>${totals.expenses.toFixed(2)}</strong></td>
              <td><strong>${totals.final_amount.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `;

  return { getTemplate };
};

export default FarmerTransactionPrint;
