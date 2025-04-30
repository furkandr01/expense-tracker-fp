import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconsImgs } from "../../utils/images";
import "./Loans.css";

const AddLoan = () => {
  const navigate = useNavigate();
  const [loanData, setLoanData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    interestRate: '',
    monthlyPayment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the loan data
    console.log('New loan:', loanData);
    navigate(-1); // Go back to loans page
  };

  return (
    <div className="grid-two-item grid-common grid-c7">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Add New Loan</h3>
        <button className="grid-c-title-icon" onClick={() => navigate(-1)}>
          <img src={iconsImgs.close} alt="close" />
        </button>
      </div>
      <div className="grid-c7-content">
        <form onSubmit={handleSubmit} className="add-loan-form">
          <div className="form-group">
            <label>Loan Title</label>
            <input
              type="text"
              name="title"
              value={loanData.title}
              onChange={handleChange}
              placeholder="Enter loan title"
              required
            />
          </div>
          <div className="form-group">
            <label>Amount (₺)</label>
            <input
              type="number"
              name="amount"
              value={loanData.amount}
              onChange={handleChange}
              placeholder="Enter loan amount"
              required
            />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={loanData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              name="interestRate"
              value={loanData.interestRate}
              onChange={handleChange}
              placeholder="Enter interest rate"
              required
            />
          </div>
          <div className="form-group">
            <label>Monthly Payment (₺)</label>
            <input
              type="number"
              name="monthlyPayment"
              value={loanData.monthlyPayment}
              onChange={handleChange}
              placeholder="Enter monthly payment"
              required
            />
          </div>
          <button type="submit" className="submit-button">Add Loan</button>
        </form>
      </div>
    </div>
  );
};

export default AddLoan; 