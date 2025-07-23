import React from 'react';

function isDueOrOverdue(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  today.setHours(0,0,0,0);
  due.setHours(0,0,0,0);
  return due <= today;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}

export default function ReminderList({ reminders, onEdit, onDelete, onPaid }) {
  if (reminders.length === 0) return <p>No reminders set.</p>;
  return (
    <ul className="reminder-list">
      {reminders.map((reminder, idx) => (
        <li key={idx} className={`reminder-item${isDueOrOverdue(reminder.dueDate) ? ' due' : ''}`}>
          <span>{formatDate(reminder.dueDate)}</span>
          <span>{reminder.description}</span>
          <span>₹{reminder.amount}</span>
          <div className="reminder-actions">
            {isDueOrOverdue(reminder.dueDate) && <span style={{color: 'red', fontWeight: 600}}>(Due!)</span>}
            <button className="edit-btn" onClick={() => onEdit(idx)}>Edit</button>
            <button className="paid-btn" onClick={() => onPaid(idx)}>Paid?</button>
            <button onClick={() => onDelete(idx)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
} 