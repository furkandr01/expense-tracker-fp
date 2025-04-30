import { useState } from "react";
import { subscriptions } from "../../data/data"
import { iconsImgs } from "../../utils/images"
import "./Subscriptions.css";
import { useNavigate } from "react-router-dom";

const Subscriptions = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptionsList, setSubscriptionsList] = useState(subscriptions);
  const [formData, setFormData] = useState({
    title: '',
    due_date: '',
    amount: ''
  });

  const handleClick = () => {
    navigate('/subscriptions');
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSubscription = {
      ...formData,
      id: Date.now(),
      amount: parseFloat(formData.amount)
    };
    setSubscriptionsList(prev => [...prev, newSubscription]);
    setFormData({ title: '', due_date: '', amount: '' });
    setIsModalOpen(false);
  };

  const handleDelete = (e, subscriptionId) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    setSubscriptionsList(prev => prev.filter(sub => sub.id !== subscriptionId));
  };

  return (
    <div className="grid-two-item grid-common grid-c5" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">Subscriptions</h3>
            <button className="grid-c-title-icon" onClick={handleAddClick}>
                <img src={ iconsImgs.plus } />
            </button>
        </div>
        <div className="grid-c5-content">
            <div className="grid-items">
                {
                    subscriptionsList.map((subscription) => (
                        <div className="grid-item" key = {subscription.id}>
                            <div className="grid-item-l">
                                <div className="icon">
                                    <img src={ iconsImgs.alert } />
                                </div>
                                <p className="text text-silver-v1">{ subscription.title } <span>due { subscription.due_date }</span></p>
                            </div>
                            <div className="grid-item-r">
                                <span className="text-silver-v1">₺ { subscription.amount }</span>
                                <button 
                                    className="delete-button"
                                    onClick={(e) => handleDelete(e, subscription.id)}
                                >
                                    <img src={iconsImgs.trashbin} alt="Delete" />
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
        {isModalOpen && (
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Add New Subscription</h2>
                        <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Subscription Name</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Netflix, Spotify"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="due_date">Due Date</label>
                            <input
                                type="date"
                                id="due_date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="amount">Amount (₺)</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                                placeholder="0.00"
                            />
                        </div>
                        <div className="modal-buttons">
                            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit">Add Subscription</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

export default Subscriptions
