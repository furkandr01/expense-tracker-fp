import { useState, useEffect } from "react";
import { iconsImgs } from "../../utils/images"
import "./Financial.css"
import { useNavigate } from "react-router-dom"
import { financialService } from "../../services/api";

const Financial = () => {
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false);
  const [adviceList, setAdviceList] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [newAdvice, setNewAdvice] = useState({
    title: '',
    frequency: 'Daily',
    link: '',
    type: 'investment'
  });

  const handleClick = () => {
    navigate('/financial-advice')
  }

  const handleAddClick = (e) => {
    e.stopPropagation() // Prevent navigation when clicking the plus button
    setShowAddModal(true);
  }

  const handleNewAdviceChange = (e) => {
    const { name, value } = e.target;
    setNewAdvice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchFinancialAdvice = async () => {
    setLoading(true);
    try {
      setError(''); // Hata mesajlarını temizle
      console.log('Fetching financial advice data...');
      const response = await financialService.getAdvice();
      console.log('Fetched data:', response.data);
      
      if (Array.isArray(response.data)) {
        setAdviceList(response.data);
        if (response.data.length === 0) {
          console.log('No financial advice data found');
        }
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Received invalid data format from server');
      }
    } catch (error) {
      console.error('Error fetching financial advice:', error);
      setError('Failed to fetch financial advice: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewAdvice = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newAdvice.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!newAdvice.link.trim()) {
      setError('Link is required');
      return;
    }
    
    if (!newAdvice.type) {
      setError('Resource type is required');
      return;
    }

    if (!newAdvice.frequency) {
      setError('Update frequency is required');
      return;
    }

    const newAdviceData = {
      title: newAdvice.title.trim(),
      frequency: newAdvice.frequency,
      link: newAdvice.link.trim(),
      type: newAdvice.type
    };

    try {
      console.log('Sending data to server:', newAdviceData);
      const response = await financialService.createAdvice(newAdviceData);
      console.log('Server response:', response.data);
      setMessage('Financial advice created successfully');
      
      // Reset form and close modal
      setNewAdvice({
        title: '',
        frequency: 'Daily',
        link: '',
        type: 'investment'
      });
      setShowAddModal(false);

      // Refresh advice list - add short delay to ensure data is updated on server
      setTimeout(() => {
        fetchFinancialAdvice();
      }, 500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create financial advice';
      setError(errorMessage);
      console.error('Error creating financial advice:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleDeleteAdvice = async (id) => {
    try {
      console.log('Deleting financial advice with ID:', id);
      await financialService.deleteAdvice(id);
      console.log('Successfully deleted financial advice');
      setMessage('Financial advice deleted successfully');
      
      // Refresh advice list with a short delay
      setTimeout(() => {
        fetchFinancialAdvice();
      }, 500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete financial advice';
      setError(errorMessage);
      console.error('Error deleting financial advice:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleLinkClick = (e, link) => {
    e.stopPropagation();
    window.open(link, '_blank');
  };

  useEffect(() => {
    // Initial data fetch when component mounts
    fetchFinancialAdvice().catch(err => {
      console.error('Error in initial data fetch:', err);
      setError('Failed to load financial advice data');
    });
  }, []);

  return (
    <div className="grid-two-item grid-common grid-c8" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">Financial Advice</h3>
            <button className="grid-c-title-icon" onClick={handleAddClick}>
                <img src={ iconsImgs.plus } alt="add" />
            </button>
        </div>
        <div className="grid-c8-content">
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            
            {loading ? (
              <div className="loading-message">Loading financial advice...</div>
            ) : (
              <div className="grid-items">
                {adviceList.length === 0 ? (
                  <div className="empty-message">No financial resources found. Add your first one!</div>
                ) : (
                  adviceList.map((advice) => (
                    <div className="grid-item" key={advice._id}>
                      <div className="grid-item-l">
                        <div className="icon">
                          <img src={iconsImgs.check} alt="check" />
                        </div>
                        <div className="text text-silver-v1">
                          <p className="text">{advice.title}</p>
                          <p className="text-sm">{advice.frequency}</p>
                        </div>
                      </div>
                      <div className="grid-item-r">
                        <button 
                          className="view-button"
                          onClick={(e) => handleLinkClick(e, advice.link)}
                        >
                          <span className="text-silver-v1">View</span>
                        </button>
                        <button 
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAdvice(advice._id);
                          }}
                        >
                          <img src={iconsImgs.trashbin} alt="delete" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
        </div>

        {showAddModal && (
            <div className="financialmodal-overlay" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setShowAddModal(false);
                }
            }}>
                <div className="financialmodal-content" onClick={e => e.stopPropagation()}>
                    <div className="financialmodal-header">
                        <h3>Add New Financial Resource</h3>
                        <button className="close-button" onClick={() => setShowAddModal(false)}>×</button>
                    </div>
                    <form onSubmit={handleAddNewAdvice}>
                        <div className="financialform-group">
                            <label>Resource Title</label>
                            <input
                                type="text"
                                name="title"
                                value={newAdvice.title}
                                onChange={handleNewAdviceChange}
                                placeholder="e.g., Investment Tips, Market Analysis"
                                required
                            />
                        </div>
                        <div className="financialform-group">
                            <label>Update Frequency</label>
                            <select
                                name="frequency"
                                value={newAdvice.frequency}
                                onChange={handleNewAdviceChange}
                                required
                            >
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>
                        <div className="financialform-group">
                            <label>Resource Link</label>
                            <input
                                type="url"
                                name="link"
                                value={newAdvice.link}
                                onChange={handleNewAdviceChange}
                                placeholder="https://example.com"
                                required
                            />
                        </div>
                        <div className="financialform-group">
                            <label>Resource Type</label>
                            <select
                                name="type"
                                value={newAdvice.type}
                                onChange={handleNewAdviceChange}
                                required
                            >
                                <option value="investment">Investment</option>
                                <option value="market">Market</option>
                                <option value="finance">Personal Finance</option>
                                <option value="crypto">Cryptocurrency</option>
                            </select>
                        </div>
                        <div className="financialmodal-buttons">
                            <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button type="submit">Add Resource</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

export default Financial
