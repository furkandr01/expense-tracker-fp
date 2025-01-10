import React from "react";
import Budget from "./Budget"; 
import "./BudgetPage.css"; 

const BudgetPage = () => {
  return (
    <div className="budget-page" style={{ flex: 1, padding: '24px' }}>
      <Budget />
    </div>
  );
};

export default BudgetPage;
