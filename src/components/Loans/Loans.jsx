import React, { useState } from 'react';
import { iconsImgs } from "../../utils/images";
import "./Loans.css";
import { useNavigate } from "react-router-dom";

const Loans = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([
    {
      id: 1,
      title: 'Car Loan',
      amount: 25000,
      dueDate: '2025-12-31',
      interestRate: 5.5,
      monthlyPayment: 500
    },
    {
      id: 2,
      title: 'Student Loan',
      amount: 15000,
      dueDate: '2026-06-30',
      interestRate: 4.2,
      monthlyPayment: 300
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLoan, setNewLoan] = useState({
    title: '',
    amount: '',
    dueDate: '',
    interestRate: '',
    monthlyPayment: ''
  });

  const handleClick = () => {
    navigate('/loans');
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setLoans(loans.filter(loan => loan.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLoan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLoanData = {
      id: loans.length + 1,
      title: newLoan.title,
      amount: parseFloat(newLoan.amount),
      dueDate: newLoan.dueDate,
      interestRate: parseFloat(newLoan.interestRate),
      monthlyPayment: parseFloat(newLoan.monthlyPayment)
    };
    setLoans([...loans, newLoanData]);
    setNewLoan({
      title: '',
      amount: '',
      dueDate: '',
      interestRate: '',
      monthlyPayment: ''
    });
    setIsModalOpen(false);
  };

  return (
    <div className="grid-two-item grid-common grid-c7" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Loans</h3>
        <button className="grid-c-title-icon" onClick={handleAddClick}>
          <img src={iconsImgs.plus} alt="add" />
        </button>
      </div>
      <div className="grid-c7-content">
        <div className="loan-data-list">
          {loans.map(loan => (
            <div key={loan.id} className="data-item">
              <div className="data-item-info">
                <span className="data-item-title">{loan.title}</span>
                <div className="data-item-value">₺{loan.amount.toLocaleString()}</div>
                <div className="data-item-details">
                  <span>Due: {new Date(loan.dueDate).toLocaleDateString()}</span>
                  <span>Rate: {loan.interestRate}%</span>
                  <span>Monthly: ₺{loan.monthlyPayment}</span>
                </div>
              </div>
              <button 
                className="grid-c-title-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(loan.id);
                }}
              >
                <img src={iconsImgs.trashbin} alt="delete" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(false);
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Loan</h3>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Loan Name</label>
                <input
                  type="text"
                  name="title"
                  value={newLoan.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Car Loan, Mortgage"
                />
              </div>
              <div className="form-group">
                <label>Loan Amount (₺)</label>
                <input
                  type="number"
                  name="amount"
                  value={newLoan.amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={newLoan.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input
                  type="number"
                  name="interestRate"
                  value={newLoan.interestRate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Monthly Payment (₺)</label>
                <input
                  type="number"
                  name="monthlyPayment"
                  value={newLoan.monthlyPayment}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit">Add Loan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
