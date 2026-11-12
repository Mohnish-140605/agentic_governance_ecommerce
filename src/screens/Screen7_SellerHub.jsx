import React, { useState } from 'react';
import MerchantSidebar from '../components/merchant/MerchantSidebar';
import MerchantHeader from '../components/merchant/MerchantHeader';
import KPICards from '../components/merchant/KPICards';
import SalesAnalytics from '../components/merchant/SalesAnalytics';
import TransactionsTable from '../components/merchant/TransactionsTable';
import MerchantIntelligence from '../components/merchant/MerchantIntelligence';
import TopProducts from '../components/merchant/TopProducts';
import GovernanceOverview from '../components/merchant/GovernanceOverview';
import SLAOverview from '../components/merchant/SLAOverview';
import MerchantPlaceholderScreen from './MerchantPlaceholderScreen';
import { SELLER_LISTINGS, INITIAL_ORDERS } from '../data/mockData';

export default function Screen7_SellerHub({
  sellerListings = SELLER_LISTINGS,
  orders = INITIAL_ORDERS,
  onOpenAddListing,
  currentLocation,
  onShowToast,
  currentUser
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('overview');

  const merchantName = currentUser?.name?.split(' ')[0] || 'Studio Hasami';
  const merchantAvatar = currentUser?.avatar;

  const handleNavigate = (screenId) => {
    setActiveNavItem(screenId);
    setMobileMenuOpen(false);
    // Navigation is handled by conditional rendering below
  };

  const handleViewOrder = (order) => {
    onShowToast?.(`Viewing order ${order.id}`);
  };

  const handleViewAllProducts = () => {
    onShowToast?.('Viewing all products...');
  };

  const handleViewAllGovernance = () => {
    onShowToast?.('Opening governance details...');
  };

  const handleViewAllSLA = () => {
    onShowToast?.('Opening SLA management...');
  };

  const handleViewInsights = (categoryId, insight) => {
    onShowToast?.(`Viewing ${categoryId} insights: ${insight.title}`);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-cream)'
    }}>
      {/* Sidebar */}
      <MerchantSidebar
        activeScreen={activeNavItem}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        merchantName={merchantName}
        merchantAvatar={merchantAvatar}
      />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 45
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="merchant-main-content" style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? '72px' : '260px',
        transition: 'margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <MerchantHeader
          merchantName={merchantName}
          merchantAvatar={merchantAvatar}
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          onProfileClick={() => onShowToast?.('Opening profile settings...')}
          onNotificationsClick={() => onShowToast?.('Opening notifications...')}
          notifications={3}
        />

        {/* Dashboard Content */}
        <main className="merchant-content" style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto'
        }}>
          {activeNavItem === 'overview' || activeNavItem === 'seller_hub' ? (
            <div style={{
              maxWidth: '1400px',
              margin: '0 auto'
            }}>
              {/* KPI Cards */}
              <KPICards />

              {/* Main Grid: Analytics + Transactions */}
              <div className="dashboard-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                {/* Sales Analytics */}
                <SalesAnalytics />

                {/* Recent Transactions */}
                <TransactionsTable
                  orders={orders}
                  onViewOrder={handleViewOrder}
                />
              </div>

              {/* Merchant Intelligence */}
              <MerchantIntelligence
                onViewInsights={handleViewInsights}
              />

              {/* Bottom Grid: Top Products + Governance + SLA */}
              <div className="dashboard-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
                gap: '24px',
                marginTop: '32px'
              }}>
                {/* Top Products */}
                <TopProducts
                  products={null}
                  onViewAll={handleViewAllProducts}
                />

                {/* Governance Overview */}
                <GovernanceOverview
                  onViewAll={handleViewAllGovernance}
                />

                {/* SLA Overview */}
                <SLAOverview
                  onViewAll={handleViewAllSLA}
                />
              </div>
            </div>
          ) : (
            <MerchantPlaceholderScreen
              screenId={activeNavItem}
              onBack={() => setActiveNavItem('overview')}
            />
          )}
        </main>
      </div>

      {/* Mobile Sidebar (when open) */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 50,
          transform: 'translateX(0)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <MerchantSidebar
            activeScreen={activeNavItem}
            onNavigate={handleNavigate}
            collapsed={false}
            onToggleCollapse={() => setMobileMenuOpen(false)}
            merchantName={merchantName}
            merchantAvatar={merchantAvatar}
          />
        </div>
      )}
    </div>
  );
}
