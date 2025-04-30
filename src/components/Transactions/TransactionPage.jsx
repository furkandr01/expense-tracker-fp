import React from "react";
import Transactions from "./Transactions"; 
import "./TransactionPage.css"; 

const TransactionPage = () => {
  return (
    <div className="transaction-page" style={{ flex: 1, padding: '24px' }}>
      <Transactions />
    </div>
  );
};

export default TransactionPage;
