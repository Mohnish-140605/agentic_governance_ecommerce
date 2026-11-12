import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  SlidersHorizontal,
  Truck,
  Lock,
  Plus,
  RotateCcw,
  Search,
  Filter,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import TrustReceipt from '../components/TrustReceipt';
import VoiceModal from '../components/VoiceModal';

let msgCounter = 200;

// Aria's conversational states
const ARIA_STATES = {
  IDLE: 'idle',
  ASKING: 'asking',
  SEARCHING: 'searching',
  SHOWING_RESULTS: 'showing_results',
  GOVERNANCE_CHECK: 'governance_check',
  CONFIRMING: 'confirming'
};

// Product search results
const PRODUCT_DATABASE = {
  laptops: [
    {
      id: 'laptop-1',
      name: 'Framework Laptop 13',
      price: 94990,
      specs: '16GB RAM, 512GB SSD, AMD Ryzen 7',
      merchant: 'Framework Direct',
      image: '/assets/framework_laptop.jpg',
      governance: { status: 'approved', score: 98 },
      delivery: 'Thu, 24 Oct'
    },
    {
      id: 'laptop-2',
      name: 'ASUS ZenBook 14 OLED',
      price: 58990,
      specs: '16GB LPDDR5, 512GB NVMe, Whisper-quiet fans',
      merchant: 'ASUS Official',
      image: '/assets/zenbook.jpg',
      governance: { status: 'approved', score: 95 },
      delivery: 'Wed, 23 Oct'
    },
    {
      id: 'laptop-3',
      name: 'Lenovo IdeaPad Slim 3',
      price: 28990,
      specs: '8GB DDR4, 512GB NVMe, Thermal acoustic damping',
      merchant: 'Lenovo Certified',
      image: '/assets/framework_laptop.jpg',
      governance: { status: 'approved', score: 92 },
      delivery: 'Tomorrow, 4:00 PM'
    }
  ],
  coffee: [
    {
      id: 'coffee-1',
      name: 'Blue Tokai Whole Bean Arabica',
      price: 560,
      specs: '250g Dark Roast, Single Origin',
      merchant: 'Blue Tokai Roasters',
      image: '/assets/kinto_coffee.jpg',
      governance: { status: 'approved', score: 96 },
      delivery: 'Tomorrow'
    }
  ],
  bedding: [
    {
      id: 'bedding-1',
      name: 'Tekla Percale Linen Bedding',
      price: 4800,
      specs: '100% Organic, Queen Size, Handloom',
      merchant: 'Tekla Home',
      image: '/assets/tekla_bedding.jpg',
      governance: { status: 'approved', score: 94 },
      delivery: 'Fri, 26 Oct'
    }
  ]
};

// Aria's question templates
const ARIA_QUESTIONS = {
  budget: "What's your budget range?",
  category: "What type of product are you looking for?",
  priority: "What's most important to you - price, quality, or delivery speed?",
  specifications: "Any specific requirements or preferences?"
};

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
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ariaState, setAriaState] = useState(ARIA_STATES.IDLE);
  const [searchContext, setSearchContext] = useState({
    category: null,
    budget: null,
    preferences: []
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle initial prompt
  useEffect(() => {
    if (initialPrompt && initialPrompt !== processedPromptRef.current) {
      processedPromptRef.current = initialPrompt;
      handleUserQuery(initialPrompt);
    }
  }, [initialPrompt]);

  // Add message helper
  const addMessage = (sender, text, options = {}) => {
    const msg = {
      id: ++msgCounter,
      sender,
      name: sender === 'user' ? userName : 'Aria',
      time: 'Just now',
      text,
      ...options
    };
    setMessages(prev => [...prev, msg]);
    return msg;
  };

  // Aria asks clarifying questions
  const askClarifyingQuestions = (query) => {
    setAriaState(ARIA_STATES.ASKING);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      // Analyze query to determine what to ask
      const lower = query.toLowerCase();
      let questions = [];

      if (!lower.includes('laptop') && !lower.includes('coffee') && !lower.includes('linen') && !lower.includes('bed')) {
        questions.push(ARIA_QUESTIONS.category);
      }

      if (!lower.includes('₹') && !lower.includes('budget') && !lower.includes('under') && !lower.includes('k')) {
        questions.push(ARIA_QUESTIONS.budget);
      }

      if (!lower.includes('quiet') && !lower.includes('fast') && !lower.includes('cheap') && !lower.includes('premium')) {
        questions.push(ARIA_QUESTIONS.priority);
      }

      if (questions.length === 0) {
        // Enough info, proceed to search
        performSearch(query);
      } else {
        // Ask first question
        addMessage('aria', questions[0], {
          badge: 'Clarifying',
          state: ARIA_STATES.ASKING,
          questions: questions.slice(1),
          originalQuery: query
        });
      }
    }, 800);
  };

  // Perform product search
  const performSearch = (query, context = searchContext) => {
    setAriaState(ARIA_STATES.SEARCHING);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      // Determine category
      const lower = query.toLowerCase();
      let category = 'laptops'; // default
      if (lower.includes('coffee') || lower.includes('bean')) category = 'coffee';
      if (lower.includes('linen') || lower.includes('bed') || lower.includes('sheet')) category = 'bedding';

      // Get products
      let results = PRODUCT_DATABASE[category] || [];

      // Filter by budget if specified
      if (context.budget) {
        results = results.filter(p => p.price <= context.budget);
      }

      setSearchResults(results);
      setAriaState(ARIA_STATES.SHOWING_RESULTS);

      if (results.length > 0) {
        addMessage('aria', `I found ${results.length} ${category} option${results.length > 1 ? 's' : ''} that match your criteria:`, {
          badge: 'Search Results',
          state: ARIA_STATES.SHOWING_RESULTS,
          results: results
        });
      } else {
        addMessage('aria', "I couldn't find products matching your criteria. Would you like to adjust your budget or preferences?", {
          badge: 'No Results',
          state: ARIA_STATES.ASKING
        });
      }
    }, 1200);
  };

  // Handle user query
  const handleUserQuery = (query) => {
    if (!query.trim()) return;

    addMessage('user', query);
    setInputVal('');

    // Start with clarifying questions
    askClarifyingQuestions(query);
  };

  // Handle user response to Aria's questions
  const handleUserResponse = (response, ariaMessage) => {
    addMessage('user', response);

    // Update search context based on response
    const updatedContext = { ...searchContext };
    const lower = response.toLowerCase();

    // Parse budget
    const budgetMatch = response.match(/₹?\s*(\d+(?:,\d+)*)/);
    if (budgetMatch) {
      updatedContext.budget = parseInt(budgetMatch[1].replace(/,/g, ''));
    }

    // Parse category
    if (lower.includes('laptop') || lower.includes('computer')) {
      updatedContext.category = 'laptops';
    } else if (lower.includes('coffee') || lower.includes('bean')) {
      updatedContext.category = 'coffee';
    } else if (lower.includes('linen') || lower.includes('bed')) {
      updatedContext.category = 'bedding';
    }

    // Parse preferences
    if (lower.includes('quiet') || lower.includes('silent')) {
      updatedContext.preferences.push('quiet');
    }
    if (lower.includes('fast') || lower.includes('quick')) {
      updatedContext.preferences.push('fast');
    }
    if (lower.includes('cheap') || lower.includes('budget')) {
      updatedContext.preferences.push('budget');
    }
    if (lower.includes('premium') || lower.includes('high-end')) {
      updatedContext.preferences.push('premium');
    }

    setSearchContext(updatedContext);

    // Check if we have enough info or more questions
    const ariaQuestions = ariaMessage.questions || [];

    if (ariaQuestions.length > 0) {
      // Ask next question
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage('aria', ariaQuestions[0], {
            badge: 'Clarifying',
            state: ARIA_STATES.ASKING,
            questions: ariaQuestions.slice(1),
            originalQuery: ariaMessage.originalQuery
          });
        }, 600);
      }, 400);
    } else {
      // Enough info, perform search
      performSearch(ariaMessage.originalQuery, updatedContext);
    }
  };

  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setAriaState(ARIA_STATES.GOVERNANCE_CHECK);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      // Simulate governance check
      const governanceResult = product.governance.status === 'approved' ? 'approved' : 'needs_review';

      if (governanceResult === 'approved') {
        addMessage('aria', `Great choice! ${product.name} has been verified by our governance engine. Price: ₹${product.price.toLocaleString('en-IN')}. Would you like me to proceed with the order?`, {
          badge: 'Governance Approved',
          state: ARIA_STATES.CONFIRMING,
          product: product
        });
      } else {
        addMessage('aria', `${product.name} requires additional review. The governance engine has flagged this for manual approval. Would you like to proceed anyway?`, {
          badge: 'Needs Review',
          state: ARIA_STATES.CONFIRMING,
          product: product
        });
      }
    }, 1000);
  };

  // Handle order confirmation
  const handleOrderConfirm = (product) => {
    setAriaState(ARIA_STATES.CONFIRMING);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      // Create order
      const orderId = `CRN-${Math.floor(Math.random() * 9000) + 1000}`;

      addMessage('aria', `Perfect! I've placed your order for ${product.name}. Order ID: ${orderId}. You'll receive a Trust Receipt shortly.`, {
        badge: 'Order Placed',
        state: ARIA_STATES.IDLE,
        orderId: orderId,
        product: product
      });

      // Show trust receipt
      setTimeout(() => {
        addMessage('system_card', null, {
          cardType: 'receipt',
          receiptData: {
            id: orderId,
            item: product.name,
            price: product.price,
            status: 'placed',
            authorizedAt: 'Just now',
            paymentChannel: 'HDFC Priority ••4902',
            sha256: '7f920eb18a24c559d81a942005a1'
          }
        });
      }, 500);

      setAriaState(ARIA_STATES.IDLE);
      setSearchContext({ category: null, budget: null, preferences: [] });
      setSearchResults([]);
      setSelectedProduct(null);
    }, 1500);
  };

  // Render message based on type
  const renderMessage = (msg) => {
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

              {/* Show questions if in asking state */}
              {msg.state === ARIA_STATES.ASKING && msg.questions && msg.questions.length > 0 && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontWeight: 600 }}>
                    Next question:
                  </div>
                  <button
                    onClick={() => handleUserResponse(msg.questions[0], msg)}
                    style={{
                      backgroundColor: 'var(--forest-green-light)',
                      color: 'var(--forest-green)',
                      border: '1px solid var(--forest-green-border)',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {msg.questions[0]}
                  </button>
                </div>
              )}

              {/* Show search results */}
              {msg.state === ARIA_STATES.SHOWING_RESULTS && msg.results && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {msg.results.map(product => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      style={{
                        backgroundColor: 'var(--bg-cream-subtle)',
                        border: '1px solid var(--border-cream)',
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--forest-green-border)';
                        e.currentTarget.style.backgroundColor = 'var(--forest-green-light)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-cream)';
                        e.currentTarget.style.backgroundColor = 'var(--bg-cream-subtle)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: '#FFFFFF',
                          flexShrink: 0
                        }}>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '4px' }}>
                            {product.specs}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                              {product.delivery}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={16} color="var(--ink-muted)" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Show confirmation buttons */}
              {msg.state === ARIA_STATES.CONFIRMING && msg.product && (
                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleOrderConfirm(msg.product)}
                    style={{
                      backgroundColor: 'var(--forest-green)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Confirm Order
                  </button>
                  <button
                    onClick={() => {
                      setAriaState(ARIA_STATES.IDLE);
                      addMessage('aria', "No problem! Let me know if you'd like to explore other options.", {
                        badge: 'Cancelled',
                        state: ARIA_STATES.IDLE
                      });
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'var(--ink-secondary)',
                      border: '1px solid var(--border-cream)',
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
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
            onTrackOrder={() => onNavigateToScreen('orders')}
            onShowToast={onShowToast}
          />
        </div>
      );
    }

    return null;
  };

  // Empty state - Copilot style
  if (messages.length === 0) {
    return (
      <div className="chat-screen-wrap animate-fade-in" style={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(24px, 5vw, 48px) clamp(16px, 3vw, 24px)',
        textAlign: 'center',
        maxWidth: 'var(--max-width)',
        margin: '0 auto'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--forest-green-light)',
          color: 'var(--forest-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-warm-sm)'
        }}>
          <Sparkles size={26} />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.1rem, 4.8vw, 3.2rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          marginBottom: '32px',
          letterSpacing: '-0.03em',
          lineHeight: 1.15
        }}>
          Hi {userName}, what can I help you find?
        </h1>

        {/* Search Input */}
        <div style={{ width: '100%', maxWidth: '680px', marginBottom: '24px' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserQuery(inputVal);
            }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-pill)',
              border: '1.5px solid var(--border-cream)',
              boxShadow: 'var(--shadow-warm-md)',
              padding: '8px 10px 8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <Search size={18} color="var(--ink-muted)" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search for products, ask about orders, or get recommendations..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                color: 'var(--ink)',
                backgroundColor: 'transparent'
              }}
            />
            <button
              type="button"
              onClick={() => setVoiceModalOpen(true)}
              style={{ padding: '8px', color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              title="Voice search"
            >
              <Mic size={19} />
            </button>
            <button
              type="submit"
              disabled={!inputVal.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: inputVal.trim() ? 'var(--forest-green)' : 'var(--bg-cream-subtle)',
                color: inputVal.trim() ? '#FFFFFF' : 'var(--ink-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: inputVal.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          maxWidth: '680px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Find laptops under ₹60k', prompt: 'I need a laptop under ₹60,000 for work' },
            { label: 'Restock coffee beans', prompt: 'I want to restock coffee beans' },
            { label: 'Organic bedding', prompt: 'Show me organic linen bedding' },
            { label: 'Track my orders', action: () => onNavigateToScreen('orders') },
            { label: 'My spending rules', action: () => onNavigateToScreen('rules') }
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (chip.action) chip.action();
                else if (chip.prompt) handleUserQuery(chip.prompt);
              }}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-cream)',
                borderRadius: 'var(--radius-pill)',
                padding: '9px 18px',
                fontSize: '13.5px',
                fontWeight: 500,
                color: 'var(--ink)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-warm-sm)',
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
              {chip.label}
            </button>
          ))}
        </div>

        {/* Recent Searches */}
        <div style={{ maxWidth: '680px', width: '100%' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--ink-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '12px',
            textAlign: 'left'
          }}>
            Recent Searches
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'Framework Laptop 13 - ordered yesterday',
              'Blue Tokai coffee beans - in cart',
              'Tekla bedding - viewed 2 days ago'
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleUserQuery(item.split(' - ')[0])}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-cream)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '13px',
                  color: 'var(--ink)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
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
                <span>{item}</span>
                <ChevronRight size={14} color="var(--ink-muted)" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Active conversation
  return (
    <div className="chat-screen-wrap animate-fade-in" style={{ paddingBottom: '90px' }}>
      {/* Top Context Banner */}
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
          flexWrap: 'wrap',
          gap: '10px',
          boxShadow: 'var(--shadow-warm-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span>ARIA MINDFUL AGENT</span>
            <span style={{ color: 'var(--ink-muted)', fontWeight: 400 }}>· {ariaState.replace('_', ' ')}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                setMessages([]);
                setAriaState(ARIA_STATES.IDLE);
                setSearchContext({ category: null, budget: null, preferences: [] });
                setSearchResults([]);
                setSelectedProduct(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--ink-secondary)',
                backgroundColor: 'var(--bg-cream-subtle)',
                border: '1px solid var(--border-cream)',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={12} />
              <span>New</span>
            </button>

            <button
              onClick={() => onNavigateToScreen('rules')}
              style={{ padding: '4px', color: 'var(--ink-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        maxWidth: '820px',
        margin: '24px auto 0',
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px'
      }}>
        {messages.map(renderMessage)}

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
              <span style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>
                {ariaState === ARIA_STATES.SEARCHING ? 'Searching products...' :
                  ariaState === ARIA_STATES.GOVERNANCE_CHECK ? 'Checking governance...' :
                    'Aria is thinking...'}
              </span>
              <span className="pulse-badge" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--forest-green)' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--bg-cream)',
        borderTop: '1px solid var(--border-cream)',
        padding: '16px 20px',
        zIndex: 100
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserQuery(inputVal);
            }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-pill)',
              border: '1.5px solid var(--border-cream)',
              boxShadow: 'var(--shadow-warm-md)',
              padding: '8px 10px 8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Plus size={18} color="var(--ink-muted)" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Aria anything..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                color: 'var(--ink)',
                backgroundColor: 'transparent'
              }}
            />
            <button
              type="button"
              onClick={() => setVoiceModalOpen(true)}
              style={{ padding: '8px', color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              title="Voice query"
            >
              <Mic size={18} />
            </button>
            <button
              type="submit"
              disabled={!inputVal.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: inputVal.trim() ? 'var(--forest-green)' : 'var(--bg-cream-subtle)',
                color: inputVal.trim() ? '#FFFFFF' : 'var(--ink-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: inputVal.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Voice Input Modal */}
      <VoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onTranscriptComplete={(text) => {
          setInputVal(text);
          setVoiceModalOpen(false);
        }}
      />
    </div>
  );
}
