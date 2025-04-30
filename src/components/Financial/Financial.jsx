import { useState } from "react";
import { iconsImgs } from "../../utils/images"
import "./Financial.css"
import { useNavigate } from "react-router-dom"

const Financial = () => {
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false);
  const [adviceList, setAdviceList] = useState([
    {
      id: 1,
      title: "Investment Tips",
      frequency: "Weekly",
      link: "https://www.investopedia.com/investing-essentials-4689754",
      type: "investment"
    },
    {
      id: 2,
      title: "Market Analysis",
      frequency: "Daily",
      link: "https://www.bloomberg.com/markets",
      type: "market"
    },
    {
      id: 3,
      title: "Personal Finance",
      frequency: "Weekly",
      link: "https://www.nerdwallet.com/article/finance/personal-finance-basics",
      type: "finance"
    },
    {
      id: 4,
      title: "Cryptocurrency News",
      frequency: "Daily",
      link: "https://cointelegraph.com/",
      type: "crypto"
    }
  ]);
  const [newAdvice, setNewAdvice] = useState({
    title: '',
    frequency: '',
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

  const handleAddNewAdvice = (e) => {
    e.preventDefault();
    const newAdviceData = {
      id: Date.now(),
      title: newAdvice.title,
      frequency: newAdvice.frequency,
      link: newAdvice.link,
      type: newAdvice.type
    };

    setAdviceList(prev => [...prev, newAdviceData]);
    setNewAdvice({
      title: '',
      frequency: '',
      link: '',
      type: 'investment'
    });
    setShowAddModal(false);
  };

  const handleLinkClick = (e, link) => {
    e.stopPropagation();
    window.open(link, '_blank');
  };

  return (
    <div className="grid-two-item grid-common grid-c8" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">Financial Advice</h3>
            <button className="grid-c-title-icon" onClick={handleAddClick}>
                <img src={ iconsImgs.plus } alt="add" />
            </button>
        </div>
        <div className="grid-c8-content">
            <div className="grid-items">
                {adviceList.map((advice) => (
                    <div className="grid-item" key={advice.id}>
                        <div className="grid-item-l">
                            <div className="icon">
                                <img src={ iconsImgs.check } alt="check" />
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
                        </div>
                    </div>
                ))}
            </div>
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
                                <option value="">Select Frequency</option>
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
