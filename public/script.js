document.addEventListener('DOMContentLoaded', function() {
    const newExpenseBtn = document.getElementById('new-expense-btn');
    const newExpenseForm = document.getElementById('new-expense-form');

    if (newExpenseBtn && newExpenseForm) {
        newExpenseBtn.addEventListener('click', function() {
            newExpenseForm.style.display = newExpenseForm.style.display === 'none' ? 'block' : 'none';
        });
    }
});