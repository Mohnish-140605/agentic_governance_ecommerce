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

export default function App() {
  // Role & Dashboard Mode: 'customer' | 'seller'
  const [dashboardMode, setDashboardMode] = useState(() => {
    return localStorage.getItem('cairn_dashboard_mode') || 'customer';
  });

  const [activeScreen, setActiveScreen] = useState('explore');
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

  // Authenticated Google User
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cairn_google_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
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

  // Global keyboard shortcut for ⌘K
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

  // Save dashboard mode preference
  useEffect(() => {
    localStorage.setItem('cairn_dashboard_mode', dashboardMode);
  }, [dashboardMode]);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  // Google Sign-In handler
  const handleSignIn = (user) => {
    setCurrentUser(user);
    localStorage.setItem('cairn_google_user', JSON.stringify(user));
    showToast(`Welcome, ${user.name}! Authenticated with Google.`);

    // Adapt rule profile name
    setRules((prev) => ({
      ...prev,
      activeProfile: `${user.name.split(' ')[0]}'s Calm Home`
    }));
  };

  // Google Sign-Out handler
  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('cairn_google_user');
    showToast('Signed out of Google session.');
  };

  // Live location update handler
  const handleUpdateLocation = (loc) => {
    setCurrentLocation(loc);
    localStorage.setItem('cairn_location', JSON.stringify(loc));

    // Update active orders destination with live address
    setOrders((prev) =>
      prev.map((ord) => ({
        ...ord,
        destination: `${loc.locality}, ${currentUser ? currentUser.name.split(' ')[0] : 'Priya'}'s Residence, ${loc.city}`
      }))
    );
  };

  // Seller adds new artisan product
  const handleAddListing = (listing) => {
    setSellerListings((prev) => [listing, ...prev]);
  };

  // Quick navigation with prompt to Aria
  const handleAskAria = (prompt) => {
    setChatPrompt(prompt);
    setActiveScreen('chat');
  };

  // Quick order from Picked For You
  const handleQuickOrder = (product) => {
    if (product.price > rules.approvalThreshold) {
      showToast(`Selected ${product.name}. This is above your ₹1,00,000 threshold and requires your explicit OK.`);
      setActiveScreen('needs_ok');
    } else {
      showToast(`Aria is auditing rules for ${product.name}...`);
      setChatPrompt(`Please verify rules and place order for the ${product.name}`);
      setActiveScreen('chat');
    }
  };

  // Approve an order
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

  // Reject / release hold on order
  const handleRejectOrder = (orderId) => {
    showToast(`Order #${orderId} hold released safely.`);
  };

  // Raise limit from Screen 4
  const handleRaiseLimit = (newLimit) => {
    setRules((prev) => ({
      ...prev,
      monthlyCap: newLimit
    }));
    showToast(`Monthly spending cap updated to ₹${newLimit.toLocaleString('en-IN')}.`);
  };

  // Count pending approvals
  const pendingApprovalsCount = orders.filter((o) => o.status === 'needs_ok').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-cream)' }}>
      {/* Primary Header with Role Switcher, Google Identity & Live Location */}
      <Header
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        dashboardMode={dashboardMode}
        setDashboardMode={setDashboardMode}
        currentUser={currentUser}
        currentLocation={currentLocation}
        onOpenSearch={() => setCommandPaletteOpen(true)}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenGoogleAuth={() => setGoogleAuthOpen(true)}
        onOpenLocationModal={() => setLocationModalOpen(true)}
        onOpenAddListing={() => setAddListingModalOpen(true)}
        cartCount={orders.filter(o => o.status === 'needs_ok' || o.status === 'placed').length}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* CUSTOMER DASHBOARD VIEWS */}
        {dashboardMode === 'customer' && (
          <>
            {activeScreen === 'explore' && (
              <Screen1_Home
                onAskAria={handleAskAria}
                onNavigateToScreen={setActiveScreen}
                onQuickOrder={handleQuickOrder}
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
                onApproveOrder={handleApproveOrder}
                onRejectOrder={handleRejectOrder}
                onShowToast={showToast}
                onNavigateToScreen={setActiveScreen}
              />
            )}

            {activeScreen === 'not_placed' && (
              <Screen4_NotPlaced
                onNavigateToScreen={setActiveScreen}
                onRaiseLimit={handleRaiseLimit}
                onAskAriaAboutProduct={handleAskAria}
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

      {/* Global Pinned Floating Action Button: Ask Aria (Customer mode only) */}
      {dashboardMode === 'customer' && (
        <AskAriaFab
          onOpenChat={() => setActiveScreen('chat')}
          activeScreen={activeScreen}
        />
      )}

      {/* Command Palette (⌘K) Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectScreen={(screenId) => {
          // Switch to appropriate dashboard mode if selecting a screen from the other role
          if (['seller_hub', 'store_health', 'seller_orders'].includes(screenId)) {
            setDashboardMode('seller');
          } else {
            setDashboardMode('customer');
          }
          setActiveScreen(screenId);
        }}
        onAskAriaWithPrompt={handleAskAria}
      />

      {/* Google Sign-in Identity Modal */}
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
        onNavigateToScreen={setActiveScreen}
      />

      {/* Notification Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Reassurance Footer */}
      <Footer onNavigateToScreen={setActiveScreen} />
    </div>
  );
}
