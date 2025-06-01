import { useState, useEffect } from "react";
import "./Budget.css";
import { iconsImgs } from "../../utils/images";
import { budget } from "../../data/data";
import { useNavigate } from "react-router-dom";
import { budgetService, walletService } from "../../services/api";

const Budget = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [cashAmount, setCashAmount] = useState(() => {
    // Load cash amount from localStorage on component mount
    const saved = localStorage.getItem('cashAmount');
    return saved ? parseFloat(saved) : 0;
  });
  const [budgetItems, setBudgetItems] = useState(budget);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [newEntry, setNewEntry] = useState({
    title: '',
    amount: '',
    type: 'expense',
    isFixed: false
  });
  const [budgets, setBudgets] = useState([]);

  // Save cash amount to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cashAmount', cashAmount.toString());
    // Try to save to backend as well (when API is ready)
    saveCashAmountToBackend(cashAmount);
  }, [cashAmount]);

  // Function to save cash amount to backend
  const saveCashAmountToBackend = async (amount) => {
    try {
      await walletService.updateBalance(amount);
    } catch (error) {
      // If API is not available, just continue with localStorage
      console.log('Wallet API not available, using localStorage');
    }
  };

  // Load cash amount from backend on component mount
  const loadCashAmountFromBackend = async () => {
    try {
      const response = await walletService.getBalance();
      setCashAmount(response.data.balance || 0);
    } catch (error) {
      // If API is not available, use localStorage value
      console.log('Wallet API not available, using localStorage');
    }
  };

  const handleClick = () => {
    navigate('/budget');
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowAddModal(true);
  };

  const handleNewEntryChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const fetchBudgets = async () => {
    try {
      const response = await budgetService.getBudgets();
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError('Failed to fetch budgets');
    }
  };

  const handleAddNewEntry = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newEntry.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!newEntry.amount || parseFloat(newEntry.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    const newBudgetItem = {
      title: newEntry.title.trim(),
      amount: parseFloat(newEntry.amount),
      type: newEntry.type,
      isFixed: newEntry.isFixed
    };

    try {
      const response = await budgetService.createBudget(newBudgetItem);
      setMessage('Budget entry created successfully');
      
      // Update cash amount
      if (newEntry.type === 'income') {
        setCashAmount(prev => prev + parseFloat(newEntry.amount));
      } else {
        setCashAmount(prev => prev - parseFloat(newEntry.amount));
      }

      // Reset form and close modal
      setNewEntry({
        title: '',
        amount: '',
        type: 'expense',
        isFixed: false
      });
      setShowAddModal(false);

      // Refresh budgets list
      await fetchBudgets();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create budget entry';
      setError(errorMessage);
      setShowAddModal(false);
      console.error('Error creating budget:', error);
    }
  };

  const handleDeleteEntry = async (id, amount, type) => {
    try {
      console.log('Attempting to delete budget entry:', { id, amount, type });
      console.log('budgetService methods:', Object.keys(budgetService));
      setError(''); // Clear any previous errors
      
      await budgetService.deleteBudget(id);
      console.log('Budget entry deleted successfully');
      
      // Update cash amount when deleting an entry
      if (type === 'income') {
        setCashAmount(prev => prev - amount);
      } else {
        setCashAmount(prev => prev + amount);
      }

      setMessage('Budget entry deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
      
      // Refresh budgets list
      await fetchBudgets();
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // More detailed error handling
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.statusText;
        setError(`Failed to delete budget entry (${status}): ${message}`);
      } else if (error.request) {
        setError('Failed to delete budget entry: No response from server');
      } else {
        setError(`Failed to delete budget entry: ${error.message}`);
      }
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  useEffect(() => {
    fetchBudgets();
    loadCashAmountFromBackend();
  }, []);

  return (
    <div className="grid-two-item grid-common grid-c4" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Budget</h3>
        <button className="grid-c-title-icon" onClick={handleAddClick}>
          <img src={iconsImgs.plus} alt="add" />
        </button>
      </div>
      <div className="grid-c-top text-silver-v1">
        <h2 className="lg-value">Cash</h2>
        <span className="lg-value">₺ {cashAmount.toLocaleString()}</span>
      </div>
      <div className="grid-c4-content bg-jet">                                  
        {/* <div className="grid-items">
          {budgetItems.map((item) => (
            <div className="grid-item" key={item.id}>
              <div className="grid-item-l">
                <div className="icon">
                  <img src={iconsImgs.check} alt="check" />
                </div>
                <p className="text text-silver-v1">
                  {item.title} 
                  <span>{item.isFixed ? 'Fixed' : 'Manual'}</span>
                </p>
              </div>
              <div className="grid-item-r">
                <span className={item.type === 'income' ? 'text-green' : 'text-red'}>
                  {item.type === 'income' ? '+' : '-'} ₺ {item.amount.toLocaleString()}
                </span>
                <button 
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEntry(item.id, item.amount, item.type);
                  }}
                >
                  <img src={iconsImgs.trashbin} alt="delete" />
                </button>
              </div>
            </div>
          ))}
        </div> */}
        <div className="grid-items">
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          {budgets.map((item) => (
            <div className="grid-item" key={item._id}>
              <div className="grid-item-l">
                <div className="icon">
                  <img src={iconsImgs.check} alt="check" />
                </div>
                <p className="text text-silver-v1">
                  {item.title} 
                  <span>{item.isFixed ? 'Fixed' : 'Manual'}</span>
                </p>
              </div>
              <div className="grid-item-r">
                <span className={item.type === 'income' ? 'text-green' : 'text-red'}>
                  {item.type === 'income' ? '+' : '-'} ₺ {item.amount.toLocaleString()}
                </span>
                <button 
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEntry(item._id, item.amount, item.type);
                  }}
                >
                  <img src={iconsImgs.trashbin} alt="delete" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="budgetmodal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowAddModal(false);
          }
        }}>
          <div className="budgetmodal-content" onClick={e => e.stopPropagation()}>
            <div className="budgetmodal-header">
              <h3>Add New Budget Entry</h3>
              <button className="close-button" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddNewEntry}>
              <div className="budgetform-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={newEntry.title}
                  onChange={handleNewEntryChange}
                  placeholder="e.g., Salary, Rent"
                  required
                />
              </div>
              <div className="budgetform-group">
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
              <div className="budgetform-group">
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
              <div className="budgetform-group">
                <label>
                  <input
                    type="checkbox"
                    name="isFixed"
                    checked={newEntry.isFixed}
                    onChange={handleNewEntryChange}
                  />
                  Fixed Expense/Income
                </label>
              </div>
              <div className="budgetmodal-buttons">
                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit">Add Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
