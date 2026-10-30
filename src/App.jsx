import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AskAriaFab from './components/AskAriaFab';
import CommandPalette from './components/CommandPalette';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import GoogleAuthModal from './components/GoogleAuthModal';
import LocationModal from './components/LocationModal';
import AddListingModal from './components/AddListingModal';
import SellerOrderView from './components/SellerOrderView';

import LandingPage from './pages/LandingPage';
import BuyerLoginPage from './pages/BuyerLoginPage';
import MerchantLoginPage from './pages/MerchantLoginPage';

import Screen1_Home from './screens/Screen1_Home';
import Screen2_Chat from './screens/Screen2_Chat';
import Screen3_NeedsOK from './screens/Screen3_NeedsOK';
import Screen4_NotPlaced from './screens/Screen4_NotPlaced';
import Screen5_Orders from './screens/Screen5_Orders';
import Screen6_Rules from './screens/Screen6_Rules';
import Screen7_SellerHub from './screens/Screen7_SellerHub';
import Screen8_StoreHealth from './screens/Screen8_StoreHealth';
import Screen9_HowAriaWorks from './screens/Screen9_HowAriaWorks';

import { INITIAL_RULES, INITIAL_ORDERS, SELLER_LISTINGS } from './data/mockData';
import { DEFAULT_USER, POPULAR_LOCATIONS } from './data/navigation';

// ─── Session persistence helpers ────────────────────────────────────────────
const SESSION_KEYS = {
  buyer: 'cairn_buyer_session',
  merchant: 'cairn_merchant_session',
  appState: 'cairn_app_state'
};

function loadSession(role) {
  try {
    const raw = localStorage.getItem(SESSION_KEYS[role]);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(role, user) {
  if (user) localStorage.setItem(SESSION_KEYS[role], JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEYS[role]);
}

function loadAppState() {
  return localStorage.getItem(SESSION_KEYS.appState) || 'landing';
}

function saveAppState(state) {
  localStorage.setItem(SESSION_KEYS.appState, state);
}

// ─── Determine initial app state from persisted sessions ───────────────────
function resolveInitialState() {
  const persisted = loadAppState();
  // Validate that the persisted state still has a valid session
  if (persisted === 'buyer_app' && loadSession('buyer')) return 'buyer_app';
  if (persisted === 'merchant_app' && loadSession('merchant')) return 'merchant_app';
  return 'landing';
}

export default function App() {
  // ── Top-level app flow state ────────────────────────────────────────────
  // 'landing' | 'buyer_login' | 'merchant_login' | 'buyer_app' | 'merchant_app'
  const [appState, setAppState] = useState(resolveInitialState);

  // Role & Dashboard Mode derived from appState
  const dashboardMode = appState === 'merchant_app' ? 'seller' : 'customer';

  const [activeScreen, setActiveScreen] = useState(() => {
    return appState === 'merchant_app' ? 'seller_hub' : 'explore';
  });

  const [rules, setRules] = useState(INITIAL_RULES);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [sellerListings, setSellerListings] = useState(SELLER_LISTINGS);
  const [chatPrompt, setChatPrompt] = useState('');

  // Modals state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [googleAuthOpen, setGoogleAuthOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [addListingModalOpen, setAddListingModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // ── Authenticated User (loaded from role-specific session) ─────────────
  const [currentUser, setCurrentUser] = useState(() => {
    if (appState === 'buyer_app') return loadSession('buyer') || DEFAULT_USER;
    if (appState === 'merchant_app') return loadSession('merchant') || DEFAULT_USER;
    return DEFAULT_USER;
  });

  // Live Location
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('cairn_location');
      return saved ? JSON.parse(saved) : POPULAR_LOCATIONS[0];
    } catch {
      return POPULAR_LOCATIONS[0];
    }
  });

  // ── Persist appState whenever it changes ───────────────────────────────
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  // ── Global keyboard shortcut for ⌘K ───────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  // ── Navigation: landing → buyer or merchant login ──────────────────────
  const handleSelectBuyer = () => setAppState('buyer_login');
  const handleSelectMerchant = () => setAppState('merchant_login');
  const handleBackToLanding = () => setAppState('landing');

  // ── Buyer sign-in handler ──────────────────────────────────────────────
  const handleBuyerSignIn = (user) => {
    const enriched = { ...user, role: 'buyer' };
    setCurrentUser(enriched);
    saveSession('buyer', enriched);
    setAppState('buyer_app');
    setActiveScreen('explore');
    showToast(`Welcome, ${user.name}! You're now signed in as a Buyer.`);
    setRules((prev) => ({
      ...prev,
      activeProfile: `${user.name.split(' ')[0]}'s Calm Home`
    }));
  };

  // ── Merchant sign-in handler ───────────────────────────────────────────
  const handleMerchantSignIn = (user) => {
    const enriched = { ...user, role: 'merchant' };
    setCurrentUser(enriched);
    saveSession('merchant', enriched);
    setAppState('merchant_app');
    setActiveScreen('seller_hub');
    showToast(`Welcome, ${user.name}! You're now signed in as a Merchant.`);
  };

  // ── Sign-out & return to landing ───────────────────────────────────────
  const handleSignOut = () => {
    const role = appState === 'merchant_app' ? 'merchant' : 'buyer';
    saveSession(role, null);
    // Also clear old key for backward compat
    localStorage.removeItem('cairn_google_user');
    setCurrentUser(null);
    saveAppState('landing');
    setAppState('landing');
    showToast('Signed out successfully.');
  };

  // ── Switch role: go back to landing ────────────────────────────────────
  const handleSwitchRole = () => {
    saveAppState('landing');
    setAppState('landing');
  };

  // ── In-app Google auth modal sign-in (for existing sessions) ───────────
  const handleSignIn = (user) => {
    const role = appState === 'merchant_app' ? 'merchant' : 'buyer';
    const enriched = { ...user, role };
    setCurrentUser(enriched);
    saveSession(role, enriched);
    showToast(`Welcome, ${user.name}! Authenticated with Google.`);
    setRules((prev) => ({
      ...prev,
      activeProfile: `${user.name.split(' ')[0]}'s Calm Home`
    }));
  };

  // ── Live location update handler ───────────────────────────────────────
  const handleUpdateLocation = (loc) => {
    setCurrentLocation(loc);
    localStorage.setItem('cairn_location', JSON.stringify(loc));
    setOrders((prev) =>
      prev.map((ord) => ({
        ...ord,
        destination: `${loc.locality}, ${currentUser ? currentUser.name.split(' ')[0] : 'Priya'}'s Residence, ${loc.city}`
      }))
    );
  };

  // ── Seller adds new artisan product ───────────────────────────────────
  const handleAddListing = (listing) => {
    setSellerListings((prev) => [listing, ...prev]);
  };

  // ── Quick navigation with prompt to Aria (now directly on Explore) ───
  const handleAskAria = (prompt) => {
    setChatPrompt(prompt);
    setActiveScreen('explore');
  };

  // ── Quick order from Picked For You ───────────────────────────────────
  const handleQuickOrder = (product) => {
    if (product.price > rules.approvalThreshold) {
      showToast(`Selected ${product.name}. This is above your ₹1,00,000 threshold and requires your explicit OK.`);
      setActiveScreen('needs_ok');
    } else {
      showToast(`Aria is auditing rules for ${product.name}...`);
      setChatPrompt(`Please verify rules and place order for the ${product.name}`);
      setActiveScreen('explore');
    }
  };

  // ── Screen-role auto-synchronization ──────────────────────────────────
  const handleNavigateToScreen = (screenId) => {
    const isSeller = ['seller_hub', 'store_health', 'seller_orders'].includes(screenId);
    if (isSeller && appState === 'buyer_app') {
      setAppState('merchant_app');
      setActiveScreen(screenId);
    } else if (!isSeller && appState === 'merchant_app') {
      setAppState('buyer_app');
      setActiveScreen(screenId);
    } else {
      setActiveScreen(screenId);
    }
  };

  // ── Approve an order ──────────────────────────────────────────────────
  const handleApproveOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'placed',
            stamps: {
              ...o.stamps,
              approval: {
                title: 'User Approved',
                desc: `Explicit authorization granted by ${currentUser ? currentUser.name.split(' ')[0] : 'Priya'}`,
                status: 'placed'
              }
            }
          };
        }
        return o;
      })
    );
  };

  // ── Reject / release hold on order ────────────────────────────────────
  const handleRejectOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'failed',
            flagReason: 'Hold released by user · No payment debited'
          };
        }
        return o;
      })
    );
    showToast(`Order #${orderId} hold released safely. Zero funds debited.`);
  };

  // ── Raise limit from Screen 4 ──────────────────────────────────────────
  const handleRaiseLimit = (newLimit) => {
    setRules((prev) => ({
      ...prev,
      monthlyCap: newLimit
    }));
    showToast(`Monthly spending cap updated to ₹${newLimit.toLocaleString('en-IN')}.`);
  };

  const pendingApprovalsCount = orders.filter((o) => o.status === 'needs_ok').length;

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: Pre-app screens (landing, login)
  // ════════════════════════════════════════════════════════════════════════
  if (appState === 'landing') {
    return (
      <>
        <LandingPage
          onSelectBuyer={handleSelectBuyer}
          onSelectMerchant={handleSelectMerchant}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </>
    );
  }

  if (appState === 'buyer_login') {
    return (
      <>
        <BuyerLoginPage
          onBack={handleBackToLanding}
          onSignIn={handleBuyerSignIn}
          onGuestContinue={handleBuyerSignIn}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </>
    );
  }

  if (appState === 'merchant_login') {
    return (
      <>
        <MerchantLoginPage
          onBack={handleBackToLanding}
          onSignIn={handleMerchantSignIn}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: Main app (buyer_app | merchant_app)
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-cream)' }}>
      {/* Primary Header */}
      <Header
        activeScreen={activeScreen}
        setActiveScreen={handleNavigateToScreen}
        dashboardMode={dashboardMode}
        setDashboardMode={(mode) => {
          if (mode === 'seller') { setAppState('merchant_app'); setActiveScreen('seller_hub'); }
          else { setAppState('buyer_app'); setActiveScreen('explore'); }
        }}
        currentUser={currentUser}
        currentLocation={currentLocation}
        onOpenSearch={() => setCommandPaletteOpen(true)}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenGoogleAuth={() => setGoogleAuthOpen(true)}
        onOpenLocationModal={() => setLocationModalOpen(true)}
        onOpenAddListing={() => setAddListingModalOpen(true)}
        onSwitchRole={handleSwitchRole}
        cartCount={pendingApprovalsCount}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {/* CUSTOMER DASHBOARD VIEWS */}
        {dashboardMode === 'customer' && (
          <>
            {activeScreen === 'explore' && (
              <Screen1_Home
                onAskAria={handleAskAria}
                onNavigateToScreen={handleNavigateToScreen}
                onQuickOrder={handleQuickOrder}
                onShowToast={showToast}
                currentUser={currentUser}
                currentLocation={currentLocation}
                rules={rules}
                setRules={setRules}
                orders={orders}
                onApproveOrder={handleApproveOrder}
                onRejectOrder={handleRejectOrder}
                onAddOrder={(newOrder) => setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)])}
                chatPrompt={chatPrompt}
                setChatPrompt={setChatPrompt}
              />
            )}
            {activeScreen === 'chat' && (
              <Screen2_Chat
                onNavigateToScreen={handleNavigateToScreen}
                onShowToast={showToast}
                initialPrompt={chatPrompt}
                currentUser={currentUser}
                currentLocation={currentLocation}
                rules={rules}
              />
            )}
            {activeScreen === 'needs_ok' && (
              <Screen3_NeedsOK
                orders={orders}
                onApproveOrder={handleApproveOrder}
                onRejectOrder={handleRejectOrder}
                onShowToast={showToast}
                onNavigateToScreen={handleNavigateToScreen}
                currentUser={currentUser}
                rules={rules}
              />
            )}
            {activeScreen === 'not_placed' && (
              <Screen4_NotPlaced
                onNavigateToScreen={handleNavigateToScreen}
                onRaiseLimit={handleRaiseLimit}
                onAskAriaAboutProduct={handleAskAria}
                onShowToast={showToast}
                currentUser={currentUser}
                rules={rules}
              />
            )}
            {activeScreen === 'orders' && (
              <Screen5_Orders
                orders={orders}
                onNavigateToScreen={handleNavigateToScreen}
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
                onNavigateToScreen={handleNavigateToScreen}
              />
            )}
          </>
        )}

        {/* SELLER DASHBOARD VIEWS */}
        {dashboardMode === 'seller' && (
          <>
            {activeScreen === 'seller_hub' && (
              <Screen7_SellerHub
                sellerListings={sellerListings}
                onOpenAddListing={() => setAddListingModalOpen(true)}
                currentLocation={currentLocation}
                onShowToast={showToast}
              />
            )}
            {activeScreen === 'store_health' && (
              <Screen8_StoreHealth
                onShowToast={showToast}
              />
            )}
            {activeScreen === 'seller_orders' && (
              <SellerOrderView
                orders={orders}
                currentLocation={currentLocation}
                onShowToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Global Pinned Floating Action Button: Ask Aria (Customer mode only, hidden on explore & chat) */}
      {dashboardMode === 'customer' && activeScreen !== 'explore' && activeScreen !== 'chat' && (
        <AskAriaFab
          onOpenChat={() => {
            handleNavigateToScreen('explore');
            setChatPrompt('What can I help you with today?');
          }}
          activeScreen={activeScreen}
        />
      )}

      {/* Command Palette (⌘K) Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        dashboardMode={dashboardMode}
        onSelectScreen={handleNavigateToScreen}
        onAskAriaWithPrompt={handleAskAria}
      />

      {/* Google Sign-in Identity Modal (in-app, for switching accounts) */}
      <GoogleAuthModal
        isOpen={googleAuthOpen}
        onClose={() => setGoogleAuthOpen(false)}
        currentUser={currentUser}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Live Geolocation Calibration Modal */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        currentLocation={currentLocation}
        onUpdateLocation={handleUpdateLocation}
        onShowToast={showToast}
      />

      {/* Merchant New Listing Verification Modal */}
      <AddListingModal
        isOpen={addListingModalOpen}
        onClose={() => setAddListingModalOpen(false)}
        onAddListing={handleAddListing}
        onShowToast={showToast}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        orders={orders}
        onNavigateToScreen={handleNavigateToScreen}
      />

      {/* Notification Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Reassurance Footer */}
      <Footer
        onNavigateToScreen={handleNavigateToScreen}
        dashboardMode={dashboardMode}
        setDashboardMode={(mode) => {
          if (mode === 'seller') { setAppState('merchant_app'); setActiveScreen('seller_hub'); }
          else { setAppState('buyer_app'); setActiveScreen('explore'); }
        }}
      />
    </div>
  );
}
