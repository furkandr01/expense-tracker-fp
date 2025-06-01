import './App.css';
import Sidebar from './layout/Sidebar/Sidebar';
import Content from './layout/Content/Content';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import { AuthProvider, useAuth } from './context/authContext';
import { useState, useEffect } from 'react';

const AppLayout = ({ children, applyTheme = false }) => {
  const { theme } = useAuth();
  
  useEffect(() => {
    if (applyTheme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, applyTheme]);
  
  return (
    <div className='app'>
      <Sidebar />
      {children}
    </div>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

const AppRoutes = () => {
  const { currentUser, loading } = useAuth();
  
  const ProtectedRoute = ({ children }) => {  
    if (loading) {
      return <div className="loading-screen">Loading...</div>;
    }
    
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Content />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <AppLayout applyTheme={true}>
              <Content />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cards" 
        element={
          <ProtectedRoute>
            <AppLayout applyTheme={true}>
              <CardsPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/budget" 
        element={
          <ProtectedRoute>
            <AppLayout applyTheme={true}>
              <BudgetPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <AppLayout applyTheme={true}>
              <TransactionPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/subscriptions" 
        element={
          <ProtectedRoute>
            <AppLayout applyTheme={true}>
              <SubscriptionsPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/subscriptions/add" 
        element={
          <ProtectedRoute>
            <AppLayout applyTheme={true}>
              <AddSubscriptionPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/loans" 
        element={
          <ProtectedRoute>
            <AppLayout applyTheme={true}>
              <LoansPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute>
            <AppLayout applyTheme={true}>
              <ReportPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports/:category" 
        element={
          <ProtectedRoute>
            <AppLayout applyTheme={true}>
              <ReportDetails />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/savings" 
        element={
          <ProtectedRoute>
            <AppLayout applyTheme={true}>
              <SavingsPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/financial-advice" 
        element={
          <ProtectedRoute>
            <AppLayout applyTheme={true}>
              <FinancialPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/account" 
        element={
          <ProtectedRoute>
            <AppLayout applyTheme={true}>
              <AccountPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <AppLayout applyTheme={true}>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default App
