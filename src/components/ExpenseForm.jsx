import React, { useState, useEffect } from 'react';

const initialFormState = {
  amount: '',
  description: '',
  date: '',
};

export default function ExpenseForm({ onSubmit, initialData = initialFormState }) {
  const [form, setForm] = useState(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.description || !form.date) return;
    onSubmit(form);
    setForm(initialFormState);
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />
      <button type="submit">{initialData === initialFormState ? 'Add Expense' : 'Update Expense'}</button>
    </form>
  );
} 