import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic,
  SlidersHorizontal,
  Truck,
  Lock
} from 'lucide-react';
import TrustReceipt from '../components/TrustReceipt';

let msgCounter = 100;

export default function Screen2_Chat({
  onNavigateToScreen,
  onShowToast,
  initialPrompt = '',
  currentUser,
  currentLocation: _currentLocation,
  rules
}) {
  const userName = currentUser ? currentUser.name.split(' ')[0] : 'Priya';
  const processedPromptRef = useRef(initialPrompt);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      name: userName,
      time: '10:42 AM',
      text: initialPrompt || 'Could you pick and order that Framework Laptop 13 we looked at?'
    },
    {
      id: 2,
      sender: 'aria',
      name: 'Aria',
      time: '10:42 AM',
      badge: 'Rule Checked',
      text: 'Found the exact configuration: 16GB RAM, 512GB SSD, silent typing profile. Verified merchant, ₹94,990. Let me check your rules.'
    },
    {
      id: 3,
      sender: 'system_card',
      cardType: 'product',
      item: {
        name: 'Framework Laptop 13',
        tag: 'CERTIFIED MODULE',
        partner: 'DIRECT PARTNER DIRECT DELIVERY',
        batch: 'Batch #FW-139',
        specs: 'Matte anti-glare display, AMD Ryzen 7, swappable USB-C & HDMI modular chassis.',
        price: 94990,
        delivery: 'Thu, 24 Oct',
        image: '/assets/framework_laptop.jpg'
      }
    },
    {
      id: 4,
      sender: 'aria',
      name: 'Aria',
      time: '10:43 AM',
      text: `Everything clears your caps nicely. I've placed the order for you, ${userName}.`
    },
    {
      id: 5,
      sender: 'system_card',
      cardType: 'receipt',
      receiptData: {
        id: 'CRN-9842',
        item: 'Framework 13',
        price: 94990,
        status: 'placed',
        authorizedAt: 'Today, 10:43 AM',
        paymentChannel: 'HDFC Priority ••4902',
        sha256: '7f920eb18a24c559d81a942005a1'
      }
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestionChips = [
    { label: "Customize modular ports before dispatch", icon: "ports" },
    { label: "Add delivery to my personal calendar", icon: "calendar" },
    { label: "Show remaining monthly allowance", icon: "budget" }
  ];

  const handleSend = React.useCallback((textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg = {
      id: ++msgCounter,
      sender: 'user',
      name: userName,
      time: 'Just now',
      text: text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate Aria's thoughtful, calm response
    setTimeout(() => {
      setIsTyping(false);
      let replyText = `I've noted that for you, ${userName}. The order parameters remain strictly bound by your rules.`;
      
      const lower = text.toLowerCase();
      if (lower.includes('calendar')) {
        replyText = "Delivery event for Thursday, 24 Oct (10:00 AM - 2:00 PM) has been mindfully added to your calendar.";
      } else if (lower.includes('port') || lower.includes('customize')) {
        replyText = "Noted. I have instructed Framework support to include 2x USB-C, 1x USB-A, and 1x HDMI expansion modules in your sealed parcel.";
      } else if (lower.includes('allowance') || lower.includes('budget') || lower.includes('rule')) {
        const cap = rules ? rules.monthlyCap.toLocaleString('en-IN') : '50,000';
        replyText = `Your monthly spending cap is ₹${cap} for regular purchases. All transactions are audited and held strictly within your personal boundaries.`;
      } else if (lower.includes('cancel')) {
        replyText = "Your 15-minute tranquility hold is active. With one tap, I can release this order back to inventory without any transaction fee.";
      } else if (lower.includes('laptop') || lower.includes('60,000') || lower.includes('study')) {
        replyText = "I found the Asus ZenBook OLED and Acer Swift Go 14. Both feature whisper-quiet fans, 16GB RAM, and fall safely under your ₹60,000 limit with verified merchant authenticity.";
      } else if (lower.includes('coffee') || lower.includes('bean') || lower.includes('restock')) {
        replyText = "Restocking 2x 250g Blue Tokai Whole Bean Arabica (Dark Roast). Total is ₹1,120, well below your pantry allowance. Would you like me to mint the Trust Receipt?";
      } else if (lower.includes('linen') || lower.includes('sheet') || lower.includes('bed')) {
        replyText = "Sourced 100% Organic Percale Linen Bedding set from certified weavers in Jaipur (₹4,800). Within your living budget and origin verified.";
      }

      const ariaMsg = {
        id: ++msgCounter,
        sender: 'aria',
        name: 'Aria',
        time: 'Just now',
        badge: 'Rule Checked',
        text: replyText
      };

      setMessages((prev) => [...prev, ariaMsg]);
    }, 900);
  }, [inputVal, userName, rules]);

  // Trigger auto-send if a new prompt arrives from Screen 1 or Command Palette
  useEffect(() => {
    if (initialPrompt && initialPrompt !== processedPromptRef.current) {
      processedPromptRef.current = initialPrompt;
      handleSend(initialPrompt);
    }
  }, [initialPrompt, handleSend]);

  const handleTrackOrder = () => {
    onNavigateToScreen('orders');
    if (onShowToast) onShowToast("Navigated to Order Tracking for Framework 13.");
  };

  return (
    <div className="chat-screen-wrap animate-fade-in" style={{ paddingBottom: '90px' }}>
      {/* Top Context Thread Banner */}
      <div style={{
        maxWidth: '820px',
        margin: '20px auto 0',
        padding: '0 20px'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border-cream)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-warm-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span>ARIA MINDFUL AGENT</span>
            <span style={{ color: 'var(--ink-muted)', fontWeight: 400 }}>· Hardware Curation Thread</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              backgroundColor: 'var(--butter-yellow-light)',
              color: 'var(--butter-yellow-dark)',
              border: '1px solid var(--butter-yellow-border)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}>
              AUTONOMOUS EXECUTION ACTIVE
            </span>
            <button 
              onClick={() => onNavigateToScreen('rules')}
              title="View active spending rules"
              style={{ padding: '4px', color: 'var(--ink-secondary)' }}
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Conversation Canvas */}
      <div style={{
        maxWidth: '820px',
        margin: '24px auto 0',
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px'
      }}>
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '4px', marginRight: '6px' }}>
                  {msg.name} · {msg.time}
                </div>
                <div style={{
                  backgroundColor: '#ECE7DD',
                  color: 'var(--ink)',
                  padding: '16px 22px',
                  borderRadius: '24px 24px 6px 24px',
                  maxWidth: '75%',
                  fontSize: '15.5px',
                  lineHeight: 1.5,
                  boxShadow: 'var(--shadow-warm-sm)'
                }}>
                  {msg.text}
                </div>
              </div>
            );
          }

          if (msg.sender === 'aria') {
            return (
              <div key={msg.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {/* Aria Avatar */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--forest-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0
                }}>
                  <Sparkles size={16} />
                </div>

                <div style={{ maxWidth: '85%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{msg.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{msg.time}</span>
                    {msg.badge && (
                      <span className="badge-placed" style={{ fontSize: '10.5px', padding: '1px 8px' }}>
                        {msg.badge}
                      </span>
                    )}
                  </div>

                  <div style={{
                    backgroundColor: '#FFFFFF',
                    color: 'var(--ink)',
                    padding: '18px 24px',
                    borderRadius: '6px 24px 24px 24px',
                    fontSize: '15.5px',
                    lineHeight: 1.6,
                    border: '1px solid var(--border-cream)',
                    boxShadow: 'var(--shadow-warm-sm)'
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          }

          if (msg.sender === 'system_card' && msg.cardType === 'product') {
            const item = msg.item;
            return (
              <div key={msg.id} style={{ paddingLeft: '48px' }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  border: '1px solid var(--border-cream)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-warm-md)',
                  display: 'grid',
                  gridTemplateColumns: '220px 1fr',
                  gap: '20px',
                  alignItems: 'center'
                }} className="chat-product-card">
                  {/* Photo with Badge */}
                  <div style={{
                    position: 'relative',
                    height: '150px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: '#FAF5EE'
                  }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: 'var(--forest-green)',
                      border: '1px solid var(--border-cream)'
                    }}>
                      {item.tag}
                    </span>
                  </div>

                  {/* Details */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, color: 'var(--forest-green)' }}>
                        {item.partner}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{item.batch}</span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, marginBottom: '6px' }}>
                      {item.name}
                    </h3>

                    <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '14px', lineHeight: 1.45 }}>
                      {item.specs}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--border-cream-subtle)'
                    }}>
                      <div>
                        <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Pre-tax & Courier</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>₹{item.price.toLocaleString('en-IN')}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--ink-secondary)' }}>
                        <Truck size={14} color="var(--forest-green)" />
                        <span>{item.delivery}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (msg.sender === 'system_card' && msg.cardType === 'receipt') {
            const r = msg.receiptData;
            return (
              <div key={msg.id} style={{ paddingLeft: '48px' }}>
                <TrustReceipt
                  id={r.id}
                  item={r.item}
                  price={r.price}
                  status="placed"
                  title="Order Trust Ledger"
                  subtitle="VERIFIED INTENT VOUCHER"
                  authorizedAt={r.authorizedAt}
                  paymentChannel={r.paymentChannel}
                  sha256={r.sha256}
                  onTrackOrder={handleTrackOrder}
                  onShowToast={onShowToast}
                />
              </div>
            );
          }

          return null;
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--forest-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Sparkles size={14} />
            </div>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-pill)',
              padding: '10px 18px',
              border: '1px solid var(--border-cream)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>Aria is verifying rules...</span>
              <span className="pulse-badge" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--forest-green)' }} />
            </div>
          </div>
        )}

        {/* Suggestion Chips */}
        <div style={{ paddingLeft: '48px', marginTop: '4px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.04em', marginBottom: '8px' }}>
            SUGGESTIONS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.label)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-cream)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '7px 14px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--ink)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: 'var(--shadow-warm-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-cream-subtle)';
                  e.currentTarget.style.borderColor = 'var(--forest-green-border)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = 'var(--border-cream)';
                }}
              >
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Chat Input Box Fixed to Bottom */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        backgroundColor: 'rgba(251, 247, 240, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--border-cream)',
        padding: '12px 20px 18px'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-pill)',
              border: '1.5px solid var(--border-cream)',
              boxShadow: 'var(--shadow-warm-md)',
              padding: '6px 8px 6px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Aria to adjust rules, request expedited dispatch, or source accessories..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '15px',
                color: 'var(--ink)',
                backgroundColor: 'transparent'
              }}
            />
            <button
              type="button"
              style={{ padding: '8px', color: 'var(--ink-muted)' }}
              title="Voice query"
            >
              <Mic size={18} />
            </button>
            <button
              type="submit"
              disabled={!inputVal.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: inputVal.trim() ? 'var(--forest-green)' : 'var(--bg-cream-subtle)',
                color: inputVal.trim() ? '#FFFFFF' : 'var(--ink-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputVal.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={16} />
            </button>
          </form>

          {/* Subtext */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '11.5px',
            color: 'var(--ink-muted)',
            marginTop: '8px'
          }}>
            <Lock size={12} />
            <span>Aria holds delegated authority strictly up to ₹1,00,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
