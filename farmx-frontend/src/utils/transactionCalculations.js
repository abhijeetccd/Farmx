export const calculateTotals = (transactions) => {
  const totals = transactions.reduce(
    (acc, t) => ({
      bags: acc.bags + (Number(t.bags) || 0),
      weight: acc.weight + (Number(t.weight) || 0),
      deduction: acc.deduction + (Number(t.deduction) || 0),
      net_weight: acc.net_weight + (Number(t.net_weight) || 0),
      amount: acc.amount + (Number(t.amount) || 0),
      expenses: acc.expenses + (Number(t.expenses) || 0),
      final_amount: acc.final_amount + (Number(t.final_amount) || 0),
    }),
    {
      bags: 0,
      weight: 0,
      deduction: 0,
      net_weight: 0,
      amount: 0,
      expenses: 0,
      final_amount: 0,
    }
  );

  // Calculate commission
  totals.commission = Number((totals.weight * 0.8).toFixed(2));
  // Update final amount to include commission
  totals.final_total = totals.final_amount + totals.commission;

  return totals;
};
