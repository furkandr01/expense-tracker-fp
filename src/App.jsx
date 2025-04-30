import './App.css';
import Sidebar from './layout/Sidebar/Sidebar';
import Content from './layout/Content/Content';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BudgetPage from './components/Budget/BudgetPage';
import TransactionPage from './components/Transactions/TransactionPage';
import SubscriptionsPage from './components/Subscriptions/SubcsriptionsPage';
import LoansPage from './components/Loans/LoansPage';
import ReportPage from './components/Report/ReportPage';
import ReportDetails from './components/Report/ReportDetails';
import SavingsPage from './components/Savings/SavingsPage';
import FinancialPage from './components/Financial/FinancialPage';
import AccountPage from './components/Account/AccountPage';
import SettingsPage from './components/Settings/SettingsPage';
import CardsPage from './components/Cards/CardsPage';
import AddSubscriptionPage from './components/Subscriptions/AddSubscriptionPage';

function App() {
  return (
    <Router>
      <div className='app'>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/home" element={<Content />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/subscriptions/add" element={<AddSubscriptionPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/reports/:category" element={<ReportDetails />} />
          <Route path="/savings" element={<SavingsPage />} />
          <Route path="/financial-advice" element={<FinancialPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
