import './App.css';
import Sidebar from './layout/Sidebar/Sidebar';
import Content from './layout/Content/Content';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Transactions from './components/Transactions/Transactions';
import Subscriptions from './components/Subscriptions/Subscriptions';
import Loans from './components/Loans/Loans';
import Report from './components/Report/Report';
import Savings from './components/Savings/Savings';
import Financial from './components/Financial/Financial';
import BudgetPage from './components/Budget/BudgetPage';

function App() {
  return (
    <Router>
      <div className='app'>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/home" element={<Content />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/reports" element={<Report />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/financial-advice" element={<Financial />} />
          <Route path="/account" element={<div>Account Page</div>} />
          <Route path="/settings" element={<div>Settings Page</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
