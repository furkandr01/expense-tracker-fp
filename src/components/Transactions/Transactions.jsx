import { useState } from "react";
import "./Transactions.css";
import { transactions } from "../../data/data";
import { iconsImgs } from "../../utils/images";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionList, setTransactionList] = useState(transactions);
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    date: '',
    amount: '',
    type: 'expense',
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

  const handleAddNewTransaction = (e) => {
    e.preventDefault();
    const newTransactionData = {
      id: Date.now(),
      name: newTransaction.name,
      date: newTransaction.date,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      image: newTransaction.image
    };

    setTransactionList(prev => [...prev, newTransactionData]);
    setNewTransaction({
      name: '',
      date: '',
      amount: '',
      type: 'expense',
      image: iconsImgs.user1
    });
    setShowAddModal(false);
  };

  return (
    <div className="grid-one-item grid-common grid-c2" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">Transactions</h3>
            <button className="grid-c-title-icon" onClick={handleAddClick}>
                <img src={iconsImgs.plus} alt="add" />
            </button>
        </div>
        <div className="grid-c2-content">
            <div className="grid-items">
                {transactionList.map((transaction) => (
                    <div className="grid-item" key={transaction.id}>
                        <div className="grid-item-l">
                            <div className="avatar img-fit-cover">
                                <img src={transaction.image} alt="" />
                            </div>
                            <div className="text text-silver-v1">
                                <p className="text">{transaction.name} <span>{transaction.date}</span></p>
                            </div>
                        </div>
                        <div className="grid-item-r">
                            <span className={transaction.type === 'income' ? 'text-green' : 'text-scarlet'}>
                                {transaction.type === 'income' ? '+' : '-'}₺ {transaction.amount}
                            </span>
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
