const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

const pool = new Pool({
    user: 'postgres',     // Replace with your PostgreSQL username
    host: 'localhost',       // Replace with your PostgreSQL host if different
    database: 'expense_db', // Replace with your database name
    password: 'abc@123', // Replace with your PostgreSQL password
    port: 5432,             // Default PostgreSQL port
});

const query = async (text, params) => {
    const client = await pool.connect();
    try {
        return await client.query(text, params);
    } finally {
        client.release();
    }
};

// Routes

// GET - Display all expenses
app.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM expenses ORDER BY date DESC');
        res.render('layout', {
            title: 'Expense List',
            body: 'index',
            expenses: result.rows
        });
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).send('Error fetching data');
    }
});

// GET - Display the edit form
app.get('/expenses/:id/edit', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await query('SELECT * FROM expenses WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.render('layout', {
                title: 'Edit Expense',
                body: 'edit',
                expense: result.rows[0]
            });
        } else {
            res.status(404).send('Expense not found');
        }
    } catch (err) {
        console.error('Error fetching expense for edit:', err);
        res.status(500).send('Error fetching data');
    }
});

// GET - Dashboard with expense analysis
app.get('/dashboard', async (req, res) => {
    try {
        // Basic analysis: Total expenses
        const totalExpensesResult = await query('SELECT SUM(amount) AS total FROM expenses');
        const totalExpenses = totalExpensesResult.rows[0]?.total || 0;

        // Analysis by a simple category (you might need to add a category column)
        const categoryAnalysisResult = await query(`
            SELECT description AS category, SUM(amount) AS total
            FROM expenses
            GROUP BY description
            ORDER BY total DESC
        `);
        const categoryData = categoryAnalysisResult.rows;

        res.render('layout', {
            title: 'Expense Dashboard',
            body: 'dashboard',
            totalExpenses: totalExpenses,
            categoryData: categoryData
        });
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        res.status(500).send('Error fetching dashboard data');
    }
});

// POST - Add a new expense
app.post('/expenses', async (req, res) => {
    const { description, amount, date } = req.body;
    try {
        await query('INSERT INTO expenses (description, amount, date) VALUES ($1, $2, $3)', [description, parseFloat(amount), date || new Date()]);
        res.redirect('/');
    } catch (err) {
        console.error('Error adding expense:', err);
        res.status(500).send('Error saving data');
    }
});

// PUT - Update an existing expense
app.put('/expenses/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { description, amount, date } = req.body;
    try {
        await query('UPDATE expenses SET description = $1, amount = $2, date = $3 WHERE id = $4', [description, parseFloat(amount), date, id]);
        res.redirect('/');
    } catch (err) {
        console.error('Error updating expense:', err);
        res.status(500).send('Error updating data');
    }
});

// DELETE - Delete an expense
app.delete('/expenses/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await query('DELETE FROM expenses WHERE id = $1', [id]);
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting expense:', err);
        res.status(500).send('Error deleting data');
    }
});

// GET - Monthly Expense Report
app.get('/monthly', async (req, res) => {
    try {
        const monthlyExpensesResult = await query(`
            SELECT
                TO_CHAR(date, 'YYYY-MM') AS month,
                SUM(amount) AS total
            FROM expenses
            GROUP BY TO_CHAR(date, 'YYYY-MM')
            ORDER BY TO_CHAR(date, 'YYYY-MM')
        `);
        const monthlyData = monthlyExpensesResult.rows;

        res.render('layout', {
            title: 'Monthly Expense Report',
            body: 'monthly',
            monthlyData: monthlyData // You might not need to pass this directly to EJS if using fetch
        });
    } catch (err) {
        console.error('Error fetching monthly expenses:', err);
        res.status(500).send('Error fetching monthly expenses');
    }
});

// GET - Monthly Expense Data for Chart
app.get('/monthly/data', async (req, res) => {
    try {
        const monthlyExpensesResult = await query(`
            SELECT
                TO_CHAR(date, 'YYYY-MM') AS month,
                SUM(amount) AS total
            FROM expenses
            GROUP BY TO_CHAR(date, 'YYYY-MM')
            ORDER BY TO_CHAR(date, 'YYYY-MM')
        `);
        const monthlyData = monthlyExpensesResult.rows;
        res.json(monthlyData);
    } catch (err) {
        console.error('Error fetching monthly expenses data:', err);
        res.status(500).json({ error: 'Failed to fetch monthly expenses data' });
    }
});

// GET - Daily Expense Data for a Specific Month
app.get('/monthly/daily/:month', async (req, res) => {
    const selectedMonth = req.params.month;
    try {
        const dailyExpensesResult = await query(`
            SELECT
                TO_CHAR(date, 'YYYY-MM-DD') AS day,
                SUM(amount) AS total
            FROM expenses
            WHERE TO_CHAR(date, 'YYYY-MM') = $1
            GROUP BY TO_CHAR(date, 'YYYY-MM-DD')
            ORDER BY TO_CHAR(date, 'YYYY-MM-DD')
        `, [selectedMonth]);
        const dailyData = dailyExpensesResult.rows;
        res.json(dailyData);
    } catch (err) {
        console.error('Error fetching daily expenses data:', err);
        res.status(500).json({ error: 'Failed to fetch daily expenses data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// ... other routes ...

// ... other routes ...