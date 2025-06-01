import React, { useState } from 'react';
import { iconsImgs } from "../../utils/images";
import "./CreateReportModal.css";
import './ReportDetails.css';

const CreateReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [reportData, setReportData] = useState({
    title: '',
    category: 'transactions',
    chartType: 'bar',
    timeRange: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData({
      ...reportData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reportData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create New Report</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Report Title</label>
            <input
              type="text"
              name="title"
              value={reportData.title}
              onChange={handleChange}
              placeholder="E.g., June Monthly Summary, 2023 Savings..."
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={reportData.category}
              onChange={handleChange}
              required
            >
              <option value="transactions">Transactions</option>
              <option value="budget">Budget</option>
              <option value="savings">Savings</option>
              <option value="loans">Loans</option>
              <option value="subscriptions">Subscriptions</option>
            </select>
          </div>
          <div className="form-group">
            <label>Chart Type</label>
            <select
              name="chartType"
              value={reportData.chartType}
              onChange={handleChange}
              required
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>
          <div className="form-group">
            <label>Time Range</label>
            <select
              name="timeRange"
              value={reportData.timeRange}
              onChange={handleChange}
              required
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          {reportData.timeRange === 'custom' && (
            <>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={reportData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={reportData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
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