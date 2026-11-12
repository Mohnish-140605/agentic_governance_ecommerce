import React, { useState } from 'react';
import { 
  Sparkles, 
  CreditCard, 
  Smartphone, 
  Tag, 
  Heart, 
  Home, 
  Laptop, 
  ChevronRight,
  TrendingDown,
  Clock,
  RotateCcw,
  User,
  Bookmark
} from 'lucide-react';

// Left sidebar navigation items matching Amazon app screenshot
export const AMAZON_LEFT_TABS = [
  { 
    id: 'top-picks', 
    name: 'Top Picks', 
    slug: 'smartphones', 
    icon: Sparkles, 
    color: '#D97706',
    query: 'top picks best sellers laptops smartphones' 
  },
  { 
    id: 'amazon-pay', 
    name: 'Amazon Pay', 
    slug: 'mobile-accessories', 
    icon: CreditCard, 
    color: '#0284C7',
    query: 'chargers power banks cables tech' 
  },
  { 
    id: 'mobiles-tech', 
    name: 'Mobiles & Electronics', 
    slug: 'laptops', 
    icon: Laptop, 
    color: '#4F46E5',
    query: 'laptops electronics gadgets headphones' 
  },
  { 
    id: 'deals-savings', 
    name: 'Deals & Savings', 
    slug: 'groceries', 
    icon: Tag, 
    color: '#DC2626',
    query: 'deals discounts groceries pantry' 
  },
  { 
    id: 'fashion-beauty', 
    name: 'Fashion & Beauty', 
    slug: 'beauty', 
    icon: Heart, 
    color: '#DB2777',
    query: 'beauty cosmetics apparel fashion' 
  },
  { 
    id: 'home-furniture', 
    name: 'Home & Furniture', 
    slug: 'furniture', 
    icon: Home, 
    color: '#059669',
    query: 'furniture home decor sofa chair' 
  },
];

// Main 12 Department Tiles matching the exact screenshot
export const AMAZON_DEPARTMENT_TILES = [
  {
    id: 'mobiles',
    name: 'Mobiles',
    slug: 'smartphones',
    query: 'smartphone 5g mobile phone',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'mens-shirts',
    query: 'apparel casual wear fashion clothing',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'laptops',
    query: 'laptop ultrabook headphones accessories',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'travel',
    name: 'Travel',
    slug: 'vehicle',
    query: 'travel backpack luggage accessories',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'deals',
    name: 'Deals',
    slug: 'groceries',
    query: 'deals discounts price drops',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'home',
    name: 'Home',
    slug: 'home-decoration',
    query: 'home decor clock vase blender kettle',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'everyday-needs',
    name: 'Everyday Needs',
    slug: 'groceries',
    query: 'groceries everyday pantry staples tea coffee',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'bills-recharges',
    name: 'Bills & Recharges',
    slug: 'mobile-accessories',
    query: 'chargers powerbank utility electronics',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    slug: 'beauty',
    query: 'skincare beauty hair dryer perfume',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'appliances',
    name: 'Appliances',
    slug: 'kitchen-accessories',
    query: 'appliances washing machine tv microwave',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'furniture',
    name: 'Furniture',
    slug: 'furniture',
    query: 'sofa couch chair wooden table furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'kids-toys',
    name: 'Kids & Toys',
    slug: 'tops',
    query: 'toys teddy bear board games kids',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&auto=format&fit=crop&q=80'
  }
];

export default function AmazonCategoryGrid({
  selectedCategory,
  onSelectCategory,
  onQuickAction,
  isLoading
}) {
  const [activeTab, setActiveTab] = useState('top-picks');

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      border: '1px solid #D5D9D9',
      boxShadow: '0 2px 5px rgba(15, 17, 17, 0.08)',
      marginBottom: '28px',
      overflow: 'hidden',
      fontFamily: '"Amazon Ember", Arial, sans-serif'
    }}>
      {/* 2-Column Responsive Layout: Left Sidebar + Right Category Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '175px 1fr',
        minHeight: '480px'
      }}>
        {/* ─── Left Sidebar Navigation ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E7E7E7',
          paddingTop: '4px'
        }}>
          {AMAZON_LEFT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  const matchingTile = AMAZON_DEPARTMENT_TILES.find(t => t.slug === tab.slug) || AMAZON_DEPARTMENT_TILES[0];
                  onSelectCategory(matchingTile);
                }}
                disabled={isLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '14px 10px 14px 14px',
                  border: 'none',
                  borderLeft: isTabActive ? '4px solid #007185' : '4px solid transparent',
                  backgroundColor: isTabActive ? '#F2F8F8' : 'transparent',
                  cursor: isLoading ? 'wait' : 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.1s ease',
                  position: 'relative'
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '5px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: isTabActive ? '#E6F4F5' : '#F7F8F8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tab.color
                  }}>
                    <Icon size={18} />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: isTabActive ? 700 : 500,
                    color: isTabActive ? '#007185' : '#0F1111',
                    lineHeight: 1.25
                  }}>
                    {tab.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ─── Right Side Content (Exact 12 Tiles + Explore More + Badges) ─── */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#FFFFFF'
        }}>
          {/* Main 12 Categories Grid (3 Columns) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px 10px',
            marginBottom: '28px'
          }}>
            {AMAZON_DEPARTMENT_TILES.map((item) => {
              const isSelected = selectedCategory === item.slug;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectCategory(item)}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '8px 4px',
                    backgroundColor: '#FFFFFF',
                    border: isSelected ? '1px solid #007185' : '1px solid transparent',
                    borderRadius: '8px',
                    cursor: isLoading ? 'wait' : 'pointer',
                    outline: 'none',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F7F8F8';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {/* Category Cut-Out Image Container */}
                  <div style={{
                    width: '68px',
                    height: '68px',
                    backgroundColor: '#F8F9F9',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 4px rgba(15, 17, 17, 0.06)'
                  }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      loading="lazy"
                    />
                  </div>

                  {/* Clean Amazon Font Label */}
                  <span style={{
                    fontSize: '12.5px',
                    fontWeight: 500,
                    color: '#0F1111',
                    lineHeight: 1.25,
                    fontFamily: '"Amazon Ember", Arial, sans-serif'
                  }}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ─── "Explore More" Section ─── */}
          <div style={{
            borderTop: '1px solid #EAEDED',
            paddingTop: '18px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#0F1111',
              margin: '0 0 14px 0',
              fontFamily: '"Amazon Ember", Arial, sans-serif'
            }}>
              Explore More
            </h3>

            {/* 3 App Service Icons (Prime, Business, Customer Service) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '18px'
            }}>
              {/* Prime */}
              <div 
                onClick={() => onSelectCategory(AMAZON_DEPARTMENT_TILES[0])}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#00A8E1',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '14px',
                  letterSpacing: '-0.02em',
                  marginBottom: '6px',
                  boxShadow: '0 2px 6px rgba(0, 168, 225, 0.25)'
                }}>
                  prime
                </div>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#0F1111' }}>
                  Prime
                </span>
              </div>

              {/* Amazon Business */}
              <div 
                onClick={() => onSelectCategory(AMAZON_DEPARTMENT_TILES[2])}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#6C48B0',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '10px',
                  lineHeight: 1.1,
                  marginBottom: '6px',
                  boxShadow: '0 2px 6px rgba(108, 72, 176, 0.25)'
                }}>
                  <span style={{ fontSize: '9px', opacity: 0.85 }}>amazon</span>
                  <span>business</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#0F1111' }}>
                  Business
                </span>
              </div>

              {/* Customer Service */}
              <div 
                onClick={() => onQuickAction && onQuickAction('account')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#008296',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '9.5px',
                  lineHeight: 1.1,
                  marginBottom: '6px',
                  boxShadow: '0 2px 6px rgba(0, 130, 150, 0.25)'
                }}>
                  <span>customer</span>
                  <span>service</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#0F1111' }}>
                  Customer Service
                </span>
              </div>
            </div>

            {/* 2 Amazon Budget Badges (Under 299 & Under ₹999) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '14px',
              marginTop: '10px'
            }}>
              {/* Budget Picks Under 299 (Purple Pill) */}
              <button
                onClick={() => onSelectCategory({
                  id: 'under-299',
                  name: 'Budget Picks Under ₹299',
                  slug: 'groceries',
                  query: 'essentials under 299 coffee tea spices'
                })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px 8px',
                  backgroundColor: '#581C87',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(88, 28, 135, 0.25)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 800,
                  fontSize: '15px'
                }}>
                  <span>Under 299</span>
                  <TrendingDown size={15} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9 }}>
                  Budget Picks
                </span>
              </button>

              {/* Under ₹999 Price Drop (Orange Badge) */}
              <button
                onClick={() => onSelectCategory({
                  id: 'under-999',
                  name: 'Under ₹999 Deals',
                  slug: 'kitchen-accessories',
                  query: 'curated items under 999 kitchen home'
                })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px 8px',
                  backgroundColor: '#EA580C',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(234, 88, 12, 0.25)'
                }}
              >
                <div style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  marginBottom: '2px'
                }}>
                  PRICE DROP
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 800,
                  fontSize: '15px'
                }}>
                  <span>Under ₹999</span>
                  <TrendingDown size={15} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Floating Action Pills matching Screenshot ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        backgroundColor: '#F8F9F9',
        borderTop: '1px solid #E7E7E7',
        gap: '10px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'orders', label: 'Orders', icon: Clock },
          { id: 'buy-again', label: 'Buy Again', icon: RotateCcw },
          { id: 'account', label: 'Account', icon: User },
          { id: 'lists', label: 'Lists', icon: Bookmark },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onQuickAction && onQuickAction(item.id)}
              style={{
                flex: 1,
                minWidth: '85px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #D5D9D9',
                backgroundColor: '#FFFFFF',
                color: '#0F1111',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: '"Amazon Ember", Arial, sans-serif',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(15, 17, 17, 0.05)',
                whiteSpace: 'nowrap',
                transition: 'background-color 0.1s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F7FAFA';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <Icon size={14} color="#565959" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
