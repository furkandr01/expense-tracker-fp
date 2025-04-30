import React from "react";
import Financial from "./Financial"; 
import "./FinancialPage.css"; 

const FinancialPage = () => {
  return (
    <div className="financial-page" style={{ flex: 1, padding: '24px' }}>
      <Financial />
    </div>
  );
};

export default FinancialPage;
