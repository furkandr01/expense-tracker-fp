import React from "react";
import Savings from "./Savings"; 
import "./SavingsPage.css"; 

const SavingsPage = () => {
  return (
    <div className="savings-page" style={{ flex: 1, padding: '24px' }}>
      <Savings />
    </div>
  );
};

export default SavingsPage;
