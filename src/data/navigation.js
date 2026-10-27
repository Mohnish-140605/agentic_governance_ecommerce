export const CUSTOMER_NAV_SCREENS = [
  { id: 'explore', label: 'Explore', subtitle: 'Screen 1 · Quiet Catalog' },
  { id: 'chat', label: 'Chat with Aria', subtitle: 'Screen 2 · Thoughtful Assistant' },
  { id: 'needs_ok', label: 'Needs my OK', subtitle: 'Screen 3 · Approval Hold', badgeKey: 'approvals' },
  { id: 'not_placed', label: 'Not Placed', subtitle: 'Screen 4 · Safeguards' },
  { id: 'orders', label: 'Orders', subtitle: 'Screen 5 · Trust Receipts' },
  { id: 'rules', label: 'My Rules', subtitle: 'Screen 6 · Personal Safeguards' },
  { id: 'how_aria_works', label: 'How Aria Works', subtitle: 'Screen 9 · The Cairn Story' }
];

export const SELLER_NAV_SCREENS = [
  { id: 'seller_hub', label: 'Inventory & Listings', subtitle: 'Screen 7 · Merchant Integrity' },
  { id: 'store_health', label: 'Store Health & Audit', subtitle: 'Screen 8 · Cryptographic Proofs' },
  { id: 'seller_orders', label: 'Buyer Orders & Escrow', subtitle: 'Fulfillment & Tranquility Holds', badgeKey: 'sellerOrders' }
];

export const DEFAULT_USER = {
  id: 'usr_priya_google',
  name: 'Priya Sharma',
  email: 'priya.sharma@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
  provider: 'google',
  verified: true,
  joined: 'October 2025'
};

export const POPULAR_LOCATIONS = [
  {
    city: 'New Delhi',
    locality: 'Jor Bagh, South Delhi',
    state: 'Delhi',
    pincode: '110003',
    lat: 28.5893,
    lng: 77.2183,
    deliveryTime: '18 mins',
    hub: 'Cairn North India Fulfillment Hub'
  },
  {
    city: 'Bengaluru',
    locality: '100ft Road, Indiranagar',
    state: 'Karnataka',
    pincode: '560038',
    lat: 12.9784,
    lng: 77.6408,
    deliveryTime: '14 mins',
    hub: 'Cairn Tech Corridor Hub'
  },
  {
    city: 'Mumbai',
    locality: 'Pali Hill, Bandra West',
    state: 'Maharashtra',
    pincode: '400050',
    lat: 19.0607,
    lng: 72.8272,
    deliveryTime: '22 mins',
    hub: 'Cairn Western Seaboard Hub'
  },
  {
    city: 'Hyderabad',
    locality: 'Road No. 36, Jubilee Hills',
    state: 'Telangana',
    pincode: '500033',
    lat: 17.4319,
    lng: 78.4073,
    deliveryTime: '20 mins',
    hub: 'Cairn Deccan Fulfillment Center'
  },
  {
    city: 'San Francisco',
    locality: 'Valencia St, Mission District',
    state: 'California',
    pincode: '94110',
    lat: 37.7599,
    lng: -122.4206,
    deliveryTime: '35 mins',
    hub: 'Cairn Bay Area Express'
  },
  {
    city: 'London',
    locality: 'Redchurch St, Shoreditch',
    state: 'Greater London',
    pincode: 'E2 7DD',
    lat: 51.5245,
    lng: -0.0768,
    deliveryTime: '30 mins',
    hub: 'Cairn European Guild Hub'
  }
];
