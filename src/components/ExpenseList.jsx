import React from 'react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) return <p>No expenses yet.</p>;
  return (
    <ul className="expense-list">
      {expenses.map((expense, idx) => (
        <li key={idx} className="expense-item">
          <span>{formatDate(expense.date)}</span>
          <span>{expense.description}</span>
          <span>₹{expense.amount}</span>
          <div className="expense-actions">
            <button onClick={() => onEdit(idx)}>Edit</button>
            <button onClick={() => onDelete(idx)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
} 