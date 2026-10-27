export const INITIAL_RULES = {
  monthlyCap: 50000,
  currentUsage: 32000,
  approvalThreshold: 100000,
  approvalMode: 'balanced', // conservative (25k), balanced (100k), relaxed (150k)
  tranquilityHoldMinutes: 15,
  tranquilityHoldEnabled: true,
  outOfBudgetBehavior: 'alternatives', // 'alternatives' | 'notify_only'
  activeProfile: "Priya's Calm Home"
};

export const INITIAL_ORDERS = [
  {
    id: 'CRN-88421',
    item: 'Dell XPS 13 Plus',
    subtitle: 'Pure White Edition · CNC Machined Aluminum & Gorilla Glass',
    price: 120000,
    status: 'needs_ok',
    timestamp: 'Today · 10:41 AM IST',
    image: '/assets/dell_xps.jpg',
    merchant: 'Dell Direct Official Flagship',
    paymentChannel: 'HDFC Priority ••4902',
    destination: 'Jor Bagh, Priya\'s Residence',
    flagReason: 'Rule #04 triggered: Exceeds auto threshold ₹1,20,000 > ₹1,00,000 limit',
    expiresInSeconds: 645, // live timer
    stamps: {
      budget: {
        title: 'Budget Approved',
        desc: 'Within overall wallet budget (₹1,50,000 available)',
        status: 'placed'
      },
      approval: {
        title: 'Needs Confirmation',
        desc: 'Exceeds auto threshold: ₹1,20,000 > ₹1,00,000 limit',
        status: 'review'
      },
      merchant: {
        title: 'Authentic Seller',
        desc: 'Verified flagship merchant · Direct OEM fulfilment',
        status: 'placed'
      }
    },
    sha256: '9e88fa12c309b4d...77e1',
    ruleSet: 'Priya-Primary-2026'
  },
  {
    id: 'CRN-9842',
    item: 'Framework Laptop 13',
    subtitle: 'Matte anti-glare display, AMD Ryzen 7, swappable USB-C modular chassis',
    price: 94990,
    status: 'placed',
    timestamp: 'Today · 10:43 AM IST',
    image: '/assets/framework_laptop.jpg',
    merchant: 'Direct Partner Direct Delivery',
    paymentChannel: 'HDFC Priority ••4902',
    destination: 'Jor Bagh, Priya\'s Residence',
    deliveryDate: 'Est. Delivery Thu, 24 Oct',
    stamps: {
      budget: {
        title: 'Within Your Budget',
        desc: '₹94,990 < ₹1,00,000 monthly hardware allowance',
        status: 'placed'
      },
      approval: {
        title: 'Under Approval Limit',
        desc: 'Pre-authorized single transaction limit ₹1,00,000',
        status: 'placed'
      },
      merchant: {
        title: 'Seller Verified',
        desc: 'Authentic modular hardware partner',
        status: 'placed'
      }
    },
    sha256: '7f920eb18a24...05a1',
    ruleSet: 'Priya-Primary-2026'
  },
  {
    id: 'CRN-8721',
    item: 'Kinto Slow Coffee Brewer',
    subtitle: 'Heat-resistant glass carafe with permanent mesh filter (600ml)',
    price: 3450,
    status: 'placed',
    timestamp: 'Yesterday · 4:15 PM IST',
    image: '/assets/kinto_coffee.jpg',
    merchant: 'Kinto Japan Official Curations',
    paymentChannel: 'UPI Autopay ••312',
    destination: 'Jor Bagh, Priya\'s Residence',
    deliveryDate: 'Arrives Tomorrow Morning',
    stamps: {
      budget: {
        title: 'Within Coffee Budget',
        desc: '₹3,450 < ₹5,000 monthly living pantry cap',
        status: 'placed'
      },
      approval: {
        title: 'Under Auto Limit',
        desc: 'Pre-cleared routine essential rule #02',
        status: 'placed'
      },
      merchant: {
        title: 'Seller Verified',
        desc: 'Direct import verified artisan goods',
        status: 'placed'
      }
    },
    sha256: '3a18ef902b77...910c',
    ruleSet: 'Priya-Primary-2026'
  },
  {
    id: 'CRN-99410-HLD',
    item: 'MacBook Air M2 (16GB, 256GB Starlight)',
    subtitle: 'Merchant: UnboxCraft Authorized Studio · Delhi Hub',
    price: 75000,
    status: 'failed',
    timestamp: 'Yesterday · 2:20 PM IST',
    image: '/assets/framework_laptop.jpg', // or laptop
    merchant: 'UnboxCraft Authorized Studio',
    paymentChannel: 'HDFC Priority ••4902',
    destination: 'Jor Bagh, Priya\'s Residence',
    flagReason: 'Exceeds monthly allowance: ₹75,000 exceeds ₹50,000 cap by exactly ₹25,000',
    stamps: {
      budget: {
        title: 'Exceeds Monthly Allowance',
        desc: '₹75,000 exceeds ₹50,000 monthly cap by exactly ₹25,000',
        status: 'failed'
      },
      approval: {
        title: 'Approval Paused',
        desc: 'Pending deliberate user confirmation or re-scoping',
        status: 'review'
      },
      merchant: {
        title: 'Seller Verified',
        desc: 'Merchant credentials & return escrow fully greenlit',
        status: 'placed'
      }
    },
    sha256: 'bb8412c98a33...449d',
    ruleSet: 'Priya-Primary-2026'
  }
];

export const PICKED_PRODUCTS = [
  {
    id: 'prod-framework',
    name: 'Framework Laptop 13',
    price: 94990,
    category: 'Hardware',
    tag: 'Under your ₹1,00,000 cap',
    tagType: 'placed',
    specs: 'Intel Core Ultra Edition · 16GB · Modular IO',
    rationale: 'Picked because: Fits your silent typing and Linux preferences',
    image: '/assets/framework_laptop.jpg',
    merchant: 'Framework Computer Inc.'
  },
  {
    id: 'prod-kinto',
    name: 'Kinto Slow Coffee Brewer',
    price: 3450,
    category: 'Home & Kitchen',
    tag: 'Within monthly coffee budget',
    tagType: 'review',
    specs: 'Heat-resistant glass carafe with permanent mesh filter',
    rationale: 'Matches your weekend pour-over routine rule',
    badge: 'ARRIVES TOMORROW MORNING',
    image: '/assets/kinto_coffee.jpg',
    merchant: 'Kinto Japan Official'
  },
  {
    id: 'prod-tekla',
    name: 'Tekla Percale Bedding',
    price: 11200,
    category: 'Living',
    tag: 'Verified organic merchant',
    tagType: 'neutral',
    specs: '100% GOTS certified cotton · Queen set · Sage Stripe',
    rationale: 'Restock suggestion for your guest room suite',
    badge: 'STORED IN WISHLIST',
    image: '/assets/tekla_bedding.jpg',
    merchant: 'Tekla Copenhagen'
  }
];

export const ALTERNATIVE_PRODUCTS = [
  {
    id: 'alt-lenovo',
    brand: 'LENOVO ULTRA SERIES',
    name: 'Lenovo Yoga Slim 6',
    price: 48990,
    rating: '4.9 (120)',
    tag: 'Within budget (₹1,010 under)',
    tagType: 'placed',
    subtext: 'OLED · 120Hz · Silent Fan',
    description: 'Luminescent OLED panel, whispering fan profile for focused deep work, and military-grade all-aluminum unibody.',
    image: '/assets/lenovo_yoga.jpg'
  },
  {
    id: 'alt-acer',
    brand: 'ACER ATELIER',
    name: 'Acer Swift Go 14',
    price: 45990,
    rating: '4.8 (94)',
    tag: 'Verified Merchant',
    tagType: 'placed',
    subtext: '1.25 kg Featherlight',
    description: 'Exceptional day-long battery life, twin Thunderbolt ports, and responsive glass trackpad.',
    image: '/assets/acer_swift.jpg'
  },
  {
    id: 'alt-asus',
    brand: 'CAIRN CIRCULAR ARCHIVE',
    name: 'ASUS ZenBook 14 Pristine',
    price: 42500,
    rating: '5.0 (46)',
    tag: '1-Yr Cairn Warranty',
    tagType: 'review',
    subtext: 'Pristine Certified Grade-A',
    description: 'Zero cosmetic flaws, 98% original battery capacity verified by Cairn Labs, backed by our escrow guarantee.',
    image: '/assets/zenbook.jpg'
  }
];

export const SELLER_LISTINGS = [
  {
    id: 'SKU-7729',
    name: 'Minimal Japanese Ceramic Mug (Chalk White)',
    merchant: 'Studio Hasami Crafts',
    stock: 24,
    price: 1800,
    status: 'Verified & Active',
    badge: 'VERIFIED',
    type: 'own'
  },
  {
    id: 'SKU-8190',
    name: 'Solid Walnut Monitor Shelf (Dual Deck)',
    merchant: 'Grovemade Artisan Studio',
    stock: 8,
    price: 14500,
    status: 'Verified & Active',
    badge: 'VERIFIED',
    type: 'own'
  },
  {
    id: 'SKU-9912',
    name: 'Analog Quartz Desk Clock (Brushed Brass)',
    merchant: 'Lemnos Clocks Japan',
    stock: 0,
    price: 6200,
    status: 'Restock Scheduled',
    badge: 'HOLD',
    type: 'own'
  }
];
