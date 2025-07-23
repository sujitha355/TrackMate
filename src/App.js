import React, { useState } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import SalaryForm from './components/SalaryForm';
import ReminderForm from './components/ReminderForm';
import ReminderList from './components/ReminderList';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [salary, setSalary] = useState(0);
  const [reminders, setReminders] = useState([]);
  const [editingReminderIndex, setEditingReminderIndex] = useState(null);

  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const remaining = salary - totalExpenses;

  const handleAddOrUpdate = (expense) => {
    if (editingIndex !== null) {
      setExpenses((prev) => prev.map((e, i) => (i === editingIndex ? expense : e)));
      setEditingIndex(null);
    } else {
      setExpenses((prev) => [...prev, expense]);
    }
  };

  const handleEdit = (idx) => {
    setEditingIndex(idx);
  };

  const handleDelete = (idx) => {
    setExpenses((prev) => prev.filter((_, i) => i !== idx));
    if (editingIndex === idx) setEditingIndex(null);
  };

  const handleAddReminder = (reminder) => {
    if (editingReminderIndex !== null) {
      setReminders((prev) => prev.map((r, i) => (i === editingReminderIndex ? reminder : r)));
      setEditingReminderIndex(null);
    } else {
      setReminders((prev) => [...prev, reminder]);
    }
  };

  const handleEditReminder = (idx) => {
    setEditingReminderIndex(idx);
  };

  const handleDeleteReminder = (idx) => {
    setReminders((prev) => prev.filter((_, i) => i !== idx));
    if (editingReminderIndex === idx) setEditingReminderIndex(null);
  };

  const handlePaidReminder = (idx) => {
    const paid = reminders[idx];
    setExpenses((prev) => [
      ...prev,
      {
        amount: paid.amount,
        description: paid.description,
        date: paid.dueDate,
      },
    ]);

    // Handle recurring reminders
    if (paid.frequency && paid.frequency !== 'once') {
      const currentDate = new Date(paid.dueDate);
      let nextDate = new Date(currentDate);
      if (paid.frequency === 'monthly') {
        nextDate.setMonth(currentDate.getMonth() + 1);
      } else if (paid.frequency === 'quarterly') {
        nextDate.setMonth(currentDate.getMonth() + 3);
      } else if (paid.frequency === 'annually') {
        nextDate.setFullYear(currentDate.getFullYear() + 1);
      }
      // Format nextDate as yyyy-mm-dd
      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDate.getDate()).padStart(2, '0');
      const nextDueDate = `${yyyy}-${mm}-${dd}`;
      setReminders((prev) => [
        ...prev.filter((_, i) => i !== idx),
        {
          ...paid,
          dueDate: nextDueDate,
        },
      ]);
    } else {
      setReminders((prev) => prev.filter((_, i) => i !== idx));
    }
    if (editingReminderIndex === idx) setEditingReminderIndex(null);
  };

  return (
    <div className="App">
      <h1>TrackMate</h1>
      <SalaryForm salary={salary} onSubmit={setSalary} />
      <ExpenseForm
        onSubmit={handleAddOrUpdate}
        initialData={editingIndex !== null ? expenses[editingIndex] : undefined}
      />
      <ExpenseSummary expenses={expenses} salary={salary} remaining={remaining} />
      <h2>Reminders for Future Payments</h2>
      <ReminderForm
        onSubmit={handleAddReminder}
        initialData={editingReminderIndex !== null ? reminders[editingReminderIndex] : undefined}
      />
      <ReminderList
        reminders={reminders}
        onEdit={handleEditReminder}
        onDelete={handleDeleteReminder}
        onPaid={handlePaidReminder}
      />
      <h2>Transactions</h2>
      <ExpenseList
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
