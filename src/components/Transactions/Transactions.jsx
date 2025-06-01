import { useState, useEffect } from "react";
import "./Transactions.css";
import { transactions } from "../../data/data";
import { iconsImgs, personsImgs } from "../../utils/images";
import { useNavigate } from "react-router-dom";
import { transactionService } from "../../services/api";

const Transactions = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionList, setTransactionList] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    date: '',
    amount: '',
    type: 'expense',
    category: 'other',
    image: iconsImgs.user1
  });

  const handleClick = () => {
    navigate('/transactions');
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowAddModal(true);
  };

  const handleNewTransactionChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getTransactions();
      setTransactionList(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions');
    }
  };

  const handleAddNewTransaction = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newTransaction.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!newTransaction.amount || parseFloat(newTransaction.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!newTransaction.category) {
      setError('Category is required');
      return;
    }

    const newTransactionData = {
      title: newTransaction.name.trim(),
      date: newTransaction.date,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      category: newTransaction.category,
      description: '',
      image: newTransaction.image
    };

    try {
      const response = await transactionService.createTransaction(newTransactionData);
      setMessage('Transaction created successfully');
      
      // Reset form and close modal
      setNewTransaction({
        name: '',
        date: '',
        amount: '',
        type: 'expense',
        category: 'other',
        image: iconsImgs.user1
      });
      setShowAddModal(false);

      // Refresh transactions list
      await fetchTransactions();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create transaction';
      setError(errorMessage);
      console.error('Error creating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      setMessage('Transaction deleted successfully');
      
      // Refresh transactions list
      await fetchTransactions();
    } catch (error) {
      setError('Failed to delete transaction');
      console.error('Error deleting transaction:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="grid-one-item grid-common grid-c2" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">Transactions</h3>
            <button className="grid-c-title-icon" onClick={handleAddClick}>
                <img src={iconsImgs.plus} alt="add" />
            </button>
        </div>
        <div className="grid-c2-content">
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            <div className="grid-items">
                {transactionList.map((transaction) => (
                    <div className="grid-item" key={transaction._id}>
                            <div className="grid-item-l">
                                <div className="avatar img-fit-cover">
                                <img src={personsImgs.person_one} alt="user" />
                            </div>
                            <div className="text text-silver-v1">
                                <p className="text">{transaction.title} <span>{new Date(transaction.date).toLocaleDateString('tr-TR', {year: 'numeric', month: '2-digit', day: '2-digit'})}</span></p>
                            </div>
                        </div>
                        <div className="grid-item-r">
                            <span className={transaction.type === 'income' ? 'text-green' : 'text-scarlet'}>
                                {transaction.type === 'income' ? '+' : '-'}₺ {transaction.amount}
                            </span>
                            <button 
                              className="delete-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTransaction(transaction._id);
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
            <div className="transactionmodal-overlay" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setShowAddModal(false);
                }
            }}>
                <div className="transactionmodal-content" onClick={e => e.stopPropagation()}>
                    <div className="transactionmodal-header">
                        <h3>Add New Transaction</h3>
                        <button className="close-button" onClick={() => setShowAddModal(false)}>×</button>
                    </div>
                    <form onSubmit={handleAddNewTransaction}>
                        <div className="transactionform-group">
                            <label>Transaction Name</label>
                            <input
                                type="text"
                                name="name"
                                value={newTransaction.name}
                                onChange={handleNewTransactionChange}
                                placeholder="e.g., Salary, Groceries"
                                required
                            />
                        </div>
                        <div className="transactionform-group">
                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={newTransaction.date}
                                onChange={handleNewTransactionChange}
                                required
                            />
                        </div>
                        <div className="transactionform-group">
                            <label>Amount (₺)</label>
                            <input
                                type="number"
                                name="amount"
                                value={newTransaction.amount}
                                onChange={handleNewTransactionChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="transactionform-group">
                            <label>Transaction Type</label>
                            <select
                                name="type"
                                value={newTransaction.type}
                                onChange={handleNewTransactionChange}
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <div className="transactionform-group">
                            <label>Category</label>
                            <select
                                name="category"
                                value={newTransaction.category}
                                onChange={handleNewTransactionChange}
                                required
                            >
                                {newTransaction.type === 'income' ? (
                                    <>
                                        <option value="salary">Salary</option>
                                        <option value="investment">Investment</option>
                                        <option value="gift">Gift</option>
                                        <option value="other">Other</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="food">Food</option>
                                        <option value="transportation">Transportation</option>
                                        <option value="housing">Housing</option>
                                        <option value="utilities">Utilities</option>
                                        <option value="entertainment">Entertainment</option>
                                        <option value="other">Other</option>
                                    </>
                                )}
                            </select>
                        </div>
                        <div className="transactionmodal-buttons">
                            <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button type="submit">Add Transaction</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

export default Transactions
