import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AskAriaFab from '../components/AskAriaFab';

import Screen1_Home from '../screens/Screen1_Home';
import Screen2_Chat from '../screens/Screen2_Chat';
import Screen3_NeedsOK from '../screens/Screen3_NeedsOK';
import Screen4_NotPlaced from '../screens/Screen4_NotPlaced';
import Screen5_Orders from '../screens/Screen5_Orders';
import Screen6_Rules from '../screens/Screen6_Rules';
import Screen9_HowAriaWorks from '../screens/Screen9_HowAriaWorks';

export default function CustomerPortal({
  activeScreen,
  setActiveScreen,
  currentUser,
  currentLocation,
  orders,
  rules,
  setRules,
  chatPrompt,
  onAskAria,
  onQuickOrder,
  onApproveOrder,
  onRejectOrder,
  onRaiseLimit,
  onOpenSearch,
  onOpenCart,
  onOpenGoogleAuth,
  onOpenLocationModal,
  onSwitchToSeller,
  showToast
}) {
  const pendingApprovalsCount = orders.filter((o) => o.status === 'needs_ok').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-cream)' }}>
      {/* Customer Header */}
      <Header
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        dashboardMode="customer"
        setDashboardMode={() => onSwitchToSeller()}
        currentUser={currentUser}
        currentLocation={currentLocation}
        onOpenSearch={onOpenSearch}
        onOpenCart={onOpenCart}
        onOpenGoogleAuth={onOpenGoogleAuth}
        onOpenLocationModal={onOpenLocationModal}
        cartCount={orders.filter(o => o.status === 'needs_ok' || o.status === 'placed').length}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Customer Sub-bar: Quick Link to Seller Studio */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-cream-subtle)',
        padding: '6px 24px'
      }}>
        <div style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-secondary)' }}>
            <span>🌿 <strong>Shopper Sanctuary</strong></span>
            <span>•</span>
            <span>Deterministic safeguards active</span>
            <span>•</span>
            <span>Delivering to: <strong style={{ color: 'var(--forest-green)' }}>{currentLocation.locality}, {currentLocation.city}</strong></span>
          </div>

          <button
            onClick={onSwitchToSeller}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--forest-green)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '6px'
            }}
          >
            <span>Are you an artisan seller? Open Seller Studio ➔</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Customer Screens */}
      <main style={{ flex: 1 }}>
        {activeScreen === 'explore' && (
          <Screen1_Home
            onAskAria={onAskAria}
            onNavigateToScreen={setActiveScreen}
            onQuickOrder={onQuickOrder}
            onShowToast={showToast}
            currentUser={currentUser}
            currentLocation={currentLocation}
          />
        )}

        {activeScreen === 'chat' && (
          <Screen2_Chat
            onNavigateToScreen={setActiveScreen}
            onShowToast={showToast}
            initialPrompt={chatPrompt}
            currentUser={currentUser}
            currentLocation={currentLocation}
          />
        )}

        {activeScreen === 'needs_ok' && (
          <Screen3_NeedsOK
            onApproveOrder={onApproveOrder}
            onRejectOrder={onRejectOrder}
            onShowToast={showToast}
            onNavigateToScreen={setActiveScreen}
          />
        )}

        {activeScreen === 'not_placed' && (
          <Screen4_NotPlaced
            onNavigateToScreen={setActiveScreen}
            onRaiseLimit={onRaiseLimit}
            onAskAriaAboutProduct={onAskAria}
            onShowToast={showToast}
          />
        )}

        {activeScreen === 'orders' && (
          <Screen5_Orders
            orders={orders}
            onNavigateToScreen={setActiveScreen}
            onShowToast={showToast}
            currentUser={currentUser}
            currentLocation={currentLocation}
          />
        )}

        {activeScreen === 'rules' && (
          <Screen6_Rules
            rules={rules}
            setRules={setRules}
            onShowToast={showToast}
          />
        )}

        {activeScreen === 'how_aria_works' && (
          <Screen9_HowAriaWorks
            onNavigateToScreen={setActiveScreen}
          />
        )}
      </main>

      {/* Global Pinned Floating Action Button: Ask Aria */}
      <AskAriaFab
        onOpenChat={() => setActiveScreen('chat')}
        activeScreen={activeScreen}
      />

      {/* Reassurance Footer */}
      <Footer onNavigateToScreen={setActiveScreen} />
    </div>
  );
}
