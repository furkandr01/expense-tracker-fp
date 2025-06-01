import React, { useState, useEffect } from 'react';
import { iconsImgs } from "../../utils/images";
import "./Loans.css";
import { useNavigate } from "react-router-dom";
import { loanService } from "../../services/api";
import { formatDate } from "../../utils/helpers";

const Loans = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLoan, setNewLoan] = useState({
    title: '',
    amount: '',
    interestRate: '',
    term: '',
    startDate: formatDate(new Date()),
    endDate: '',
    monthlyPayment: ''
  });

  const handleClick = () => {
    navigate('/loans');
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const fetchLoans = async () => {
    try {
      const response = await loanService.getLoans();
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
      setError('Failed to fetch loans');
    }
  };

  const handleDelete = async (id) => {
    try {
      await loanService.deleteLoan(id);
      setMessage('Loan deleted successfully');
      
      // Refresh loans list
      await fetchLoans();
    } catch (error) {
      setError('Failed to delete loan');
      console.error('Error deleting loan:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLoan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate end date based on start date and term
  useEffect(() => {
    if (newLoan.startDate && newLoan.term) {
      const startDate = new Date(newLoan.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + parseInt(newLoan.term));
      
      setNewLoan(prev => ({
        ...prev,
        endDate: formatDate(endDate)
      }));
    }
  }, [newLoan.startDate, newLoan.term]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newLoan.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!newLoan.amount || parseFloat(newLoan.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!newLoan.term || parseInt(newLoan.term) <= 0) {
      setError('Term must be greater than 0');
      return;
    }

    const newLoanData = {
      title: newLoan.title.trim(),
      amount: parseFloat(newLoan.amount),
      interestRate: parseFloat(newLoan.interestRate),
      term: parseInt(newLoan.term),
      startDate: newLoan.startDate,
      endDate: newLoan.endDate,
      monthlyPayment: parseFloat(newLoan.monthlyPayment),
      lender: 'Bank',
      status: 'active'
    };

    try {
      const response = await loanService.createLoan(newLoanData);
      setMessage('Loan created successfully');
      
      // Reset form and close modal
      setNewLoan({
        title: '',
        amount: '',
        interestRate: '',
        term: '',
        startDate: formatDate(new Date()),
        endDate: '',
        monthlyPayment: ''
      });
      setIsModalOpen(false);

      // Refresh loans list
      await fetchLoans();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create loan';
      setError(errorMessage);
      console.error('Error creating loan:', error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="grid-two-item grid-common grid-c7" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Loans</h3>
        <button className="grid-c-title-icon" onClick={handleAddClick}>
          <img src={iconsImgs.plus} alt="add" />
        </button>
      </div>
      <div className="grid-c7-content">
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <div className="loan-data-list">
          {loans.map(loan => (
            <div key={loan._id} className="data-item">
              <div className="data-item-info">
                <span className="data-item-title">{loan.title}</span>
                <div className="data-item-value">₺{loan.amount.toLocaleString()}</div>
                <div className="data-item-details">
                  <span>End: {new Date(loan.endDate).toLocaleDateString()}</span>
                  <span>Rate: {loan.interestRate}%</span>
                  <span>Monthly: ₺{loan.monthlyPayment}</span>
                </div>
              </div>
              <button 
                className="grid-c-title-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(loan._id);
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
                <label>Loan Term (months)</label>
                <input
                  type="number"
                  name="term"
                  value={newLoan.term}
                  onChange={handleInputChange}
                  min="1"
                  required
                  placeholder="12"
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={newLoan.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date (calculated)</label>
                <input
                  type="date"
                  name="endDate"
                  value={newLoan.endDate}
                  readOnly
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
