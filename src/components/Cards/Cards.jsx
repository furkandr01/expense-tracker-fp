import { useState } from "react";
import { iconsImgs } from "../../utils/images";
import "./Cards.css";
import { useNavigate } from "react-router-dom";

const Cards = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [cards, setCards] = useState([
    {
      id: 1,
      ownerName: 'Furkan ADAR',
      cardNumber: '**** **** **** 3456',
      expiryDate: '12/28',
      balance: 225000
    }
  ]);
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

  const handleAddNewCard = (e) => {
    e.preventDefault();
    const cardNumber = newCard.cardNumber.replace(/\s/g, '');
    const lastFourDigits = cardNumber.slice(-4);
    const maskedNumber = '**** **** **** ' + lastFourDigits;
    
    const newCardData = {
      id: Date.now(),
      ownerName: newCard.ownerName,
      cardNumber: maskedNumber,
      expiryDate: newCard.expiryDate,
      balance: parseFloat(newCard.balance)
    };

    setCards(prev => [...prev, newCardData]);
    setNewCard({
      ownerName: '',
      cardNumber: '',
      expiryDate: '',
      balance: ''
    });
    setShowAddModal(false);
  };

  return (
    <div className="grid-one-item grid-common grid-c1" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">Cards</h3>
            <button className="grid-c-title-icon" onClick={handleAddClick}>
                <img src={iconsImgs.plus} alt="add" />
            </button>
        </div>
        <div className="cards-container">
          {cards.map((card) => (
            <div key={card.id} className="grid-c1-content">
              <p>Balance</p>
              <div className="lg-value">₺ {card.balance.toLocaleString()}</div>
              <div className="card-wrapper">
                <span className="card-pin-hidden">{card.cardNumber}</span>
              </div>
              <div className="card-owner">
                <p className="text text-white">{card.ownerName}</p>
              </div>
              <div className="card-logo-wrapper">
                <div>
                  <p className="text text-silver-v1 expiry-text">Expires</p>
                  <p className="text text-sm text-white">{card.expiryDate}</p>
                </div>
                <div className="card-logo">
                  <div className="logo-shape1"></div>
                  <div className="logo-shape2"></div>
                </div>
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
