import React, { useState, useEffect } from 'react';

const initialFormState = {
  amount: '',
  description: '',
  dueDate: '',
  frequency: 'once',
};

export default function ReminderForm({ onSubmit, initialData = initialFormState }) {
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
    if (!form.amount || !form.description || !form.dueDate) return;
    onSubmit(form);
    setForm(initialFormState);
  };

  return (
    <form onSubmit={handleSubmit} className="reminder-form" style={{ marginBottom: 24 }}>
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
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        required
      />
      <select
        name="frequency"
        value={form.frequency}
        onChange={handleChange}
        required
        style={{ minWidth: 120 }}
      >
        <option value="once">Only Once</option>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="annually">Annually</option>
      </select>
      <button type="submit">{initialData === initialFormState ? 'Add Reminder' : 'Update Reminder'}</button>
    </form>
  );
} 