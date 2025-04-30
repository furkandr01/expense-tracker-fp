import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AddSubscriptionPage.css";

const AddSubscriptionPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    due_date: '',
    amount: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the subscription to your backend
    console.log('New subscription:', formData);
    navigate('/subscriptions');
  };

  return (
    <div className="add-subscription-page">
      <div className="page-header">
        <h1>Add New Subscription</h1>
        <button className="back-button" onClick={() => navigate('/subscriptions')}>← Back</button>
      </div>
      <form onSubmit={handleSubmit} className="subscription-form">
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
        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={() => navigate('/subscriptions')}>Cancel</button>
          <button type="submit" className="submit-button">Add Subscription</button>
        </div>
      </form>
    </div>
  );
};

export default AddSubscriptionPage; 