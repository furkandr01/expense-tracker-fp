import React, { useState } from 'react';
import { iconsImgs } from "../../utils/images";
import "./CreateReportModal.css";

const CreateReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedCategory, setSelectedCategory] = useState('loans');
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('month');
  const [manualEntry, setManualEntry] = useState(false);
  const [budgetEntry, setBudgetEntry] = useState({
    name: '',
    amount: '',
    type: 'expense'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      category: selectedCategory,
      chartType,
      timeRange,
      manualEntry: selectedCategory === 'budget' ? manualEntry : false,
      budgetEntry: selectedCategory === 'budget' && manualEntry ? budgetEntry : null
    });
  };

  const handleBudgetEntryChange = (e) => {
    const { name, value } = e.target;
    setBudgetEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create New Report</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                if (e.target.value !== 'budget') {
                  setManualEntry(false);
                }
              }}
            >
              <option value="loans">Loans</option>
              <option value="budget">Budget</option>
              <option value="transactions">Transactions</option>
              <option value="subscriptions">Subscriptions</option>
              <option value="savings">Savings</option>
            </select>
          </div>
          
          {selectedCategory === 'budget' && (
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={manualEntry}
                  onChange={(e) => setManualEntry(e.target.checked)}
                />
                Add Manual Entry
              </label>
            </div>
          )}

          {selectedCategory === 'budget' && manualEntry && (
            <>
              <div className="form-group">
                <label>Entry Name</label>
                <input
                  type="text"
                  name="name"
                  value={budgetEntry.name}
                  onChange={handleBudgetEntryChange}
                  placeholder="e.g., Groceries, Rent"
                />
              </div>
              <div className="form-group">
                <label>Amount (₺)</label>
                <input
                  type="number"
                  name="amount"
                  value={budgetEntry.amount}
                  onChange={handleBudgetEntryChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  name="type"
                  value={budgetEntry.type}
                  onChange={handleBudgetEntryChange}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </>
          )}
          
          <div className="form-group">
            <label>Chart Type</label>
            <select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>

          <div className="form-group">
            <label>Time Range</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Create Report</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReportModal; 