import React from "react";
import Report from "./Report"; 
import "./ReportPage.css"; 

const ReportPage = () => {
  return (
    <div className="report-page" style={{ flex: 1, padding: '24px' }}>
      <Report />
    </div>
  );
};

export default ReportPage;
