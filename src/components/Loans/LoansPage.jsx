import React from "react";
import Loans from "./Loans"; 
import "./LoansPage.css"; 

const LoansPage = () => {
  return (
    <div className="loans-page" style={{ flex: 1, padding: '24px' }}>
      <Loans />
    </div>
  );
};

export default LoansPage;
