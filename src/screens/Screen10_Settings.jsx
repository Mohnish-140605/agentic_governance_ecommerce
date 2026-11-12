import React, { useState } from 'react';
import { 
  CreditCard, 
  MapPin, 
  User, 
  Bell, 
  Shield, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Lock
} from 'lucide-react';

export default function Screen10_Settings({ currentUser, onShowToast }) {
  const [activeTab, setActiveTab] = useState('payment'); // payment, addresses, account, notifications, security
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'pm_1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiry: '12/26',
      name: 'Priya Sharma',
      isDefault: true
    },
    {
      id: 'pm_2',
      type: 'upi',
      upiId: 'priya.sharma@okhdfcbank',
      name: 'Priya Sharma',
      isDefault: false
    },
    {
      id: 'pm_3',
      type: 'card',
      brand: 'Mastercard',
      last4: '8888',
      expiry: '03/25',
      name: 'Priya Sharma',
      isDefault: false
    }
  ]);

  // Mock addresses
  const [addresses, setAddresses] = useState([
    {
      id: 'addr_1',
      type: 'home',
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      line1: '123, 4th Floor, Green Park Extension',
      line2: 'Near Hauz Khas Metro Station',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
      isDefault: true
    },
    {
      id: 'addr_2',
      type: 'work',
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      line1: 'WeWork Galaxy, Residency Road',
      line2: 'Near MG Road Metro Station',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560025',
      isDefault: false
    }
  ]);

  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    email: currentUser?.email || 'priya.sharma@gmail.com',
    phone: '+91 98765 43210',
    name: currentUser?.name || 'Priya Sharma',
    language: 'English',
    currency: 'INR'
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    deliveryAlerts: true,
    promotionalEmails: false,
    smsNotifications: true,
    pushNotifications: true,
    weeklyDigest: false
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: '30 minutes',
    biometricEnabled: false
  });

  // New payment form state
  const [newPayment, setNewPayment] = useState({
    type: 'card',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });

  // New address form state
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const tabs = [
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard size={18} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> }
  ];

  const handleAddPayment = () => {
    if (newPayment.type === 'card') {
      if (!newPayment.cardNumber || !newPayment.cardName || !newPayment.expiry || !newPayment.cvv) {
        onShowToast('Please fill in all card details');
        return;
      }
      
      const last4 = newPayment.cardNumber.slice(-4);
      const brand = newPayment.cardNumber.startsWith('4') ? 'Visa' : 
                   newPayment.cardNumber.startsWith('5') ? 'Mastercard' : 'Card';
      
      const payment = {
        id: `pm_${Date.now()}`,
        type: 'card',
        brand,
        last4,
        expiry: newPayment.expiry,
        name: newPayment.cardName,
        isDefault: paymentMethods.length === 0
      };
      
      setPaymentMethods([...paymentMethods, payment]);
    } else if (newPayment.type === 'upi') {
      if (!newPayment.upiId) {
        onShowToast('Please enter UPI ID');
        return;
      }
      
      const payment = {
        id: `pm_${Date.now()}`,
        type: 'upi',
        upiId: newPayment.upiId,
        name: accountSettings.name,
        isDefault: paymentMethods.length === 0
      };
      
      setPaymentMethods([...paymentMethods, payment]);
    }
    
    setNewPayment({ type: 'card', cardNumber: '', cardName: '', expiry: '', cvv: '', upiId: '' });
    setShowAddPayment(false);
    onShowToast('Payment method added successfully');
  };

  const handleDeletePayment = (id) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    onShowToast('Payment method removed');
  };

  const handleSetDefaultPayment = (id) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
    onShowToast('Default payment method updated');
  };

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      onShowToast('Please fill in all required fields');
      return;
    }
    
    const address = {
      id: `addr_${Date.now()}`,
      ...newAddress,
      isDefault: addresses.length === 0
    };
    
    setAddresses([...addresses, address]);
    setNewAddress({ type: 'home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false });
    setShowAddAddress(false);
    onShowToast('Address added successfully');
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    onShowToast('Address removed');
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    onShowToast('Default address updated');
  };

  const handleSaveAccount = () => {
    onShowToast('Account settings saved');
  };

  const handleSaveNotifications = () => {
    onShowToast('Notification preferences saved');
  };

  const handleSaveSecurity = () => {
    onShowToast('Security settings saved');
  };

  return (
    <div className="settings-screen-wrap animate-fade-in" style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-cream)',
      padding: 'clamp(20px, 4vw, 40px)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <Settings size={28} color="var(--forest-green)" />
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 600,
              color: 'var(--ink)',
              margin: 0
            }}>
              Settings
            </h1>
          </div>
          <p style={{
            fontSize: '15px',
            color: 'var(--ink-secondary)',
            margin: 0
          }}>
            Manage your payment methods, addresses, and account preferences
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          borderBottom: '1px solid var(--border-cream)',
          paddingBottom: '0'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--forest-green)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--forest-green)' : 'var(--ink-secondary)',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '-1px'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--border-cream)',
          padding: 'clamp(20px, 4vw, 32px)',
          boxShadow: 'var(--shadow-warm-sm)'
        }}>
          {/* Payment Methods Tab */}
          {activeTab === 'payment' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <div>
                  <h2 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    margin: '0 0 4px 0'
                  }}>
                    Payment Methods
                  </h2>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--ink-secondary)',
                    margin: 0
                  }}>
                    Manage your cards and UPI IDs for checkout
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPayment(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    backgroundColor: 'var(--forest-green)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Plus size={16} />
                  Add Payment Method
                </button>
              </div>

              {/* Payment Methods List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      backgroundColor: pm.isDefault ? 'var(--forest-green-light)' : 'var(--bg-cream-subtle)',
                      borderRadius: '12px',
                      border: pm.isDefault ? '2px solid var(--forest-green)' : '1px solid var(--border-cream)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-cream)'
                      }}>
                        {pm.type === 'card' ? (
                          <CreditCard size={24} color="var(--forest-green)" />
                        ) : (
                          <Smartphone size={24} color="var(--forest-green)" />
                        )}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--ink)',
                          marginBottom: '2px'
                        }}>
                          {pm.type === 'card' ? `${pm.brand} •••• ${pm.last4}` : pm.upiId}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--ink-secondary)'
                        }}>
                          {pm.type === 'card' ? `Expires ${pm.expiry}` : 'UPI Payment'} • {pm.name}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {pm.isDefault && (
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: 'var(--forest-green)',
                          color: '#FFFFFF',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '11px',
                          fontWeight: 600
                        }}>
                          Default
                        </span>
                      )}
                      {!pm.isDefault && (
                        <button
                          onClick={() => handleSetDefaultPayment(pm.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-cream)',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--ink-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePayment(pm.id)}
                        style={{
                          padding: '6px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: 'var(--coral-dark)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Payment Modal */}
              {showAddPayment && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}>
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '32px',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '24px'
                    }}>
                      <h3 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '20px',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        margin: 0
                      }}>
                        Add Payment Method
                      </h3>
                      <button
                        onClick={() => setShowAddPayment(false)}
                        style={{
                          padding: '8px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--ink-secondary)'
                        }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Payment Type Selection */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '12px',
                      marginBottom: '24px'
                    }}>
                      <button
                        onClick={() => setNewPayment({ ...newPayment, type: 'card' })}
                        style={{
                          padding: '16px',
                          backgroundColor: newPayment.type === 'card' ? 'var(--forest-green-light)' : 'var(--bg-cream-subtle)',
                          border: newPayment.type === 'card' ? '2px solid var(--forest-green)' : '1px solid var(--border-cream)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <CreditCard size={24} color="var(--forest-green)" style={{ marginBottom: '8px' }} />
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>Credit/Debit Card</div>
                      </button>
                      <button
                        onClick={() => setNewPayment({ ...newPayment, type: 'upi' })}
                        style={{
                          padding: '16px',
                          backgroundColor: newPayment.type === 'upi' ? 'var(--forest-green-light)' : 'var(--bg-cream-subtle)',
                          border: newPayment.type === 'upi' ? '2px solid var(--forest-green)' : '1px solid var(--border-cream)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Smartphone size={24} color="var(--forest-green)" style={{ marginBottom: '8px' }} />
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>UPI</div>
                      </button>
                    </div>

                    {/* Card Form */}
                    {newPayment.type === 'card' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={newPayment.cardNumber}
                            onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid var(--border-cream)',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                            Name on Card
                          </label>
                          <input
                            type="text"
                            placeholder="Priya Sharma"
                            value={newPayment.cardName}
                            onChange={(e) => setNewPayment({ ...newPayment, cardName: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid var(--border-cream)',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={newPayment.expiry}
                              onChange={(e) => setNewPayment({ ...newPayment, expiry: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid var(--border-cream)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                              CVV
                            </label>
                            <input
                              type="password"
                              placeholder="123"
                              value={newPayment.cvv}
                              onChange={(e) => setNewPayment({ ...newPayment, cvv: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid var(--border-cream)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPI Form */}
                    {newPayment.type === 'upi' && (
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                          UPI ID
                        </label>
                        <input
                          type="text"
                          placeholder="yourname@okhdfcbank"
                          value={newPayment.upiId}
                          onChange={(e) => setNewPayment({ ...newPayment, upiId: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid var(--border-cream)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      marginTop: '24px'
                    }}>
                      <button
                        onClick={() => setShowAddPayment(false)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: 'var(--bg-cream-subtle)',
                          border: '1px solid var(--border-cream)',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--ink)',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddPayment}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: 'var(--forest-green)',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          cursor: 'pointer'
                        }}
                      >
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <div>
                  <h2 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    margin: '0 0 4px 0'
                  }}>
                    Saved Addresses
                  </h2>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--ink-secondary)',
                    margin: 0
                  }}>
                    Manage your delivery addresses
                  </p>
                </div>
                <button
                  onClick={() => setShowAddAddress(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    backgroundColor: 'var(--forest-green)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Plus size={16} />
                  Add Address
                </button>
              </div>

              {/* Addresses List */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: '16px'
              }}>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      padding: '20px',
                      backgroundColor: addr.isDefault ? 'var(--forest-green-light)' : 'var(--bg-cream-subtle)',
                      borderRadius: '12px',
                      border: addr.isDefault ? '2px solid var(--forest-green)' : '1px solid var(--border-cream)',
                      position: 'relative'
                    }}
                  >
                    {addr.isDefault && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px 12px',
                        backgroundColor: 'var(--forest-green)',
                        color: '#FFFFFF',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        Default
                      </span>
                    )}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        marginBottom: '4px'
                      }}>
                        {addr.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--ink-secondary)',
                        marginBottom: '8px'
                      }}>
                        {addr.phone}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: 'var(--ink)',
                        lineHeight: 1.5
                      }}>
                        {addr.line1}
                        {addr.line2 && <><br />{addr.line2}</>}
                        <br />{addr.city}, {addr.state} - {addr.pincode}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '16px'
                    }}>
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-cream)',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--ink-secondary)',
                            cursor: 'pointer'
                          }}
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        style={{
                          padding: '8px',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--coral-border)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--coral-dark)',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {showAddAddress && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}>
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '32px',
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '24px'
                    }}>
                      <h3 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '20px',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        margin: 0
                      }}>
                        Add New Address
                      </h3>
                      <button
                        onClick={() => setShowAddAddress(false)}
                        style={{
                          padding: '8px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--ink-secondary)'
                        }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                            Address Type
                          </label>
                          <select
                            value={newAddress.type}
                            onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid var(--border-cream)',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                            Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="Priya Sharma"
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid var(--border-cream)',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid var(--border-cream)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          placeholder="House/Flat No, Building Name, Street"
                          value={newAddress.line1}
                          onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid var(--border-cream)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                          Address Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Landmark, Area"
                          value={newAddress.line2}
                          onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid var(--border-cream)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                            City
                          </label>
                          <input
                            type="text"
                            placeholder="New Delhi"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid var(--border-cream)',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                            State
                          </label>
                          <input
                            type="text"
                            placeholder="Delhi"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid var(--border-cream)',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                            PIN Code
                          </label>
                          <input
                            type="text"
                            placeholder="110016"
                            value={newAddress.pincode}
                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid var(--border-cream)',
                              borderRadius: '8px',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <input
                          type="checkbox"
                          id="setDefault"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <label htmlFor="setDefault" style={{ fontSize: '13px', color: 'var(--ink)', cursor: 'pointer' }}>
                          Set as default address
                        </label>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      marginTop: '24px'
                    }}>
                      <button
                        onClick={() => setShowAddAddress(false)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: 'var(--bg-cream-subtle)',
                          border: '1px solid var(--border-cream)',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--ink)',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddAddress}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: 'var(--forest-green)',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          cursor: 'pointer'
                        }}
                      >
                        Add Address
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--ink)',
                marginBottom: '24px'
              }}>
                Account Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={accountSettings.name}
                    onChange={(e) => setAccountSettings({ ...accountSettings, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border-cream)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={accountSettings.email}
                    onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border-cream)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={accountSettings.phone}
                    onChange={(e) => setAccountSettings({ ...accountSettings, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border-cream)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                      Language
                    </label>
                    <select
                      value={accountSettings.language}
                      onChange={(e) => setAccountSettings({ ...accountSettings, language: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid var(--border-cream)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                      Currency
                    </label>
                    <select
                      value={accountSettings.currency}
                      onChange={(e) => setAccountSettings({ ...accountSettings, currency: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid var(--border-cream)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSaveAccount}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--forest-green)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--ink)',
                marginBottom: '24px'
              }}>
                Notification Preferences
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { key: 'orderUpdates', label: 'Order Updates', description: 'Get notified about order status changes' },
                  { key: 'deliveryAlerts', label: 'Delivery Alerts', description: 'Receive alerts about delivery status' },
                  { key: 'promotionalEmails', label: 'Promotional Emails', description: 'Receive offers and promotions' },
                  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Get important updates via SMS' },
                  { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications on your device' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Get a weekly summary of your activity' }
                ].map((item) => (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      backgroundColor: 'var(--bg-cream-subtle)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-cream)'
                    }}
                  >
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        marginBottom: '4px'
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--ink-secondary)'
                      }}>
                        {item.description}
                      </div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({
                        ...notificationSettings,
                        [item.key]: !notificationSettings[item.key]
                      })}
                      style={{
                        width: '48px',
                        height: '26px',
                        borderRadius: '13px',
                        backgroundColor: notificationSettings[item.key] ? 'var(--forest-green)' : 'var(--border-cream)',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        position: 'absolute',
                        top: '3px',
                        left: notificationSettings[item.key] ? '25px' : '3px',
                        transition: 'left 0.2s ease'
                      }} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleSaveNotifications}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--forest-green)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                    marginTop: '8px'
                  }}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--ink)',
                marginBottom: '24px'
              }}>
                Security Settings
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: 'var(--bg-cream-subtle)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-cream)'
                  }}
                >
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--ink)',
                      marginBottom: '4px'
                    }}>
                      Two-Factor Authentication
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--ink-secondary)'
                    }}>
                      Add an extra layer of security to your account
                    </div>
                  </div>
                  <button
                    onClick={() => setSecuritySettings({
                      ...securitySettings,
                      twoFactorEnabled: !securitySettings.twoFactorEnabled
                    })}
                    style={{
                      width: '48px',
                      height: '26px',
                      borderRadius: '13px',
                      backgroundColor: securitySettings.twoFactorEnabled ? 'var(--forest-green)' : 'var(--border-cream)',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      position: 'absolute',
                      top: '3px',
                      left: securitySettings.twoFactorEnabled ? '25px' : '3px',
                      transition: 'left 0.2s ease'
                    }} />
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: 'var(--bg-cream-subtle)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-cream)'
                  }}
                >
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--ink)',
                      marginBottom: '4px'
                    }}>
                      Login Alerts
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--ink-secondary)'
                    }}>
                      Get notified when someone logs into your account
                    </div>
                  </div>
                  <button
                    onClick={() => setSecuritySettings({
                      ...securitySettings,
                      loginAlerts: !securitySettings.loginAlerts
                    })}
                    style={{
                      width: '48px',
                      height: '26px',
                      borderRadius: '13px',
                      backgroundColor: securitySettings.loginAlerts ? 'var(--forest-green)' : 'var(--border-cream)',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      position: 'absolute',
                      top: '3px',
                      left: securitySettings.loginAlerts ? '25px' : '3px',
                      transition: 'left 0.2s ease'
                    }} />
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: 'var(--bg-cream-subtle)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-cream)'
                  }}
                >
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--ink)',
                      marginBottom: '4px'
                    }}>
                      Biometric Authentication
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--ink-secondary)'
                    }}>
                      Use fingerprint or face recognition for quick login
                    </div>
                  </div>
                  <button
                    onClick={() => setSecuritySettings({
                      ...securitySettings,
                      biometricEnabled: !securitySettings.biometricEnabled
                    })}
                    style={{
                      width: '48px',
                      height: '26px',
                      borderRadius: '13px',
                      backgroundColor: securitySettings.biometricEnabled ? 'var(--forest-green)' : 'var(--border-cream)',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      position: 'absolute',
                      top: '3px',
                      left: securitySettings.biometricEnabled ? '25px' : '3px',
                      transition: 'left 0.2s ease'
                    }} />
                  </button>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>
                    Session Timeout
                  </label>
                  <select
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--border-cream)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="15 minutes">15 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                    <option value="Never">Never</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveSecurity}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--forest-green)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                    marginTop: '8px'
                  }}
                >
                  Save Security Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
