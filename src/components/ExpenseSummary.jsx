import React from 'react';

export default function ExpenseSummary({ expenses, salary = 0, remaining = 0 }) {
  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return (
    <div className="expense-summary">
      <h2>Total Spent: ₹{total.toFixed(2)}</h2>
      <div style={{ marginBottom: 8 }}>
        <strong>Salary:</strong> ₹{salary.toFixed(2)}<br />
        <strong>Remaining Balance:</strong> ₹{remaining.toFixed(2)}
      </div>
    </div>
  );
} 