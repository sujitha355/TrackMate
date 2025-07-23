import React, { useState } from 'react';

export default function SalaryForm({ salary, onSubmit }) {
  const [input, setInput] = useState(salary || '');

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input || isNaN(input) || Number(input) < 0) return;
    onSubmit(Number(input));
  };

  return (
    <form onSubmit={handleSubmit} className="salary-form" style={{ marginBottom: 24 }}>
      <input
        type="number"
        min="0"
        placeholder="Enter your monthly salary"
        value={input}
        onChange={handleChange}
        required
        style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginRight: 8 }}
      />
      <button type="submit" style={{ padding: '8px 16px', borderRadius: 6, background: '#3182ce', color: '#fff', border: 'none' }}>
        {salary ? 'Update Salary' : 'Set Salary'}
      </button>
    </form>
  );
} 