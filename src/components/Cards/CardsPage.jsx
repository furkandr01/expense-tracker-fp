import React from "react";
import Cards from "./Cards"; 
import "./CardsPage.css"; 

const CardsPage = () => {
  return (
    <div className="cards-page" style={{ flex: 1, padding: '24px' }}>
      <Cards />
    </div>
  );
};

export default CardsPage; 