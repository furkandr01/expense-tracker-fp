import React from "react";
import Subscriptions from "./Subscriptions"; 
import "./SubscriptionsPage.css"; 

const SubscriptionsPage = () => {
  return (
    <div className="subscriptions-page" style={{ flex: 1, padding: '24px' }}>
      <Subscriptions />
    </div>
  );
};

export default SubscriptionsPage;
