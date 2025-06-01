import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import "./ReportDetails.css";

const ReportDetails = () => {
  const location = useLocation();
  const { category, chartType, timeRange, title, generatedData } = location.state || {};
  const [data, setData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({
    name: '',
    amount: '',
    type: 'expense',
    initialAmount: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Process the real data sent from the Report component
    if (generatedData) {
      setLoading(true);
      try {
        let processedData = [];

        // Format and transform data based on category
        switch (category) {
          case 'transactions':
            processedData = processTransactionData(generatedData);
            break;
          case 'savings':
            processedData = processSavingsData(generatedData);
            break;
          case 'loans':
            processedData = processLoanData(generatedData);
            break;
          case 'subscriptions':
            processedData = processSubscriptionData(generatedData);
            break;
          case 'budget':
            processedData = processBudgetData(generatedData);
            break;
          default:
            processedData = [];
        }

        setData(processedData);
      } catch (error) {
        console.error("Error processing report data:", error);
        setError("Failed to process report data");
      } finally {
        setLoading(false);
      }
    } else {
      // Fallback to mock data if no real data is available
      const mockData = getMockData(category);
      setData(mockData);
      setLoading(false);
    }
  }, [generatedData, category]);

  // Process transaction data for charting
  const processTransactionData = (transactionData) => {
    // Group by date or category based on chart type
    if (chartType === 'pie') {
      // Group by category for pie chart
      const categoryGroups = {};
      
      transactionData.forEach(transaction => {
        if (!transaction) return;
        const category = transaction.category || 'Other';
        const amount = transaction.amount || 0;
        
        if (!categoryGroups[category]) {
          categoryGroups[category] = 0;
        }
        categoryGroups[category] += amount;
      });
      
      // Convert to array format for charts
      return Object.keys(categoryGroups).map(category => ({
        name: category,
        amount: categoryGroups[category],
        id: category
      }));
    } else {
      // Group by date for bar/line charts
      const dateGroups = {};
      
      transactionData.forEach(transaction => {
        if (!transaction || !transaction.date) return;
        
        const date = new Date(transaction.date);
        const dateStr = date.toISOString().split('T')[0];
        
        if (!dateGroups[dateStr]) {
          dateGroups[dateStr] = {
            income: 0,
            expense: 0
          };
        }
        
        const amount = transaction.amount || 0;
        
        if (transaction.type === 'income') {
          dateGroups[dateStr].income += amount;
        } else {
          dateGroups[dateStr].expense += amount;
        }
      });
      
      // Convert to array format for charts
      return Object.keys(dateGroups).sort().map(dateStr => ({
        name: formatDateLabel(dateStr),
        income: dateGroups[dateStr].income,
        expense: dateGroups[dateStr].expense,
        id: dateStr
      }));
    }
  };

  // Process savings data for charting
  const processSavingsData = (savingsData) => {
    return savingsData.filter(saving => saving).map(saving => {
      const currentAmount = saving.currentAmount || saving.amount || 0;
      const targetAmount = saving.targetAmount || 0;
      let progress = saving.progress;
      
      if (progress === undefined || progress === null) {
        progress = targetAmount > 0 ? (currentAmount / targetAmount * 100) : 0;
      }
      
      return {
        name: saving.title || saving.name || 'Unnamed Saving',
        amount: currentAmount,
        target: targetAmount,
        progress: progress,
        id: saving._id || `saving-${Math.random()}`
      };
    });
  };

  // Process loan data for charting
  const processLoanData = (loanData) => {
    return loanData.filter(loan => loan).map(loan => {
      const amount = loan.remainingAmount || loan.amount || 0;
      return {
        name: loan.loanName || loan.name || 'Unnamed Loan',
        amount: amount,
        initialAmount: loan.initialAmount || amount,
        payment: loan.paymentAmount || 0,
        id: loan._id || `loan-${Math.random()}`
      };
    });
  };

  // Process subscription data for charting
  const processSubscriptionData = (subscriptionData) => {
    return subscriptionData.filter(sub => sub).map(sub => ({
      name: sub.name || sub.serviceName || 'Unnamed Subscription',
      amount: sub.amount || sub.cost || 0,
      billingCycle: sub.billingCycle || sub.cycle || 'monthly',
      id: sub._id || `subscription-${Math.random()}`
    }));
  };

  // Process budget data for charting
  const processBudgetData = (budgetData) => {
    return budgetData.filter(budget => budget).map(budget => {
      const allocated = budget.allocated || budget.amount || 0;
      return {
        name: budget.category || budget.name || 'Unnamed Budget',
        amount: allocated,
        spent: budget.spent || 0,
        remaining: allocated - (budget.spent || 0),
        id: budget._id || `budget-${Math.random()}`
      };
    });
  };

  // Format date for labels
  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Get mock data if no real data is available
  const getMockData = (category) => {
    const mockData = {
      loans: [
        { id: 1, name: 'Mortgage', amount: 4000, initialAmount: 5000 },
        { id: 2, name: 'Car Loan', amount: 3000, initialAmount: 3500 },
        { id: 3, name: 'Student Loan', amount: 2000, initialAmount: 2200 },
        { id: 4, name: 'Personal Loan', amount: 2780, initialAmount: 3000 },
        { id: 5, name: 'Credit Card', amount: 1890, initialAmount: 2000 },
      ],
      budget: [
        { id: 1, name: 'Food', amount: 4000, type: 'expense', initialAmount: 4000 },
        { id: 2, name: 'Transport', amount: 3000, type: 'expense', initialAmount: 3000 },
        { id: 3, name: 'Entertainment', amount: 2000, type: 'expense', initialAmount: 2000 },
        { id: 4, name: 'Bills', amount: 2780, type: 'expense', initialAmount: 2780 },
        { id: 5, name: 'Shopping', amount: 1890, type: 'expense', initialAmount: 1890 },
        { id: 6, name: 'Salary', amount: 15000, type: 'income', initialAmount: 15000 },
      ],
      transactions: [
        { id: 1, name: 'Income', amount: 4000, type: 'income' },
        { id: 2, name: 'Groceries', amount: 300, type: 'expense' },
        { id: 3, name: 'Rent', amount: 2000, type: 'expense' },
        { id: 4, name: 'Transportation', amount: 150, type: 'expense' },
        { id: 5, name: 'Entertainment', amount: 200, type: 'expense' },
      ],
      subscriptions: [
        { id: 1, name: 'Netflix', amount: 99.99 },
        { id: 2, name: 'Spotify', amount: 29.99 },
        { id: 3, name: 'Amazon Prime', amount: 49.99 },
        { id: 4, name: 'Disney+', amount: 34.99 },
        { id: 5, name: 'YouTube Premium', amount: 19.99 },
      ],
      savings: [
        { id: 1, name: 'Emergency Fund', amount: 5000, target: 10000, progress: 50 },
        { id: 2, name: 'Vacation', amount: 3000, target: 5000, progress: 60 },
        { id: 3, name: 'Retirement', amount: 10000, target: 100000, progress: 10 },
        { id: 4, name: 'Education', amount: 2500, target: 5000, progress: 50 },
        { id: 5, name: 'Investment', amount: 7500, target: 15000, progress: 50 },
      ],
    };

    return mockData[category] || [];
  };

  const handleAddEntry = () => {
    setNewEntry({
      name: '',
      amount: '',
      type: 'expense',
      initialAmount: ''
    });
    setShowAddModal(true);
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setNewEntry({
      name: entry.name,
      amount: entry.amount,
      type: entry.type,
      initialAmount: entry.initialAmount
    });
    setShowEditModal(true);
  };

  const handleNewEntryChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'amount' && { initialAmount: value })
    }));
  };

  const handleAddNewEntry = (e) => {
    e.preventDefault();
    const newEntryWithId = {
      ...newEntry,
      id: Date.now(),
      initialAmount: newEntry.amount
    };
    setData(prev => [...prev, newEntryWithId]);
    setNewEntry({ name: '', amount: '', type: 'expense', initialAmount: '' });
    setShowAddModal(false);
  };

  const handleUpdateEntry = (e) => {
    e.preventDefault();
    setData(prev => prev.map(entry => 
      entry.id === selectedEntry.id 
        ? { ...entry, ...newEntry }
        : entry
    ));
    setShowEditModal(false);
  };

  const handleDeleteEntry = (id) => {
    setData(prev => prev.filter(entry => entry.id !== id));
  };

  const handleIncreaseAmount = (id, amount) => {
    setData(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, amount: Number(entry.amount) + Number(amount) }
        : entry
    ));
  };

  const handleDecreaseAmount = (id, amount) => {
    setData(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, amount: Math.max(0, Number(entry.amount) - Number(amount)) }
        : entry
    ));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const renderChart = () => {
    try {
      switch (chartType) {
        case 'bar':
          return (
            <BarChart width={600} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {category === 'transactions' ? (
                <>
                  <Bar dataKey="income" fill="#4CAF50" name="Income" />
                  <Bar dataKey="expense" fill="#F44336" name="Expense" />
                </>
              ) : category === 'savings' ? (
                <>
                  <Bar dataKey="amount" fill="#2196F3" name="Current" />
                  <Bar dataKey="target" fill="#9C27B0" name="Target" />
                </>
              ) : (
                <Bar dataKey="amount" fill="#2196F3" />
              )}
            </BarChart>
          );
        
        case 'line':
          return (
            <LineChart width={600} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {category === 'transactions' ? (
                <>
                  <Line type="monotone" dataKey="income" stroke="#4CAF50" name="Income" />
                  <Line type="monotone" dataKey="expense" stroke="#F44336" name="Expense" />
                </>
              ) : category === 'savings' ? (
                <>
                  <Line type="monotone" dataKey="amount" stroke="#2196F3" name="Current" />
                  <Line type="monotone" dataKey="target" stroke="#9C27B0" name="Target" />
                </>
              ) : (
                <Line type="monotone" dataKey="amount" stroke="#2196F3" />
              )}
            </LineChart>
          );
        
        case 'pie':
          return (
            <PieChart width={600} height={300}>
              <Pie
                data={data}
                cx={300}
                cy={150}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          );
        
        default:
          return null;
      }
    } catch (error) {
      console.error("Error rendering chart:", error);
      return (
        <div className="error-state">
          Error rendering chart. Please try a different chart type or data set.
        </div>
      );
    }
  };

  const renderBudgetActions = (entry) => {
    if (category !== 'budget') return null;
    
    return (
      <div className="budget-actions">
        <button 
          className="action-button increase"
          onClick={() => handleIncreaseAmount(entry.id, 100)}
        >
          +100
        </button>
        <button 
          className="action-button decrease"
          onClick={() => handleDecreaseAmount(entry.id, 100)}
        >
          -100
        </button>
        <button 
          className="action-button edit"
          onClick={() => handleEditEntry(entry)}
        >
          Edit
        </button>
        <button 
          className="action-button delete"
          onClick={() => handleDeleteEntry(entry.id)}
        >
          Delete
        </button>
      </div>
    );
  };

  const getCategoryTitle = () => {
    const titles = {
      transactions: "Transactions",
      budget: "Budget",
      savings: "Savings",
      loans: "Loans",
      subscriptions: "Subscriptions"
    };
    return titles[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getTimeRangeTitle = () => {
    const titles = {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
      custom: "Custom Range"
    };
    return titles[timeRange] || timeRange;
  };

  return (
    <div className="report-details">
      <div className="report-header">
        <h2>{title || `${getCategoryTitle()} Report`}</h2>
        <div className="report-filters">
          <span>Chart Type: {chartType.charAt(0).toUpperCase() + chartType.slice(1)}</span>
          <span>Time Range: {getTimeRangeTitle()}</span>
          {category === 'budget' && (
            <button className="add-entry-button" onClick={handleAddEntry}>
              Add Entry
            </button>
          )}
        </div>
      </div>
      
      <div className="chart-container">
        {loading ? (
          <div className="loading-state">Loading chart data...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : data.length === 0 ? (
          <div className="empty-state">No data available for this report.</div>
        ) : (
          renderChart()
        )}
      </div>

      <div className="data-list">
        <h3>Detailed Data</h3>
        {loading ? (
          <div className="loading-state">Loading data...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : data.length === 0 ? (
          <div className="empty-state">No data available for this report.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                {category === 'transactions' && <th>Type</th>}
                {category === 'savings' && <th>Target</th>}
                {category === 'savings' && <th>Progress</th>}
                {category === 'budget' && <th>Type</th>}
                {category === 'budget' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id || item._id || item.name}>
                  <td>{item.name}</td>
                  <td>${(item.amount !== undefined && item.amount !== null) ? item.amount.toLocaleString() : '0'}</td>
                  {category === 'transactions' && <td>{item.type}</td>}
                  {category === 'savings' && <td>${(item.target !== undefined && item.target !== null) ? item.target.toLocaleString() : '0'}</td>}
                  {category === 'savings' && <td>{item.progress}%</td>}
                  {category === 'budget' && <td>{item.type}</td>}
                  {category === 'budget' && <td>{renderBudgetActions(item)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Budget Entry</h3>
              <button className="close-button" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddNewEntry}>
              <div className="form-group">
                <label>Entry Name</label>
                <input
                  type="text"
                  name="name"
                  value={newEntry.name}
                  onChange={handleNewEntryChange}
                  placeholder="e.g., Groceries, Rent"
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  name="amount"
                  value={newEntry.amount}
                  onChange={handleNewEntryChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  name="type"
                  value={newEntry.type}
                  onChange={handleNewEntryChange}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit">Add Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Budget Entry</h3>
              <button className="close-button" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleUpdateEntry}>
              <div className="form-group">
                <label>Entry Name</label>
                <input
                  type="text"
                  name="name"
                  value={newEntry.name}
                  onChange={handleNewEntryChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  name="amount"
                  value={newEntry.amount}
                  onChange={handleNewEntryChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  name="type"
                  value={newEntry.type}
                  onChange={handleNewEntryChange}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit">Update Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetails; 