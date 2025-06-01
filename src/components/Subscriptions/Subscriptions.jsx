import { useState, useEffect } from "react";
import { iconsImgs } from "../../utils/images"
import "./Subscriptions.css";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "../../services/api";
import { formatDate } from "../../utils/helpers";

const Subscriptions = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptionsList, setSubscriptionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    frequency: 'monthly',
    amount: '',
    category: 'streaming',
    startDate: formatDate(new Date()),
    nextBillingDate: formatDate(new Date())
  });

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        const response = await subscriptionService.getSubscriptions();
        setSubscriptionsList(response.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleClick = () => {
    navigate('/subscriptions');
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    navigate('/subscriptions/add');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await subscriptionService.createSubscription({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setSubscriptionsList(prev => [...prev, response.data]);
      setFormData({
        title: '',
        frequency: 'monthly',
        amount: '',
        category: 'streaming',
        startDate: formatDate(new Date()),
        nextBillingDate: formatDate(new Date())
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
  };

  const handleDelete = async (e, subscriptionId) => {
    e.stopPropagation();
    try {
      await subscriptionService.deleteSubscription(subscriptionId);
      setSubscriptionsList(prev => prev.filter(sub => sub._id !== subscriptionId));
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
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
            {isLoading ? (
              <div className="loading">Loading subscriptions...</div>
            ) : (
              <div className="grid-items">
                  {subscriptionsList.length === 0 ? (
                    <div className="empty-message">No subscriptions found. Add your first subscription!</div>
                  ) : (
                    subscriptionsList.map((subscription) => (
                        <div className="grid-item" key={subscription._id}>
                            <div className="grid-item-l">
                                <div className="icon">
                                    <img src={ iconsImgs.alert } />
                                </div>
                                <p className="text text-silver-v1">
                                  {subscription.title} 
                                  <span>
                                    {subscription.category} - {subscription.frequency}
                                  </span>
                                </p>
                            </div>
                            <div className="grid-item-r">
                                <span className="text-silver-v1">₺ {subscription.amount}</span>
                                <button 
                                    className="delete-button"
                                    onClick={(e) => handleDelete(e, subscription._id)}
                                >
                                    <img src={iconsImgs.trashbin} alt="Delete" />
                                </button>
                            </div>
                        </div>
                    ))
                  )}
              </div>
            )}
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
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="streaming">Streaming</option>
                                <option value="software">Software</option>
                                <option value="gym">Gym</option>
                                <option value="magazine">Magazine</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="frequency">Billing Frequency</label>
                            <select
                                id="frequency"
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                required
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nextBillingDate">Next Billing Date</label>
                            <input
                                type="date"
                                id="nextBillingDate"
                                name="nextBillingDate"
                                value={formData.nextBillingDate}
                                onChange={handleChange}
                                required
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
