import { useState, useEffect } from "react";
import { iconsImgs } from "../../utils/images";
import "./Cards.css";
import { useNavigate } from "react-router-dom";
import { cardService } from "../../services/api";

const Cards = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [newCard, setNewCard] = useState({
    ownerName: '',
    cardNumber: '',
    expiryDate: '',
    balance: ''
  });

  const handleClick = () => {
    navigate('/cards');
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowAddModal(true);
  };

  const handleNewCardChange = (e) => {
    const { name, value } = e.target;
    setNewCard(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchCards = async () => {
    try {
      const response = await cardService.getCards();
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setError('Failed to fetch cards');
    }
  };

  const handleAddNewCard = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newCard.ownerName?.trim()) {
      setError('Owner name is required');
      return;
    }

    if (!newCard.cardNumber?.trim()) {
      setError('Card number is required');
      return;
    }

    if (!newCard.expiryDate?.trim()) {
      setError('Expiry date is required');
      return;
    }

    if (!newCard.balance || parseFloat(newCard.balance) < 0) {
      setError('Balance must be a valid amount');
      return;
    }

    const cardNumber = newCard.cardNumber.replace(/\s/g, '');
    const lastFourDigits = cardNumber.slice(-4);
    const maskedNumber = '**** **** **** ' + lastFourDigits;
    
    const newCardData = {
      ownerName: newCard.ownerName.trim(),
      cardNumber: maskedNumber,
      expiryDate: newCard.expiryDate.trim(),
      balance: parseFloat(newCard.balance),
      cardType: 'credit'
    };

    try {
      await cardService.createCard(newCardData);
      setMessage('Card created successfully');
      
      // Reset form and close modal
      setNewCard({
        ownerName: '',
        cardNumber: '',
        expiryDate: '',
        balance: ''
      });
      setShowAddModal(false);

      // Refresh cards list
      await fetchCards();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create card';
      setError(errorMessage);
      console.error('Error creating card:', error);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await cardService.deleteCard(id);
      setMessage('Card deleted successfully');
      
      // Refresh cards list
      await fetchCards();
    } catch (error) {
      setError('Failed to delete card');
      console.error('Error deleting card:', error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div className="grid-one-item grid-common grid-c1" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">Cards</h3>
            <button className="grid-c-title-icon" onClick={handleAddClick}>
                <img src={iconsImgs.plus} alt="add" />
            </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <div className="cards-container">
          {cards.map((card) => (
            <div key={card._id} className="grid-c1-content">
              <p>Balance</p>
              <div className="lg-value">₺ {card.balance ? card.balance.toLocaleString() : '0'}</div>
              <div className="card-wrapper">
                <span className="card-pin-hidden">{card.cardNumber || 'No card number'}</span>
              </div>
              <div className="card-owner">
                <p className="text text-white">{card.ownerName || 'Card Owner'}</p>
              </div>
              <div className="card-logo-wrapper">
                <div>
                  <p className="text text-silver-v1 expiry-text">Expires</p>
                  <p className="text text-sm text-white">{card.expiryDate || 'N/A'}</p>
                </div>
                <div className="card-logo">
                  <div className="logo-shape1"></div>
                  <div className="logo-shape2"></div>
                </div>
                <button 
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCard(card._id);
                  }}
                >
                  <img src={iconsImgs.trashbin} alt="delete" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddModal && (
            <div className="cardsmodal-overlay" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setShowAddModal(false);
                }
            }}>
                <div className="cardsmodal-content" onClick={e => e.stopPropagation()}>
                    <div className="cardsmodal-header">
                        <h3>Add New Card</h3>
                        <button className="close-button" onClick={() => setShowAddModal(false)}>×</button>
                    </div>
                    <form onSubmit={handleAddNewCard}>
                        <div className="cardsform-group">
                            <label>Card Owner Name</label>
                            <input
                                type="text"
                                name="ownerName"
                                value={newCard.ownerName}
                                onChange={handleNewCardChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="cardsform-group">
                            <label>Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={newCard.cardNumber}
                                onChange={handleNewCardChange}
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                                required
                            />
                        </div>
                        <div className="cardsform-group">
                            <label>Expiry Date</label>
                            <input
                                type="text"
                                name="expiryDate"
                                value={newCard.expiryDate}
                                onChange={handleNewCardChange}
                                placeholder="MM/YY"
                                maxLength="5"
                                required
                            />
                        </div>
                        <div className="cardsform-group">
                            <label>Initial Balance (₺)</label>
                            <input
                                type="number"
                                name="balance"
                                value={newCard.balance}
                                onChange={handleNewCardChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="cardsmodal-buttons">
                            <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button type="submit">Add Card</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

export default Cards
