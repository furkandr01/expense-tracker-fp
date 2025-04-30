import { iconsImgs } from "../../utils/images";
import "./Report.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CreateReportModal from "./CreateReportModal";

const Report = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    navigate('/reports');
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateReport = (reportData) => {
    // Here you would typically make an API call to create the report
    console.log('Creating report with data:', reportData);
    setIsModalOpen(false);
    // Navigate to the report details page with the new report
    navigate(`/reports/${reportData.category}`, { state: reportData });
  };

  return (
    <>
      <div className="grid-one-item grid-common grid-c3" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className="grid-c-title">
          <h3 className="grid-c-title-text">Report</h3>
          <button className="grid-c-title-icon" onClick={handleAddClick}>
            <img src={iconsImgs.plus} alt="add" />
          </button>
        </div>
        <div className="grid-c3-content">
          <div className="grid-items">
            <div className="grid-item">
              <div className="grid-item-l">
                <div className="icon">
                  <img src={iconsImgs.check} alt="check" />
                </div>
                <div className="text text-silver-v1">
                  <p className="text">Income</p>
                  <p className="text-sm">Today, 3:30 PM</p>
                </div>
              </div>
              <div className="grid-item-r">
                <span className="text-green">+ ₺ 150</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateReportModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateReport}
      />
    </>
  );
};

export default Report;
