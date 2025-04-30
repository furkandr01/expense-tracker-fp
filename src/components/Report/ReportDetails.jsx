import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import "./ReportDetails.css";

const ReportDetails = () => {
  const location = useLocation();
  const { category, chartType, timeRange, manualEntry, budgetEntry } = location.state || {};
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

  useEffect(() => {
    // Here you would typically fetch the data based on the category and timeRange
    // For now, we'll use mock data
    const mockData = {
      loans: [
        { name: 'Jan', amount: 4000 },
        { name: 'Feb', amount: 3000 },
        { name: 'Mar', amount: 2000 },
        { name: 'Apr', amount: 2780 },
        { name: 'May', amount: 1890 },
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
        { name: 'Mon', amount: 4000 },
        { name: 'Tue', amount: 3000 },
        { name: 'Wed', amount: 2000 },
        { name: 'Thu', amount: 2780 },
        { name: 'Fri', amount: 1890 },
      ],
      subscriptions: [
        { name: 'Netflix', amount: 99.99 },
        { name: 'Spotify', amount: 29.99 },
        { name: 'Amazon Prime', amount: 49.99 },
        { name: 'Disney+', amount: 34.99 },
        { name: 'YouTube Premium', amount: 19.99 },
      ],
      savings: [
        { name: 'Emergency Fund', amount: 5000 },
        { name: 'Vacation', amount: 3000 },
        { name: 'Retirement', amount: 10000 },
        { name: 'Education', amount: 2500 },
        { name: 'Investment', amount: 7500 },
      ],
    };

    let initialData = mockData[category] || [];
    
    // Add manual entry if provided
    if (category === 'budget' && manualEntry && budgetEntry) {
      initialData = [...initialData, { ...budgetEntry, id: Date.now(), initialAmount: budgetEntry.amount }];
    }
    
    setData(initialData);
  }, [category, timeRange, manualEntry, budgetEntry]);

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
    switch (chartType) {
      case 'bar':
        return (
          <BarChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
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
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
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
            <Tooltip />
          </PieChart>
        );
      default:
        return null;
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

  return (
    <div className="report-details">
      <div className="report-header">
        <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Report</h2>
        <div className="report-filters">
          <span>Chart Type: {chartType}</span>
          <span>Time Range: {timeRange}</span>
          {category === 'budget' && (
            <button className="add-entry-button" onClick={handleAddEntry}>
              Add Entry
            </button>
          )}
        </div>
      </div>
      
      <div className="chart-container">
        {renderChart()}
      </div>

      <div className="data-list">
        <h3>Detailed Data</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              {category === 'budget' && <th>Type</th>}
              {category === 'budget' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id || item.name}>
                <td>{item.name}</td>
                <td>₺{item.amount.toLocaleString()}</td>
                {category === 'budget' && <td>{item.type}</td>}
                {category === 'budget' && <td>{renderBudgetActions(item)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
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
                <label>Amount (₺)</label>
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
                <label>Amount (₺)</label>
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