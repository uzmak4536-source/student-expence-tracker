// ── All expenses are stored in this array ──
let expenses = [];

// ── Grab HTML elements we need ──
const form          = document.getElementById('expenseForm');
const nameInput     = document.getElementById('expenseName');
const categoryInput = document.getElementById('expenseCategory');
const amountInput   = document.getElementById('expenseAmount');
const expenseBody   = document.getElementById('expenseBody');
const totalAmount   = document.getElementById('totalAmount');
const totalCount    = document.getElementById('totalCount');
const emptyState    = document.getElementById('emptyState');
const tableWrapper  = document.getElementById('tableWrapper');

// ── Category emoji map ──
const categoryEmoji = {
  'Food':          '🍔',
  'Transport':     '🚌',
  'Stationery':    '📚',
  'Entertainment': '🎮',
  'Health':        '💊',
  'Clothing':      '👕',
  'Other':         '📦'
};

// ── When the form is submitted ──
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Stop page from refreshing

  // Read values from inputs
  const name     = nameInput.value.trim();
  const category = categoryInput.value;
  const amount   = parseFloat(amountInput.value);

  // Basic check (HTML required handles most cases, but just to be safe)
  if (!name || !category || isNaN(amount) || amount <= 0) {
    alert('Please fill in all fields correctly.');
    return;
  }

  // Create an expense object
  const newExpense = {
    id:       Date.now(),   // unique id using current timestamp
    name:     name,
    category: category,
    amount:   amount
  };

  // Add it to the array
  expenses.push(newExpense);

  // Update the page
  renderTable();
  updateSummary();

  // Clear the form
  form.reset();
  nameInput.focus();
});

// ── Draw / Redraw the expense table ──
function renderTable() {
  // Clear existing rows
  expenseBody.innerHTML = '';

  if (expenses.length === 0) {
    // Show empty state, hide table
    emptyState.style.display = 'block';
    tableWrapper.style.display = 'none';
    return;
  }

  // Hide empty state, show table
  emptyState.style.display = 'none';
  tableWrapper.style.display = 'block';

  // Loop through each expense and create a table row
  expenses.forEach(function (expense, index) {
    const emoji = categoryEmoji[expense.category] || '📦';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHTML(expense.name)}</td>
      <td><span class="badge">${emoji} ${expense.category}</span></td>
      <td>₹${expense.amount.toFixed(2)}</td>
      <td>
        <button class="delete-btn" onclick="deleteExpense(${expense.id})">
          🗑 Delete
        </button>
      </td>
    `;
    expenseBody.appendChild(row);
  });
}

// ── Update the summary numbers at the top ──
function updateSummary() {
  // Add up all amounts
  const total = expenses.reduce(function (sum, expense) {
    return sum + expense.amount;
  }, 0);

  totalAmount.textContent = '₹' + total.toFixed(2);
  totalCount.textContent  = expenses.length;
}

// ── Delete a single expense by its id ──
function deleteExpense(id) {
  // Keep all expenses except the one with this id
  expenses = expenses.filter(function (expense) {
    return expense.id !== id;
  });

  // Update the page
  renderTable();
  updateSummary();
}

// ── Safety helper: prevent HTML injection in user input ──
function escapeHTML(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}
