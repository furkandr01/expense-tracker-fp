import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AddSubscriptionPage.css";
import { subscriptionService } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const AddSubscriptionPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'streaming',
    frequency: 'monthly',
    startDate: formatDate(new Date()),
    nextBillingDate: formatDate(new Date()),
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await subscriptionService.createSubscription({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      navigate('/subscriptions');
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Failed to create subscription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="form-group checkbox-group">
          <label htmlFor="isActive">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Active Subscription
          </label>
        </div>
        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={() => navigate('/subscriptions')}>Cancel</button>
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Subscription'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubscriptionPage; 