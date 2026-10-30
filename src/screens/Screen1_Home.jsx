import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  SlidersHorizontal,
  Truck,
  Lock,
  X,
  Plus,
  ShieldAlert,
  Cpu,
  FileCheck,
  AlertTriangle,
  ArrowUpRight,
  ShoppingBag,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '../components/ui';
import TrustReceipt from '../components/TrustReceipt';

let homeMsgCounter = 600;

// ── Complete Master Catalog (Integrated from mock data + governed items) ─────
const MASTER_CATALOG = [
  {
    id: 'prod-framework',
    name: 'Framework Laptop 13',
    category: 'Hardware',
    price: 94990,
    specs: 'Intel Core Ultra Edition · 16GB RAM · Modular Swappable IO',
    acoustics: 'Ultra-quiet dual heatpipe fan (21 dB)',
    partner: 'Framework Computer Inc.',
    verified: true,
    rating: '4.9 ★',
    batch: 'Batch #FW-139',
    delivery: 'Thu, 24 Oct',
    image: '/assets/framework_laptop.jpg',
    keywords: ['laptop', 'framework', 'study', 'work', 'hardware', 'quiet', 'modular'],
    rationale: 'Whisper-quiet typing profile, swappable USB-C modules, and fully repairable chassis.'
  },
  {
    id: 'prod-dell-xps',
    name: 'Dell XPS 13 Plus',
    category: 'Hardware',
    price: 120000,
    specs: 'Intel Core i7 · 16GB LPDDR5 · 4K Touch OLED · CNC Machined Aluminum',
    acoustics: 'Zero-lattice capacitive keyboard & whisper thermal vents',
    partner: 'Dell Direct Official Flagship',
    verified: true,
    rating: '4.8 ★',
    batch: 'Batch #XPS-992',
    delivery: 'Thu, 24 Oct',
    image: '/assets/dell_xps.jpg',
    keywords: ['dell', 'xps', '13', 'laptop', '1.2l', '120000', 'quiet', 'premium'],
    rationale: 'Pure white glass unibody with seamless touch bar and aerospace thermal dissipation.'
  },
  {
    id: 'prod-zenbook-14',
    name: 'ASUS ZenBook 14 OLED (Whisper-Quiet)',
    category: 'Hardware',
    price: 58990,
    specs: 'AMD Ryzen 5 · 16GB LPDDR5 · 2.8K 90Hz OLED · 512GB NVMe SSD',
    acoustics: 'Whisper-quiet fan profile (< 22 dB under study load)',
    partner: 'Certified Zero-Noise Labs',
    verified: true,
    rating: '4.9 ★',
    batch: 'Batch #ZB-402',
    delivery: 'Tomorrow, 4:00 PM',
    image: '/assets/zenbook.jpg',
    keywords: ['laptop', 'asus', 'zenbook', 'quiet', 'study', '60000', '60k', 'oled'],
    rationale: 'Vibrant OLED panel for long study sessions, acoustic-damping fan curves, and full day battery.'
  },
  {
    id: 'prod-lenovo-yoga',
    name: 'Lenovo Yoga Slim 6',
    category: 'Hardware',
    price: 48990,
    specs: 'Intel Core i5 Evo · 16GB RAM · 2.8K Luminescent OLED · 120Hz',
    acoustics: 'Intelligent cooling fan profile tuned for silent library use',
    partner: 'Lenovo Ultra Series Authorized',
    verified: true,
    rating: '4.9 ★',
    batch: 'Batch #LN-601',
    delivery: 'Tomorrow, 2:00 PM',
    image: '/assets/lenovo_yoga.jpg',
    keywords: ['laptop', 'lenovo', 'yoga', 'slim', 'study', 'quiet', '50000', '50k'],
    rationale: 'Military-grade aluminum unibody with whispering fan curves and ₹1,010 buffer below budget.'
  },
  {
    id: 'prod-acer-swift',
    name: 'Acer Swift Go 14',
    category: 'Hardware',
    price: 45990,
    specs: 'Intel Core i5 13th Gen · 16GB RAM · 1.25 kg Featherlight · Dual Fans',
    acoustics: 'TwinAir cooling with silent eco-mode profile',
    partner: 'Acer Atelier Flagship',
    verified: true,
    rating: '4.8 ★',
    batch: 'Batch #AC-414',
    delivery: 'Tomorrow, 6:00 PM',
    image: '/assets/acer_swift.jpg',
    keywords: ['laptop', 'acer', 'swift', 'featherlight', 'study', 'portable'],
    rationale: 'Exceptional all-day battery life, lightweight chassis for commuting, and dual silent fans.'
  },
  {
    id: 'prod-ideapad-slim3',
    name: 'Lenovo IdeaPad Slim 3 (Silent Profile)',
    category: 'Hardware',
    price: 28990,
    specs: '15.6" FHD Anti-glare · AMD Athlon Silver · 8GB DDR4 · 512GB NVMe SSD',
    acoustics: 'Thermal acoustic optimization for silent study environments',
    partner: 'Certified Zero-Noise Labs',
    verified: true,
    rating: '4.7 ★',
    batch: 'Batch #LP-302',
    delivery: 'Tomorrow, 4:00 PM',
    image: '/assets/framework_laptop.jpg',
    keywords: ['laptop', '30000', '30k', 'budget', 'ideapad', 'lenovo', 'quiet'],
    rationale: 'Comfortably under ₹30,000 budget cap with silent fan profile and anti-glare display.'
  },
  {
    id: 'prod-alienware-m16',
    name: 'Alienware m16 Performance Laptop',
    category: 'Hardware',
    price: 75000,
    specs: 'Intel Core i7 · RTX 4060 GPU · 32GB RAM · 1TB NVMe · 240Hz QHD+',
    acoustics: 'Quad-fan Cryo-tech high-airflow cooling',
    partner: 'Alienware Direct Partner',
    verified: true,
    rating: '4.9 ★',
    batch: 'Rule #02 Violation',
    delivery: 'Delivery Blocked Pre-emptively',
    image: '/assets/dell_xps.jpg',
    keywords: ['gaming', 'alienware', 'laptop', '75000', '75k', 'gpu'],
    rationale: 'High-draw performance hardware. Triggers deterministic pre-execution spending cap block.'
  },
  {
    id: 'prod-kinto',
    name: 'Kinto Slow Coffee Brewer',
    category: 'Home & Kitchen',
    price: 3450,
    specs: 'Heat-resistant glass carafe (600ml) · Permanent stainless mesh filter',
    acoustics: 'Analog silent pour-over',
    partner: 'Kinto Japan Official Curations',
    verified: true,
    rating: '5.0 ★',
    batch: 'Batch #KT-208',
    delivery: 'Tomorrow Morning',
    image: '/assets/kinto_coffee.jpg',
    keywords: ['coffee', 'kinto', 'brewer', 'pour-over', 'pantry', 'carafe'],
    rationale: 'Eliminates paper filter waste and matches your weekend pour-over routine.'
  },
  {
    id: 'prod-blue-tokai',
    name: 'Blue Tokai Whole Bean Arabica (2x 250g)',
    category: 'Pantry',
    price: 1120,
    specs: '100% Arabica Specialty Grade · Dark Roast Vienna · Nitrogen Sealed',
    acoustics: 'Freshly roasted whole beans',
    partner: 'Blue Tokai Coffee Roasters',
    verified: true,
    rating: '4.9 ★',
    batch: 'Batch #BT-889',
    delivery: '⚡ 15 mins • Today 11:30 AM',
    image: '/assets/kinto_coffee.jpg',
    keywords: ['coffee', 'beans', 'roasted', 'arabica', 'restock', 'pantry'],
    rationale: 'Direct trade specialty roast within routine monthly living pantry allowance.'
  },
  {
    id: 'prod-tekla',
    name: 'Tekla Percale Bedding',
    category: 'Living',
    price: 11200,
    specs: '100% GOTS certified organic cotton · Queen set · Sage Stripe',
    acoustics: 'Crisp percale weave with stonewashed matte finish',
    partner: 'Tekla Copenhagen Authorized',
    verified: true,
    rating: '4.9 ★',
    batch: 'Batch #TK-551',
    delivery: 'Wed, 23 Oct',
    image: '/assets/tekla_bedding.jpg',
    keywords: ['linen', 'sheets', 'bedding', 'tekla', 'guest', 'room', 'organic'],
    rationale: 'Breathable organic percale weave suitable for warm Indian weather and guest room comfort.'
  },
  {
    id: 'prod-hasami-mug',
    name: 'Minimal Japanese Ceramic Mug (Chalk White)',
    category: 'Living',
    price: 1800,
    specs: 'Natural porcelain-clay blend · 350ml · Microwave & Dishwasher safe',
    acoustics: 'Stackable minimalist stoneware',
    partner: 'Studio Hasami Crafts',
    verified: true,
    rating: '4.8 ★',
    batch: 'Batch #HS-104',
    delivery: '⚡ 15 mins • Local Hub',
    image: '/assets/hero_shopper.jpg',
    keywords: ['mug', 'ceramic', 'chalk', 'white', 'tableware'],
    rationale: 'Artisan handcrafted ceramic mug with modular stackable silhouette.'
  },
  {
    id: 'prod-walnut-shelf',
    name: 'Solid Walnut Monitor Shelf (Dual Deck)',
    category: 'Workspace',
    price: 14500,
    specs: 'American Black Walnut · Powder-coated aluminum legs · Cork padding',
    acoustics: 'Vibration-damping desk riser',
    partner: 'Grovemade Artisan Studio',
    verified: true,
    rating: '5.0 ★',
    batch: 'Batch #GM-820',
    delivery: 'Fri, 25 Oct',
    image: '/assets/hero_shopper.jpg',
    keywords: ['shelf', 'monitor', 'desk', 'walnut', 'wood'],
    rationale: 'Ergonomic dual-display riser supporting clean cable routing and posture alignment.'
  }
];

export default function Screen1_Home({
  onAskAria: _onAskAria,
  onNavigateToScreen,
  onQuickOrder,
  onShowToast,
  currentUser,
  currentLocation,
  rules,
  setRules: _setRules,
  orders = [],
  onApproveOrder,
  onRejectOrder,
  onAddOrder,
  chatPrompt = '',
  setChatPrompt
}) {
  const [promptInput, setPromptInput] = useState('');
  const userName = currentUser ? currentUser.name.split(' ')[0] : 'MOHNISH';

  // ── Integrated Aria Activity & Conversation State ───────────────────────────
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  
  // ── 5-Stage Agent Execution Pipeline State ──────────────────────────────────
  const [agentExecuting, setAgentExecuting] = useState(false);
  const [agentStep, setAgentStep] = useState(0); // 0 to 4
  const [agentActionData, setAgentActionData] = useState(null);
  const [comparedProducts, setComparedProducts] = useState(null);
  const [showComparisonMatrix, setShowComparisonMatrix] = useState(false);

  const chatSectionRef = useRef(null);
  const monthlyCap = rules?.monthlyCap || 50000;
  const approvalThreshold = rules?.approvalThreshold || 100000;

  // Example prompts directly aligned with user expectations and Section 12 test scenarios
  const quickPrompts = [
    { label: '"Find me a quiet study laptop under ₹60,000"', prompt: "Find me a quiet study laptop under ₹60,000" },
    { label: '"Linen sheets for guest room"', prompt: "Linen sheets for guest room" },
    { label: '"Restock roasted coffee beans"', prompt: "Restock roasted coffee beans" },
    { label: 'Laptop under ₹30k (Auto-Execute)', prompt: "Find me a quiet study laptop under ₹30,000" },
    { label: 'Dell XPS 13 ₹1.2L (Needs OK)', prompt: "I want to order the Dell XPS 13 Plus for ₹1,20,000" },
    { label: 'Gaming Laptop ₹75k (Block Policy)', prompt: "Could you buy the Gaming Laptop for ₹75,000?" }
  ];

  const followUpChips = [
    "Compare acoustics & thermal ratings",
    "Show verified merchant credentials",
    "Check remaining monthly allowance"
  ];

  // ── 5-Stage Agent Workflow Execution Engine ─────────────────────────────────
  const runAgentWorkflow = React.useCallback((queryText, directOrderTarget = null) => {
    if (!queryText || !queryText.trim()) return;

    setChatOpen(true);
    setAgentExecuting(true);
    setAgentStep(0);
    setComparedProducts(null);
    setShowComparisonMatrix(false);

    const lower = queryText.toLowerCase();

    // 1. STAGE 1: UNDERSTAND USER REQUEST (Intent, Target constraints, Preferences)
    const isExplicitBuy = !!directOrderTarget ||
      lower.includes('order') ||
      lower.includes('buy') ||
      lower.includes('restock') ||
      lower.includes('purchase');

    // Extract numeric budget cap if stated in query
    let parsedBudget = null;
    const matchUnder = lower.match(/under\s*₹?\s*(\d[\d,]*)/i);
    const matchK = lower.match(/(\d+)\s*k/i);
    const matchLakh = lower.match(/(\d+(?:\.\d+)?)\s*l/i);

    if (matchUnder) {
      parsedBudget = parseInt(matchUnder[1].replace(/,/g, ''), 10);
    } else if (matchK) {
      parsedBudget = parseInt(matchK[1], 10) * 1000;
    } else if (matchLakh) {
      parsedBudget = Math.round(parseFloat(matchLakh[1]) * 100000);
    }

    // Identify category & preference keywords
    const isLaptop = lower.includes('laptop') || lower.includes('notebook') || lower.includes('xps') || lower.includes('zenbook') || lower.includes('framework');
    const isCoffee = lower.includes('coffee') || lower.includes('bean') || lower.includes('brewer') || lower.includes('restock');
    const isBedding = lower.includes('linen') || lower.includes('sheet') || lower.includes('bed') || lower.includes('tekla');
    const isTableware = lower.includes('mug') || lower.includes('shelf') || lower.includes('clock');

    // Filter candidate products from master catalog
    let matchedProducts = [];
    if (directOrderTarget) {
      matchedProducts = [directOrderTarget];
    } else if (isLaptop) {
      matchedProducts = MASTER_CATALOG.filter((p) => p.category === 'Hardware');
      if (parsedBudget) {
        // Find matching within or closest to budget
        matchedProducts = matchedProducts.filter((p) => p.price <= parsedBudget);
        if (matchedProducts.length === 0) {
          // If all are higher, show the closest
          matchedProducts = MASTER_CATALOG.filter((p) => p.category === 'Hardware' && p.price <= 75000);
        }
      }
    } else if (isCoffee) {
      matchedProducts = MASTER_CATALOG.filter((p) => p.category === 'Home & Kitchen' || p.category === 'Pantry');
    } else if (isBedding) {
      matchedProducts = MASTER_CATALOG.filter((p) => p.category === 'Living');
    } else if (isTableware) {
      matchedProducts = MASTER_CATALOG.filter((p) => p.keywords.some((k) => lower.includes(k)));
    } else {
      // General keyword search
      matchedProducts = MASTER_CATALOG.filter((p) => {
        return p.keywords.some((k) => lower.includes(k)) ||
               p.name.toLowerCase().includes(lower) ||
               p.category.toLowerCase().includes(lower);
      });
    }

    // Fallback if empty
    if (matchedProducts.length === 0) {
      matchedProducts = [MASTER_CATALOG[2]]; // default ZenBook 14
    }

    // Primary product under governance
    const primaryItem = matchedProducts[0];
    const itemPrice = primaryItem.price;

    // Evaluate Pre-Execution Governance (4 checks)
    let decision = 'AUTO_EXECUTE';
    let reasonCode = 'GOV-AUTO-01';
    let reasonText = `Authorized transaction. Price ₹${itemPrice.toLocaleString('en-IN')} is within monthly allowance (₹${monthlyCap.toLocaleString('en-IN')}) and below automatic execution threshold (₹${approvalThreshold.toLocaleString('en-IN')}).`;
    let ariaMessage = '';

    // Check 1: Exceeds monthly cap -> BLOCK
    if (itemPrice > monthlyCap) {
      decision = 'BLOCK';
      reasonCode = 'GOV-BLOCK-02';
      reasonText = `Policy Violation: Item amount (₹${itemPrice.toLocaleString('en-IN')}) exceeds self-imposed monthly ceiling (₹${monthlyCap.toLocaleString('en-IN')}) by ₹${(itemPrice - monthlyCap).toLocaleString('en-IN')}. Pre-execution block enforced. Zero funds debited.`;
      ariaMessage = `The ${primaryItem.name} is priced at ₹${itemPrice.toLocaleString('en-IN')}, which exceeds your monthly ceiling of ₹${monthlyCap.toLocaleString('en-IN')}. The Pre-Execution Governance Engine has halted this transaction safely before debiting any funds.`;
    } 
    // Check 2: Exceeds approval threshold -> HUMAN APPROVAL
    else if (itemPrice > approvalThreshold) {
      decision = 'HUMAN_APPROVAL';
      reasonCode = 'GOV-APPR-04';
      reasonText = `Item price (₹${itemPrice.toLocaleString('en-IN')}) is permitted by wallet allowance, but exceeds your automatic execution threshold of ₹${approvalThreshold.toLocaleString('en-IN')}. Suspended on a 15-minute peace-of-mind hold awaiting human confirmation.`;
      ariaMessage = `The ${primaryItem.name} (₹${itemPrice.toLocaleString('en-IN')}) is available, but exceeds your automatic threshold of ₹${approvalThreshold.toLocaleString('en-IN')}. In accordance with your governance rules, this order is held for 15 minutes awaiting your explicit approval.`;
    } 
    // Check 3: Auto-Execute eligible
    else {
      decision = 'AUTO_EXECUTE';
      reasonCode = 'GOV-AUTO-01';
      reasonText = `Pre-execution governance verified: Authentic partner credentials, zero surge markups, and ₹${itemPrice.toLocaleString('en-IN')} is within budget limits.`;
      if (isExplicitBuy) {
        ariaMessage = `Pre-execution checks verified! Auto-authorized order for ${primaryItem.name} at ₹${itemPrice.toLocaleString('en-IN')}. Verified merchant dispatched with 15-minute peace-of-mind hold.`;
      } else {
        ariaMessage = `I found ${matchedProducts.length} verified option${matchedProducts.length > 1 ? 's' : ''} matching your request. Each option is pre-audited against your quiet preferences and verified within your budget limits.`;
      }
    }

    const orderId = `CRN-${Math.floor(10000 + Math.random() * 90000)}`;

    const executionPackage = {
      query: queryText,
      isExplicitBuy,
      parsedBudget: parsedBudget || primaryItem.price,
      matchedProducts,
      primaryItem,
      decision,
      reasonCode,
      reasonText,
      ariaMessage,
      orderId,
      receiptData: (isExplicitBuy && decision === 'AUTO_EXECUTE') ? {
        id: orderId,
        item: primaryItem.name,
        price: primaryItem.price,
        status: 'placed',
        authorizedAt: 'Just now',
        paymentChannel: 'HDFC Priority ••4902',
        sha256: `7f920eb18a24...${orderId.slice(-4)}`
      } : null
    };

    setAgentActionData(executionPackage);

    // Append User Message to conversation
    const userMsg = {
      id: ++homeMsgCounter,
      sender: 'user',
      name: userName,
      time: 'Just now',
      text: queryText
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      chatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    // Progressive 5-Stage Stepper Sequence
    // Step 1: Understand user request (at 350ms)
    const t1 = setTimeout(() => setAgentStep(1), 350);
    // Step 2: Search catalog (at 750ms)
    const t2 = setTimeout(() => setAgentStep(2), 750);
    // Step 3: Compare options (at 1150ms)
    const t3 = setTimeout(() => setAgentStep(3), 1150);
    // Step 4: Validate budget, seller & rules (at 1550ms)
    const t4 = setTimeout(() => setAgentStep(4), 1550);

    // Finalize Results (at 1950ms)
    const t5 = setTimeout(() => {
      setAgentExecuting(false);

      // Aria Response Message
      const ariaMsg = {
        id: ++homeMsgCounter,
        sender: 'aria',
        name: 'Aria',
        time: 'Just now',
        governance: {
          decision,
          reasonCode,
          reasonText,
          orderId,
          isExplicitBuy
        },
        text: ariaMessage
      };

      const newMsgs = [ariaMsg];

      // If explicit order executed or requires approval, add system card
      if (isExplicitBuy) {
        if (executionPackage.receiptData) {
          newMsgs.push({
            id: ++homeMsgCounter,
            sender: 'system_card',
            cardType: 'receipt',
            receiptData: executionPackage.receiptData
          });
        }
      }

      setMessages((prev) => [...prev, ...newMsgs]);

      // Synchronize with App.jsx orders state
      if (isExplicitBuy && onAddOrder) {
        if (decision === 'AUTO_EXECUTE') {
          onAddOrder({
            id: orderId,
            item: primaryItem.name,
            subtitle: primaryItem.specs,
            price: primaryItem.price,
            status: 'placed',
            timestamp: 'Just now',
            merchant: primaryItem.partner,
            image: primaryItem.image,
            destination: `${currentLocation ? currentLocation.city : 'Bengaluru'} Residence`,
            sha256: executionPackage.receiptData?.sha256 || '8b91a27e...'
          });
          if (onShowToast) onShowToast(`Order #${orderId} AUTO-EXECUTED under your budget cap.`);
        } else if (decision === 'HUMAN_APPROVAL') {
          onAddOrder({
            id: orderId,
            item: primaryItem.name,
            subtitle: primaryItem.specs,
            price: primaryItem.price,
            status: 'needs_ok',
            timestamp: 'Just now',
            merchant: primaryItem.partner,
            image: primaryItem.image,
            flagReason: reasonText,
            destination: `${currentLocation ? currentLocation.city : 'Bengaluru'} Residence`,
            sha256: '9e88fa12c309b4d...77e1'
          });
          if (onShowToast) onShowToast(`Order #${orderId} held for 15-minute Human Approval.`);
        }
      }

      setTimeout(() => {
        chatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }, 1950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [userName, approvalThreshold, monthlyCap, currentLocation, onAddOrder, onShowToast]);

  // Synchronize when external prompt is provided
  useEffect(() => {
    if (chatPrompt && chatPrompt.trim()) {
      runAgentWorkflow(chatPrompt);
      if (setChatPrompt) setChatPrompt('');
    }
  }, [chatPrompt, setChatPrompt, runAgentWorkflow]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!promptInput.trim()) return;
    runAgentWorkflow(promptInput);
    setPromptInput('');
  };

  // Trigger explicit purchase from product card
  const handleOrderProductCard = (product) => {
    runAgentWorkflow(`Order ${product.name} for ₹${product.price.toLocaleString('en-IN')}`, product);
  };

  const handleDirectApprove = (orderId) => {
    if (onApproveOrder) onApproveOrder(orderId);
    if (onShowToast) onShowToast(`Order #${orderId} authorized by human! Dispatched to verified seller.`);
    setMessages((prev) =>
      prev.map((m) => {
        if (m.governance?.orderId === orderId) {
          return {
            ...m,
            governance: { ...m.governance, decision: 'AUTO_EXECUTE', reasonText: 'Explicit Human Approval Granted.' },
            text: `Thank you, ${userName}! Human confirmation verified. Order #${orderId} is now authorized and dispatched.`
          };
        }
        return m;
      })
    );
  };

  const handleDirectReject = (orderId) => {
    if (onRejectOrder) onRejectOrder(orderId);
    if (onShowToast) onShowToast(`Order #${orderId} hold released. Zero funds debited.`);
    setMessages((prev) =>
      prev.map((m) => {
        if (m.governance?.orderId === orderId) {
          return {
            ...m,
            governance: { ...m.governance, decision: 'BLOCK', reasonText: 'User released hold. Action aborted safely.' },
            text: `Order #${orderId} hold released. Zero funds debited and reserve hold removed.`
          };
        }
        return m;
      })
    );
  };

  // 5 Step Labels for Pre-Execution Governance Sequence
  const STEP_DETAILS = [
    {
      title: "1. Understand User Request",
      subtext: agentActionData ? `Parsed: ${agentActionData.query} · Target Cap: ₹${agentActionData.parsedBudget?.toLocaleString('en-IN')}` : "Synthesizing natural language intent & acoustics..."
    },
    {
      title: "2. Search Relevant Products",
      subtext: agentActionData ? `Queried ${agentActionData.matchedProducts.length} verified listings across artisan & flagship catalog` : "Querying verified catalog..."
    },
    {
      title: "3. Compare Available Options",
      subtext: agentActionData ? `Compared thermal acoustics, return escrow, and price efficiency` : "Evaluating comparative specs..."
    },
    {
      title: "4. Validate Budget & Approval Rules",
      subtext: `Evaluated against ${userName}'s ₹${monthlyCap.toLocaleString('en-IN')} cap & ₹${approvalThreshold.toLocaleString('en-IN')} auto-threshold`
    },
    {
      title: "5. Present Governed Results & Actions",
      subtext: agentActionData ? `Emitted governance decision: ${agentActionData.decision}` : "Preparing progressive card reveal..."
    }
  ];

  return (
    <div className="home-screen-wrap animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* ─── Hero Section (Source of truth: Fraunces serif, warm ivory, forest-green) ─── */}
      <section style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: 'clamp(28px, 5vw, 56px) clamp(16px, 3vw, 24px) clamp(24px, 4vw, 36px)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(24px, 4vw, 44px)',
          alignItems: 'center'
        }}>
          {/* Left Hero Column */}
          <div>
            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--forest-green-light)',
                color: 'var(--forest-green)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12.5px',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                <Sparkles size={14} />
                <span>PRE-EXECUTION GOVERNANCE FRAMEWORK</span>
              </div>

              {currentLocation && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--ink)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: currentLocation.isLiveGPS ? '1.5px solid #86EFAC' : '1px solid var(--border-cream)',
                  boxShadow: 'var(--shadow-warm-sm)'
                }}>
                  <MapPin size={12} color="var(--forest-green)" />
                  <span style={{ color: 'var(--forest-green)', fontWeight: 700 }}>
                    ⚡ {currentLocation.deliveryTime || '15 mins'}
                  </span>
                  <span style={{ color: 'var(--ink-muted)' }}>•</span>
                  <span>{currentLocation.city}</span>
                </div>
              )}
            </div>

            {/* Editorial Serif Greeting */}
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              lineHeight: 1.1,
              fontWeight: 500,
              color: 'var(--ink)',
              marginBottom: '18px',
              letterSpacing: '-0.03em'
            }}>
              Hi {userName}, <span style={{ fontStyle: 'italic', fontWeight: 400 }}>what do you need today?</span>
            </h1>

            <p style={{
              fontSize: '17px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.6,
              marginBottom: '28px',
              maxWidth: '520px'
            }}>
              Aria finds, checks, and orders what you love — governed by deterministic pre-execution safeguards before any money moves.
            </p>

            {/* Natural-Language Hero Input Bar */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid var(--border-cream)',
                  boxShadow: 'var(--shadow-warm-md)',
                  padding: '6px 8px 6px 18px',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  flexWrap: 'nowrap'
                }}
              >
                <Plus size={18} color="var(--forest-green)" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="What do you need today? e.g., 'Quiet study laptop under ₹60,000'"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    color: 'var(--ink)',
                    backgroundColor: 'transparent'
                  }}
                />
                <button
                  type="button"
                  style={{
                    padding: '8px',
                    color: 'var(--ink-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Voice query"
                >
                  <Mic size={18} />
                </button>
                <Button
                  type="submit"
                  size="md"
                  icon={<ArrowRight size={15} />}
                  iconPosition="right"
                  style={{
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-pill)',
                    flexShrink: 0
                  }}
                >
                  Ask Aria
                </Button>
              </div>
            </form>

            {/* Preserved Example Prompts Below Input */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--ink-muted)', fontWeight: 500 }}>Try:</span>
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPromptInput(p.prompt);
                    runAgentWorkflow(p.prompt);
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-cream)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--ink)',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-warm-sm)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--forest-green-border)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-cream-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-cream)';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Hero Lifestyle Photography with Overlay */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-warm-lg)',
              border: '1px solid var(--border-cream)',
              position: 'relative'
            }}>
              <img
                src="/assets/hero_shopper.jpg"
                alt="Person relaxing in sunlit room with parcel"
                onError={(e) => {
                  e.currentTarget.src = '/assets/kinto_coffee.jpg';
                }}
                style={{
                  width: '100%',
                  height: 'clamp(280px, 45vw, 450px)',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              {/* Overlay card */}
              <div style={{
                position: 'absolute',
                bottom: '18px',
                left: '18px',
                right: '18px',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: '18px',
                padding: '14px 18px',
                border: '1px solid var(--border-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-warm-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--forest-green-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--forest-green)'
                  }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>Pre-Execution Governance Active</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--ink-secondary)' }}>Auto-Execute · Human Approval · Block</div>
                  </div>
                </div>
                <span className="badge-review" style={{ fontSize: '11px', padding: '3px 10px' }}>
                  PROTECTED
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Integrated Aria Activity & Conversation Panel ─── */}
      {chatOpen && (
        <section 
          ref={chatSectionRef}
          className="animate-fade-in"
          style={{
            maxWidth: 'var(--max-width)',
            margin: '0 auto',
            padding: '0 clamp(16px, 3vw, 24px) 44px'
          }}
        >
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid var(--forest-green-border)',
            boxShadow: 'var(--shadow-warm-lg)',
            overflow: 'hidden'
          }}>
            {/* Top Assistant Header */}
            <div style={{
              backgroundColor: 'var(--forest-green-light)',
              padding: '14px 24px',
              borderBottom: '1px solid var(--forest-green-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px #10B981'
                }} />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--forest-green)', letterSpacing: '0.02em' }}>
                  PRE-EXECUTION GOVERNANCE ENGINE
                </span>
                <span style={{
                  backgroundColor: '#FFFFFF',
                  color: 'var(--forest-green)',
                  border: '1px solid var(--forest-green-border)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '11px',
                  fontWeight: 600
                }}>
                  Controlled Autonomy
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => onNavigateToScreen('rules')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-cream)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: 'var(--ink-secondary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <SlidersHorizontal size={12} />
                  <span>Safeguards & Caps</span>
                </button>

                <button
                  onClick={() => onNavigateToScreen('how_aria_works')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-cream)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: 'var(--forest-green)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <FileCheck size={12} />
                  <span>How Aria Works</span>
                </button>

                <button
                  onClick={() => setChatOpen(false)}
                  title="Close conversation panel"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-cream)',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--ink-muted)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Conversation Body */}
            <div style={{
              padding: 'clamp(16px, 3vw, 28px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              maxHeight: '620px',
              overflowY: 'auto',
              backgroundColor: '#FCFAF6'
            }}>
              {/* Message Feed */}
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
                        padding: '12px 18px',
                        borderRadius: '20px 20px 4px 20px',
                        maxWidth: '80%',
                        fontSize: '15px',
                        lineHeight: 1.5,
                        boxShadow: 'var(--shadow-warm-sm)'
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                if (msg.sender === 'aria') {
                  const gov = msg.governance;
                  const isAuto = gov?.decision === 'AUTO_EXECUTE';
                  const isApproval = gov?.decision === 'HUMAN_APPROVAL';
                  const isBlock = gov?.decision === 'BLOCK';

                  return (
                    <div key={msg.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: isBlock ? '#EF4444' : isApproval ? '#F59E0B' : 'var(--forest-green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        flexShrink: 0
                      }}>
                        {isBlock ? <ShieldAlert size={18} /> : isApproval ? <AlertTriangle size={18} /> : <Sparkles size={18} />}
                      </div>

                      <div style={{ maxWidth: '88%', width: '100%' }}>
                        {/* Status Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{msg.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{msg.time}</span>
                          
                          {/* 3-Way Governance Badge */}
                          {gov && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor: isAuto ? '#DCFCE7' : isApproval ? '#FEF3C7' : '#FEE2E2',
                              color: isAuto ? '#166534' : isApproval ? '#B45309' : '#B91C1C',
                              border: `1px solid ${isAuto ? '#86EFAC' : isApproval ? '#FCD34D' : '#FCA5A5'}`
                            }}>
                              <span>{isAuto ? '🟢 DECISION: AUTO-EXECUTE' : isApproval ? '🟡 DECISION: HUMAN APPROVAL' : '🔴 DECISION: BLOCK'}</span>
                            </span>
                          )}

                          {gov?.reasonCode && (
                            <span style={{ fontSize: '10.5px', color: 'var(--ink-muted)', fontFamily: 'ui-monospace, monospace' }}>
                              [{gov.reasonCode}]
                            </span>
                          )}
                        </div>

                        {/* Aria's text message */}
                        <div style={{
                          backgroundColor: '#FFFFFF',
                          color: 'var(--ink)',
                          padding: '16px 20px',
                          borderRadius: '4px 20px 20px 20px',
                          fontSize: '15px',
                          lineHeight: 1.6,
                          border: `1px solid ${isBlock ? '#FECACA' : isApproval ? '#FDE68A' : 'var(--border-cream)'}`,
                          boxShadow: 'var(--shadow-warm-sm)',
                          marginBottom: '14px'
                        }}>
                          {msg.text}

                          {/* Explainability Callout */}
                          {gov?.reasonText && (
                            <div style={{
                              marginTop: '12px',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              backgroundColor: isAuto ? '#F0FDF4' : isApproval ? '#FFFBEB' : '#FEF2F2',
                              border: `1px solid ${isAuto ? '#BBF7D0' : isApproval ? '#FDE68A' : '#FECACA'}`,
                              fontSize: '12.5px',
                              lineHeight: 1.5,
                              color: isAuto ? '#166534' : isApproval ? '#92400E' : '#991B1B'
                            }}>
                              <strong>Governance Audit Explanation:</strong> {gov.reasonText}
                            </div>
                          )}

                          {/* Action Buttons for Human Approval */}
                          {isApproval && gov.orderId && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              marginTop: '14px',
                              flexWrap: 'wrap'
                            }}>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleDirectApprove(gov.orderId)}
                                style={{ backgroundColor: '#166534', borderRadius: 'var(--radius-pill)' }}
                              >
                                ✓ Authorize Order (Execute Now)
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDirectReject(gov.orderId)}
                                style={{ borderRadius: 'var(--radius-pill)' }}
                              >
                                ✕ Release Hold (Cancel)
                              </Button>
                              <button
                                onClick={() => onNavigateToScreen('needs_ok')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--forest-green)',
                                  fontSize: '12.5px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <span>Inspect in "Needs my OK"</span>
                                <ArrowUpRight size={13} />
                              </button>
                            </div>
                          )}

                          {/* Direct Actions for Blocked Policy Violation */}
                          {isBlock && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              marginTop: '14px',
                              flexWrap: 'wrap'
                            }}>
                              <button
                                onClick={() => onNavigateToScreen('not_placed')}
                                style={{
                                  backgroundColor: '#FEE2E2',
                                  color: '#B91C1C',
                                  border: '1px solid #FCA5A5',
                                  padding: '6px 14px',
                                  borderRadius: 'var(--radius-pill)',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <span>🛡️ View in "Not Placed" Safeguards</span>
                                <ArrowUpRight size={13} />
                              </button>
                              <button
                                onClick={() => onNavigateToScreen('rules')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--ink-secondary)',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                <span>⚙️ Adjust Monthly Spending Cap in Rules</span>
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
                    <div key={msg.id} style={{ paddingLeft: '48px', marginBottom: '14px' }}>
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
                        onTrackOrder={() => {
                          onNavigateToScreen('orders');
                          if (onShowToast) onShowToast("Navigated to Orders Audit Ledger.");
                        }}
                        onShowToast={onShowToast}
                      />
                    </div>
                  );
                }

                return null;
              })}

              {/* ─── 5-STAGE PROGRESSIVE AGENT ACTIVITY STEPPER ─── */}
              {agentExecuting && (
                <div className="agent-step-appear" style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #86EFAC',
                  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.14)',
                  padding: '22px 24px',
                  margin: '10px 0 16px 48px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Top glowing scan line */}
                  <div className="agent-scan-shimmer" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px'
                  }} />

                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="agent-live-glow" style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--forest-green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF'
                      }}>
                        <Cpu size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--forest-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>PRE-EXECUTION GOVERNANCE ENGINE</span>
                          <span style={{ fontSize: '10px', backgroundColor: '#DCFCE7', color: '#15803D', padding: '1px 7px', borderRadius: '4px', fontWeight: 800 }}>AUDITING</span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--ink-muted)' }}>
                          Step-by-step verification before executing commerce tools
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11.5px',
                      color: 'var(--forest-green)',
                      fontWeight: 600,
                      backgroundColor: 'var(--forest-green-light)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--forest-green-border)'
                    }}>
                      <span className="pulse-badge" style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                      <span>Stage {agentStep + 1} of 5</span>
                    </div>
                  </div>

                  {/* 5-Step dynamic checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                    {STEP_DETAILS.map((step, idx) => {
                      const isDone = agentStep > idx;
                      const isCurrent = agentStep === idx;
                      return (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '13px',
                          color: isDone ? 'var(--forest-green)' : isCurrent ? 'var(--ink)' : 'var(--ink-muted)',
                          fontWeight: isCurrent ? 600 : 500,
                          transition: 'all 0.25s ease'
                        }}>
                          <div style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isDone ? '#DCFCE7' : isCurrent ? 'var(--forest-green-light)' : 'var(--bg-cream-subtle)',
                            color: isDone ? '#166534' : isCurrent ? 'var(--forest-green)' : 'var(--ink-muted)',
                            border: isDone ? '1px solid #86EFAC' : isCurrent ? '1.5px solid var(--forest-green)' : '1px solid var(--border-cream)',
                            flexShrink: 0,
                            fontSize: '11.5px',
                            fontWeight: 700
                          }}>
                            {isDone ? '✓' : isCurrent ? '⚡' : idx + 1}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{step.title}</span>
                              <span style={{
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                backgroundColor: isDone ? '#EAF4EE' : isCurrent ? '#FEF3C7' : '#F4F2ED',
                                color: isDone ? '#166534' : isCurrent ? '#B45309' : '#8E8D85',
                                fontWeight: 700
                              }}>
                                {isDone ? 'Pass' : isCurrent ? 'Executing...' : 'Queued'}
                              </span>
                            </div>
                            <div style={{ fontSize: '11.5px', color: isCurrent ? 'var(--forest-green)' : 'var(--ink-secondary)', marginTop: '1px' }}>
                              {step.subtext}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Animated Progress Meter */}
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'var(--bg-cream-subtle)',
                    borderRadius: '9999px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (agentStep + 1) * 20)}%`,
                      backgroundColor: 'var(--forest-green)',
                      backgroundImage: 'linear-gradient(90deg, #1F4D3A 0%, #10B981 50%, #34D399 100%)',
                      borderRadius: '9999px',
                      transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                  </div>
                </div>
              )}

              {/* ─── DYNAMIC PRODUCT RESULTS (Progressive reveal in responsive grid) ─── */}
              {!agentExecuting && agentActionData && agentActionData.matchedProducts.length > 0 && (
                <div style={{ paddingLeft: '48px', marginBottom: '14px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <div>
                      <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, color: 'var(--forest-green)' }}>
                        VERIFIED RESULTS MATCHING YOUR PREFERENCES
                      </span>
                      <div style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>
                        Distinguishing recommendations from purchase authorization. Zero money moves until you authorize.
                      </div>
                    </div>

                    {agentActionData.matchedProducts.length > 1 && (
                      <button
                        onClick={() => setShowComparisonMatrix(!showComparisonMatrix)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--border-cream)',
                          borderRadius: 'var(--radius-pill)',
                          padding: '5px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--forest-green)',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-warm-sm)'
                        }}
                      >
                        <Layers size={13} />
                        <span>{showComparisonMatrix ? 'Hide Comparison Matrix' : 'Compare Options Side-by-Side'}</span>
                        {showComparisonMatrix ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    )}
                  </div>

                  {/* Interactive Side-by-Side Comparison Matrix */}
                  {showComparisonMatrix && (
                    <div className="agent-step-appear" style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid var(--forest-green-border)',
                      padding: '16px',
                      marginBottom: '18px',
                      overflowX: 'auto',
                      boxShadow: 'var(--shadow-warm-md)'
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '10px' }}>
                        ⚖️ Side-by-Side Acoustic & Governance Comparison
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1.5px solid var(--border-cream)' }}>
                            <th style={{ padding: '8px 10px', color: 'var(--ink-muted)', fontWeight: 600 }}>Feature</th>
                            {agentActionData.matchedProducts.map((p) => (
                              <th key={p.id} style={{ padding: '8px 10px', color: 'var(--ink)', fontWeight: 700 }}>
                                {p.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid var(--border-cream-subtle)' }}>
                            <td style={{ padding: '8px 10px', color: 'var(--ink-muted)', fontWeight: 600 }}>Price</td>
                            {agentActionData.matchedProducts.map((p) => (
                              <td key={p.id} style={{ padding: '8px 10px', fontWeight: 700, color: p.price > monthlyCap ? '#B91C1C' : 'var(--ink)' }}>
                                ₹{p.price.toLocaleString('en-IN')}
                              </td>
                            ))}
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border-cream-subtle)' }}>
                            <td style={{ padding: '8px 10px', color: 'var(--ink-muted)', fontWeight: 600 }}>Acoustic Rating</td>
                            {agentActionData.matchedProducts.map((p) => (
                              <td key={p.id} style={{ padding: '8px 10px', color: 'var(--ink-secondary)' }}>
                                {p.acoustics || 'Whisper quiet profile'}
                              </td>
                            ))}
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border-cream-subtle)' }}>
                            <td style={{ padding: '8px 10px', color: 'var(--ink-muted)', fontWeight: 600 }}>Verified Partner</td>
                            {agentActionData.matchedProducts.map((p) => (
                              <td key={p.id} style={{ padding: '8px 10px', color: 'var(--forest-green)', fontWeight: 600 }}>
                                ✓ {p.partner}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td style={{ padding: '8px 10px', color: 'var(--ink-muted)', fontWeight: 600 }}>Governance Status</td>
                            {agentActionData.matchedProducts.map((p) => {
                              const isOverCap = p.price > monthlyCap;
                              const isOverThresh = p.price > approvalThreshold;
                              return (
                                <td key={p.id} style={{ padding: '8px 10px' }}>
                                  <span style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-pill)',
                                    backgroundColor: isOverCap ? '#FEE2E2' : isOverThresh ? '#FEF3C7' : '#DCFCE7',
                                    color: isOverCap ? '#B91C1C' : isOverThresh ? '#B45309' : '#166534'
                                  }}>
                                    {isOverCap ? 'Blocked (> Cap)' : isOverThresh ? 'Needs Approval' : 'Auto-Execute'}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Responsive Product Cards Grid */}
                  <div className="agent-product-grid">
                    {agentActionData.matchedProducts.map((prod) => {
                      const isOverCap = prod.price > monthlyCap;
                      const isOverThresh = prod.price > approvalThreshold;

                      return (
                        <div
                          key={prod.id}
                          className="agent-step-appear"
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '20px',
                            border: `1.5px solid ${isOverCap ? '#FCA5A5' : isOverThresh ? '#FCD34D' : 'var(--border-cream)'}`,
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-warm-sm)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {/* Image & Verified Tag */}
                          <div style={{ position: 'relative', height: '170px', backgroundColor: '#FAF5EE' }}>
                            <img
                              src={prod.image}
                              alt={prod.name}
                              onError={(e) => {
                                e.currentTarget.src = '/assets/framework_laptop.jpg';
                              }}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />

                            {/* Top Badges */}
                            <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{
                                backgroundColor: isOverCap ? '#FEE2E2' : isOverThresh ? '#FEF3C7' : 'rgba(255, 255, 255, 0.95)',
                                color: isOverCap ? '#B91C1C' : isOverThresh ? '#B45309' : 'var(--forest-green)',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                border: '1px solid var(--border-cream)'
                              }}>
                                {isOverCap ? 'BLOCKED · OVER CAP' : isOverThresh ? 'NEEDS HUMAN OK' : 'PRE-AUDITED'}
                              </span>

                              <span style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                color: 'var(--ink)',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '10.5px',
                                fontWeight: 600,
                                border: '1px solid var(--border-cream)'
                              }}>
                                {prod.rating}
                              </span>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', gap: '6px' }}>
                                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, color: 'var(--forest-green)' }}>
                                  ✓ {prod.partner}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{prod.batch}</span>
                              </div>

                              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>
                                {prod.name}
                              </h3>

                              <p style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', marginBottom: '10px', lineHeight: 1.45 }}>
                                {prod.specs}
                              </p>

                              {/* Why Aria picked this */}
                              <div style={{
                                backgroundColor: 'var(--bg-cream-subtle)',
                                border: '1px solid var(--border-cream-subtle)',
                                borderRadius: '8px',
                                padding: '8px 10px',
                                fontSize: '12px',
                                color: 'var(--ink-secondary)',
                                marginBottom: '12px',
                                lineHeight: 1.4
                              }}>
                                <strong style={{ color: 'var(--forest-green)' }}>Why Aria picked this:</strong> {prod.rationale}
                              </div>
                            </div>

                            {/* Price & Action Row */}
                            <div>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '12px',
                                paddingTop: '8px',
                                borderTop: '1px solid var(--border-cream-subtle)'
                              }}>
                                <div>
                                  <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Pre-tax & Courier</div>
                                  <div style={{ fontSize: '18px', fontWeight: 700, color: isOverCap ? '#B91C1C' : 'var(--ink)' }}>
                                    ₹{prod.price.toLocaleString('en-IN')}
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--ink-secondary)' }}>
                                  <Truck size={14} color="var(--forest-green)" />
                                  <span>{prod.delivery}</span>
                                </div>
                              </div>

                              {/* Distinguish recommendation from purchase authorization */}
                              {isOverCap ? (
                                <button
                                  onClick={() => onNavigateToScreen('rules')}
                                  style={{
                                    width: '100%',
                                    backgroundColor: '#FEE2E2',
                                    color: '#B91C1C',
                                    border: '1px solid #FCA5A5',
                                    padding: '10px',
                                    borderRadius: 'var(--radius-pill)',
                                    fontSize: '12.5px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Adjust Spending Cap in Rules
                                </button>
                              ) : isOverThresh ? (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleOrderProductCard(prod)}
                                  style={{ width: '100%', backgroundColor: '#B45309', borderRadius: 'var(--radius-pill)', padding: '10px' }}
                                >
                                  Ask Aria to order (15-min hold)
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleOrderProductCard(prod)}
                                  icon={<ShoppingBag size={14} />}
                                  iconPosition="right"
                                  style={{ width: '100%', borderRadius: 'var(--radius-pill)', padding: '10px' }}
                                >
                                  Ask Aria to order (15-min hold)
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Follow-up Suggestion Chips */}
              {!agentExecuting && (
                <div style={{ paddingLeft: '48px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {followUpChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => runAgentWorkflow(chip)}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-cream)',
                        borderRadius: 'var(--radius-pill)',
                        padding: '6px 12px',
                        fontSize: '12.5px',
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
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Conversation Panel Footer Controls */}
            <div style={{
              padding: '12px 24px',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid var(--border-cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--ink-muted)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Lock size={12} color="var(--forest-green)" />
                <span>Deterministic Cap: ₹{monthlyCap.toLocaleString('en-IN')} · Auto-Approval Threshold: ₹{approvalThreshold.toLocaleString('en-IN')}</span>
              </span>
              <button
                onClick={() => setChatOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--forest-green)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Close conversation ▲
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
