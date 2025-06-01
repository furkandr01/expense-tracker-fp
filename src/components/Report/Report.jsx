import { useState, useEffect } from "react";
import { iconsImgs, personsImgs } from "../../utils/images";
import "./Report.css";
import { useNavigate } from "react-router-dom";
import CreateReportModal from "./CreateReportModal";
import { transactionService, budgetService, loanService, savingsService, subscriptionService, cardService, walletService } from "../../services/api";

const Report = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDate, setActiveDate] = useState(new Date());
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });

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

  const handleCreateReport = async (reportData) => {
    try {
      setLoading(true);
      
      const reportDataWithResults = await generateReportData(reportData);
      
      setIsModalOpen(false);
      navigate(`/reports/${reportData.category}`, { 
        state: { 
          ...reportData, 
          generatedData: reportDataWithResults 
        } 
      });
    } catch (error) {
      console.error("Error generating report:", error);
      setError("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const generateReportData = async (reportParams) => {
    const { category, timeRange, startDate, endDate } = reportParams;
    
    let startDateObj, endDateObj;
    
    if (timeRange === 'custom') {
      startDateObj = new Date(startDate);
      endDateObj = new Date(endDate);
    } else {
      endDateObj = new Date();  
      startDateObj = new Date();
      
      switch (timeRange) {
        case 'daily':
          startDateObj.setDate(endDateObj.getDate() - 1);
          break;
        case 'weekly':
          startDateObj.setDate(endDateObj.getDate() - 7);
          break;
        case 'monthly':
          startDateObj.setMonth(endDateObj.getMonth() - 1);
          break;
        case 'yearly':
          startDateObj.setFullYear(endDateObj.getFullYear() - 1);
          break;
        default:
          startDateObj.setDate(endDateObj.getDate() - 7); 
      }
    }
    
    const formattedStartDate = formatDateForComparison(startDateObj);
    const formattedEndDate = formatDateForComparison(endDateObj);
    
    try {
      let resultData = [];
      
      switch (category) {
        case 'transactions':
          const transactions = await transactionService.getTransactions();
          resultData = transactions.data.filter(t => {
            const transactionDate = formatDateForComparison(t.date);
            return transactionDate >= formattedStartDate && transactionDate <= formattedEndDate;
          });
          break;
        
        case 'budget':
          const budgets = await budgetService.getBudgets();
          resultData = budgets.data;
          break;
          
        case 'savings':
          const savings = await savingsService.getSavings();
          resultData = savings.data;
          break;
          
        case 'loans':
          const loans = await loanService.getLoans();
          resultData = loans.data;
          break;
          
        case 'subscriptions':
          const subscriptions = await subscriptionService.getSubscriptions();
          resultData = subscriptions.data;
          break;
          
        default:
          resultData = [];
      }
      
      return resultData;
    } catch (error) {
      console.error("Error fetching data for report:", error);
      throw error;
    }
  };

  const formatDateForComparison = (date) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return d.toISOString().split('T')[0];
    } catch (error) {
      console.error('Invalid date:', date);
      return new Date().toISOString().split('T')[0];
    }
  };

  const formatDateForDisplay = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(date).toLocaleDateString('tr-TR', options);
  };

  const changeDate = (days) => {
    const newDate = new Date(activeDate);
    newDate.setDate(newDate.getDate() + days);
    setActiveDate(newDate);
    console.log('Date changed to:', newDate); // Debug log
  };

  const fetchDailyFinancialData = async () => {
    setLoading(true);
    setError("");
    try {
      const dateForComparison = formatDateForComparison(activeDate);
      
      const [
        transactions,
        cards,
        subscriptions,
        savings
      ] = await Promise.all([
        transactionService.getTransactions(),
        cardService.getCards(),
        subscriptionService.getSubscriptions(),
        savingsService.getSavings()
      ]);

      const walletTransactions = { data: [] };

      const todayTransactions = (transactions.data || []).filter(t => 
        formatDateForComparison(t.date) === dateForComparison
      ).map(t => ({
        ...t,
        source: 'transaction',
        icon: t.type === 'income' ? iconsImgs.wealth : iconsImgs.wallet,
        userProfileImg: getUserProfileImg()
      }));

      const todayCards = (cards.data || []).filter(c => 
        formatDateForComparison(c.createdAt) === dateForComparison
      ).map(c => ({
        _id: c._id,
        title: `New Card Added: ${c.cardName}`,
        type: 'info',
        amount: 0,
        date: c.createdAt,
        category: 'card',
        source: 'card',
        icon: iconsImgs.card,
        userProfileImg: getUserProfileImg()
      }));

      const todaySubscriptions = (subscriptions.data || []).filter(s => 
        formatDateForComparison(s.createdAt) === dateForComparison
      ).map(s => ({
        _id: s._id,
        title: `New Subscription: ${s.name}`,
        type: 'expense',
        amount: s.amount,
        date: s.createdAt,
        category: 'subscription',
        source: 'subscription',
        icon: iconsImgs.plus,
        userProfileImg: getUserProfileImg()
      }));

      const todaySavings = (savings.data || []).filter(s => 
        formatDateForComparison(s.createdAt) === dateForComparison ||
        (s.lastContributionDate && formatDateForComparison(s.lastContributionDate) === dateForComparison)
      ).map(s => {
        if (formatDateForComparison(s.createdAt) === dateForComparison) {
          return {
            _id: s._id,
            title: `New Savings Goal: ${s.title}`,
            type: 'info',
            amount: s.targetAmount,
            date: s.createdAt,
            category: 'savings',
            source: 'savings',
            icon: iconsImgs.wealth,
            userProfileImg: getUserProfileImg()
          };
        } else {
          return {
            _id: `${s._id}-contribution`,
            title: `Contribution to ${s.title}`,
            type: 'savings',
            amount: s.lastContributionAmount,
            date: s.lastContributionDate,
            category: 'savings',
            source: 'savings',
            icon: iconsImgs.wealth,
            userProfileImg: getUserProfileImg()
          };
        }
      });

      const todayWalletTransactions = (walletTransactions.data || []).filter(w => 
        formatDateForComparison(w.date) === dateForComparison
      ).map(w => ({
        ...w,
        source: 'wallet',
        icon: w.type === 'deposit' ? iconsImgs.wealth : iconsImgs.wallet,
        userProfileImg: getUserProfileImg()
      }));

      const allDailyData = [
        ...todayTransactions,
        ...todayCards,
        ...todaySubscriptions,
        ...todaySavings,
        ...todayWalletTransactions
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      const financialActivities = [...todayTransactions, ...todayWalletTransactions];
      const incomeSum = financialActivities
        .filter(t => t.type === 'income' || t.type === 'deposit')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const expenseSum = financialActivities
        .filter(t => t.type === 'expense' || t.type === 'withdrawal')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      setSummary({
        income: incomeSum,
        expense: expenseSum,
        balance: incomeSum - expenseSum
      });

      setDailyTransactions(allDailyData);
    } catch (error) {
      console.error("Error fetching daily financial data:", error);
      setError("Failed to load daily financial data");
    } finally {
      setLoading(false);
    }
  };

  const getUserProfileImg = () => {
    return personsImgs.person_one;
  };

  const formatTransactionTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      food: '#FF9500',         // Orange
      transportation: '#34C759', // Green
      housing: '#5856D6',      // Purple
      utilities: '#007AFF',    // Blue
      entertainment: '#FF2D55', // Pink
      salary: '#30D158',       // Dark green
      investment: '#5E5CE6',   // Lilac
      gift: '#FF9500',         // Orange
      other: '#8E8E93'         // Gray
    };
    return categoryColors[category] || '#8E8E93';
  };

  useEffect(() => {
    console.log('useEffect triggered, activeDate:', activeDate); // Debug log
    fetchDailyFinancialData();
  }, [activeDate]); // Make sure activeDate is in dependency array

  return (
    <>
      <div className="grid-one-item grid-common grid-c3" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className="grid-c-title">
          <h3 className="grid-c-title-text">Daily Financial Report</h3>
          <button className="grid-c-title-icon" onClick={handleAddClick}>
            <img src={iconsImgs.plus} alt="add" />
          </button>
        </div>
        <div className="report-date-navigation">
          <button onClick={(e) => {
            e.stopPropagation();
            changeDate(-1);
          }}>
            <img src={iconsImgs.chevronLeft} alt="Previous" />
          </button>
          <h4>{formatDateForDisplay(activeDate)}</h4>
          <button onClick={(e) => {
            e.stopPropagation();
            changeDate(1);
          }}>
            <img src={iconsImgs.chevronRight} alt="Next" />
          </button>
        </div>
        <div className="report-summary">
          <div className="summary-item income">
            <span className="summary-label">Income</span>
            <span className="summary-value income">+${summary.income.toLocaleString()}</span>
          </div>
          <div className="summary-item expense">
            <span className="summary-label">Expense</span>
            <span className="summary-value expense">-${summary.expense.toLocaleString()}</span>
          </div>
          <div className="summary-item balance">
            <span className="summary-label">Balance</span>
            <span className={`summary-value ${summary.balance >= 0 ? 'income' : 'expense'}`}>
              {summary.balance >= 0 ? '+' : '-'}${Math.abs(summary.balance).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="grid-c3-content">
          {loading ? (
            <div className="loading-state">Loading data...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : dailyTransactions.length === 0 ? (
            <div className="empty-state">
              No transactions found for this date.
            </div>
          ) : (
            <div className="grid-items">
              {dailyTransactions.map((transaction) => (
                <div className="report-grid-item" key={transaction._id}> 
                  <div className="grid-item-l">
                    <div className="avatar img-fit-cover">
                      <img src={transaction.userProfileImg || personsImgs.person_one} alt="user profile" />
                    </div>
                    <div className="text text-silver-v1">
                      <p className="text">
                        {transaction.title}
                        <span className="transaction-time">{formatTransactionTime(transaction.date)}</span>
                      </p>
                      <div className="category-badge" style={{ backgroundColor: getCategoryColor(transaction.category) }}>
                        {transaction.category}
                      </div>
                    </div>
                  </div>
                  <div className="grid-item-r">
                    <span className={transaction.type === 'income' ? 'text-green' : 'text-scarlet'}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
