import { useState } from "react";
import { savings } from "../../data/data";
import { iconsImgs, personsImgs } from "../../utils/images";
import "./Savings.css";
import { useNavigate } from "react-router-dom";

const Savings = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [savingsList, setSavingsList] = useState(savings);
  const [newSaving, setNewSaving] = useState({
    title: '',
    saving_amount: '',
    date_taken: '',
    amount_left: '',
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

  const handleAddNewSaving = (e) => {
    e.preventDefault();
    const newSavingData = {
      id: Date.now(),
      title: newSaving.title,
      saving_amount: parseFloat(newSaving.saving_amount),
      date_taken: newSaving.date_taken,
      amount_left: parseFloat(newSaving.amount_left),
      progress: (parseFloat(newSaving.saving_amount) - parseFloat(newSaving.amount_left)) / parseFloat(newSaving.saving_amount) * 100
    };

    setSavingsList(prev => [...prev, newSavingData]);
    setNewSaving({
      title: '',
      saving_amount: '',
      date_taken: '',
      amount_left: '',
      progress: 0
    });
    setShowAddModal(false);
  };

  return (
    <div className="grid-two-item grid-common grid-c6" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">Savings</h3>
            <button className="grid-c-title-icon" onClick={handleAddClick}>
                <img src={iconsImgs.plus} alt="add" />
            </button>
        </div>
        <div className="grid-c6-content">
            <div className="grid-items">
                {savingsList.map((saving) => (
                    <div className="grid-item" key={saving.id}>
                        <div className="grid-item-top">
                            <div className="grid-item-top-l">
                                <div className="avatar img-fit-cover">
                                    <img src={personsImgs.person_two} alt="avatar" />
                                </div>
                                <p className="text text-silver-v1">{saving.title}</p>
                            </div>
                            <div className="grid-item-top-r">
                                <span className="text-silver-v1">₺ {saving.saving_amount}</span>
                            </div>
                        </div>
                        <div className="grid-item-bottom">
                            <div className="grid-item-badges">
                                <span className="grid-item-badge">Date taken {saving.date_taken}</span>
                                <span className="grid-item-badge">Amount left ₺ {saving.amount_left}</span>
                            </div>
                            <div className="grid-item-progress">
                                <div className="grid-item-fill" style={{ width: `${saving.progress}%` }}></div>
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
                            <label>Target Amount (₺)</label>
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
                            <label>Amount Left to Save (₺)</label>
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
                        <div className="savingsmodal-buttons">
                            <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button type="submit">Add Savings Goal</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

export default Savings
