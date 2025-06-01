import { useState, useEffect } from "react";
import { savings } from "../../data/data";
import { iconsImgs, personsImgs } from "../../utils/images";
import "./Savings.css";
import { useNavigate } from "react-router-dom";
import { savingsService } from "../../services/api";
import { useAuth } from '../../context/authContext';

const Savings = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [savingsList, setSavingsList] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [newSaving, setNewSaving] = useState({
    title: '',
    saving_amount: '',
    date_taken: '',
    amount_left: '',
    category: 'other',
    progress: 0
  });

  const handleClick = () => {
    navigate('/savings');
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowAddModal(true);
  };

  const handleNewSavingChange = (e) => {
    const { name, value } = e.target;
    setNewSaving(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchSavings = async () => {
    try {
      const response = await savingsService.getSavings();
      setSavingsList(response.data);
    } catch (error) {
      console.error('Error fetching savings:', error);
      setError('Failed to fetch savings goals');
    }
  };

  const handleAddNewSaving = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newSaving.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!newSaving.saving_amount || parseFloat(newSaving.saving_amount) <= 0) {
      setError('Target amount must be greater than 0');
      return;
    }

    if (!newSaving.amount_left || parseFloat(newSaving.amount_left) <= 0) {
      setError('Amount left to save must be greater than 0');
      return;
    }

    // Initial amount is target amount minus amount left to save
    const initialAmount = parseFloat(newSaving.saving_amount) - parseFloat(newSaving.amount_left);

    const newSavingData = {
      title: newSaving.title.trim(),
      targetAmount: parseFloat(newSaving.saving_amount),
      deadline: newSaving.date_taken,
      currentAmount: initialAmount,
      category: newSaving.category
    };

    try {
      const response = await savingsService.createSavings(newSavingData);
      setMessage('Savings goal created successfully');
      
      // Reset form and close modal
      setNewSaving({
        title: '',
        saving_amount: '',
        date_taken: '',
        amount_left: '',
        category: 'other',
        progress: 0
      });
      setShowAddModal(false);

      // Refresh savings list
      await fetchSavings();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create savings goal';
      setError(errorMessage);
      console.error('Error creating savings goal:', error);
    }
  };

  const handleDeleteSaving = async (id) => {
    try {
      await savingsService.deleteSavings(id);
      setMessage('Savings goal deleted successfully');
      
      // Refresh savings list
      await fetchSavings();
    } catch (error) {
      setError('Failed to delete savings goal');
      console.error('Error deleting savings goal:', error);
    }
  };

  const handleAddFundsClick = (e, saving) => {
    e.stopPropagation();
    setSelectedSaving(saving);
    setAddFundsAmount('');
    setShowAddFundsModal(true);
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!selectedSaving) return;

    const amount = parseFloat(addFundsAmount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      await savingsService.addToSavings(selectedSaving._id, amount);
      setMessage('Funds added successfully');
      setShowAddFundsModal(false);
      
      // Refresh savings list
      await fetchSavings();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add funds';
      setError(errorMessage);
      console.error('Error adding funds:', error);
    }
  };

  // Map category values to display names
  const getCategoryDisplay = (category) => {
    const categoryMap = {
      'emergency': 'Emergency Fund',
      'vacation': 'Vacation',
      'education': 'Education',
      'retirement': 'Retirement',
      'other': 'Other'
    };
    return categoryMap[category] || category;
  };

  useEffect(() => {
    fetchSavings();
  }, []);

  return (
    <div className="grid-two-item grid-common grid-c6" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">Savings</h3>
            <button className="grid-c-title-icon" onClick={handleAddClick}>
                <img src={iconsImgs.plus} alt="add" />
            </button>
        </div>
        <div className="grid-c6-content">
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            <div className="grid-items">
                {savingsList.map((saving) => (
                    <div className="grid-item" key={saving._id}>
                            <div className="grid-item-top">
                                <div className="grid-item-top-l">
                                    <div className="avatar img-fit-cover">
                                    <img src={currentUser?.profileImage ? `http://localhost:5001${currentUser.profileImage}` : personsImgs.person_one} alt="avatar" />
                                    </div>
                                <p className="text text-silver-v1">{saving.title}</p>
                                </div>
                                <div className="grid-item-top-r">
                                <span className="text-silver-v1">₺ {saving.targetAmount}</span>
                                <button 
                                  className="add-funds-button"
                                  onClick={(e) => handleAddFundsClick(e, saving)}
                                >
                                  <img src={iconsImgs.plus} alt="add funds" />
                                </button>
                                <button 
                                  className="delete-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSaving(saving._id);
                                  }}
                                >
                                  <img src={iconsImgs.trashbin} alt="delete" />
                                </button>
                                </div>
                            </div>
                            <div className="grid-item-bottom">
                                <div className="grid-item-badges">
                                <span className="grid-item-badge">Deadline {new Date(saving.deadline).toLocaleDateString()}</span>
                                <span className="grid-item-badge">Amount left ₺ {saving.targetAmount - saving.currentAmount}</span>
                                <span className="grid-item-badge">{getCategoryDisplay(saving.category)}</span>
                                </div>
                                <div className="progress-info">
                                    <span>Progress</span>
                                    <span>{Math.round((saving.currentAmount / saving.targetAmount) * 100)}%</span>
                                </div>
                                <div className="grid-item-progress">
                                <div className="grid-item-fill" style={{ width: `${(saving.currentAmount / saving.targetAmount) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {showAddModal && (
            <div className="savingsmodal-overlay" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setShowAddModal(false);
                }
            }}>
                <div className="savingsmodal-content" onClick={e => e.stopPropagation()}>
                    <div className="savingsmodal-header">
                        <h3>Add New Savings Goal</h3>
                        <button className="close-button" onClick={() => setShowAddModal(false)}>×</button>
                    </div>
                    <form onSubmit={handleAddNewSaving}>
                        <div className="savingsform-group">
                            <label>Goal Title</label>
                            <input
                                type="text"
                                name="title"
                                value={newSaving.title}
                                onChange={handleNewSavingChange}
                                placeholder="e.g., New Car, Vacation"
                                required
                            />
                        </div>
                        <div className="savingsform-group">
                            <label>Target Amount (₺) - Total amount you need</label>
                            <input
                                type="number"
                                name="saving_amount"
                                value={newSaving.saving_amount}
                                onChange={handleNewSavingChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="savingsform-group">
                            <label>Date Started</label>
                            <input
                                type="date"
                                name="date_taken"
                                value={newSaving.date_taken}
                                onChange={handleNewSavingChange}
                                required
                            />
                        </div>
                        <div className="savingsform-group">
                            <label>Amount Left to Save (₺) - How much you still need to save</label>
                            <input
                                type="number"
                                name="amount_left"
                                value={newSaving.amount_left}
                                onChange={handleNewSavingChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="savingsform-group">
                            <label>Category</label>
                            <select
                                name="category"
                                value={newSaving.category}
                                onChange={handleNewSavingChange}
                                required
                            >
                                <option value="emergency">Emergency Fund</option>
                                <option value="vacation">Vacation</option>
                                <option value="education">Education</option>
                                <option value="retirement">Retirement</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="savingsmodal-buttons">
                            <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button type="submit">Add Savings Goal</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {showAddFundsModal && selectedSaving && (
            <div className="savingsmodal-overlay" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setShowAddFundsModal(false);
                }
            }}>
                <div className="savingsmodal-content" onClick={e => e.stopPropagation()}>
                    <div className="savingsmodal-header">
                        <h3>Add Funds to {selectedSaving.title}</h3>
                        <button className="close-button" onClick={() => setShowAddFundsModal(false)}>×</button>
                    </div>
                    <form onSubmit={handleAddFunds}>
                        <div className="savingsform-group">
                            <p>Current amount: ₺{selectedSaving.currentAmount}</p>
                            <p>Target amount: ₺{selectedSaving.targetAmount}</p>
                            <p>Amount left: ₺{selectedSaving.targetAmount - selectedSaving.currentAmount}</p>
                        </div>
                        <div className="savingsform-group">
                            <label>Amount to Add (₺)</label>
                            <input
                                type="number"
                                value={addFundsAmount}
                                onChange={e => setAddFundsAmount(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="savingsmodal-buttons">
                            <button type="button" onClick={() => setShowAddFundsModal(false)}>Cancel</button>
                            <button type="submit">Add Funds</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

export default Savings
