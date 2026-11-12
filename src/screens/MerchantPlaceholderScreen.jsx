import React from 'react';
import { Package, ShoppingCart, BarChart3, Users, Megaphone, Bot, ShieldCheck, Clock, Settings } from 'lucide-react';

const SCREEN_CONFIG = {
  orders: {
    title: 'Orders',
    icon: ShoppingCart,
    description: 'Manage and track all customer orders'
  },
  products: {
    title: 'Products',
    icon: Package,
    description: 'Manage your product catalog and listings'
  },
  inventory: {
    title: 'Inventory',
    icon: Package,
    description: 'Track stock levels and inventory management'
  },
  customers: {
    title: 'Customers',
    icon: Users,
    description: 'View customer data and purchase history'
  },
  analytics: {
    title: 'Analytics',
    icon: BarChart3,
    description: 'Detailed sales and performance analytics'
  },
  marketing: {
    title: 'Marketing',
    icon: Megaphone,
    description: 'Promotional campaigns and marketing tools'
  },
  merchant_agent: {
    title: 'Merchant Agent',
    icon: Bot,
    description: 'AI-powered merchant assistance and insights'
  },
  governance: {
    title: 'Governance & Trust',
    icon: ShieldCheck,
    description: 'Compliance monitoring and trust management'
  },
  sla: {
    title: 'SLA Management',
    icon: Clock,
    description: 'Service level agreements and delivery tracking'
  },
  settings: {
    title: 'Settings',
    icon: Settings,
    description: 'Store settings and preferences'
  }
};

export default function MerchantPlaceholderScreen({ screenId, onBack }) {
  const config = SCREEN_CONFIG[screenId] || {
    title: 'Coming Soon',
    icon: Package,
    description: 'This feature is under development'
  };

  const Icon = config.icon;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-cream)',
      padding: '40px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid var(--border-cream)',
        padding: '48px 32px',
        textAlign: 'center',
        boxShadow: 'var(--shadow-warm-lg)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          backgroundColor: 'var(--forest-green-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <Icon size={40} color="var(--forest-green)" />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '28px',
          fontWeight: 600,
          color: 'var(--ink)',
          marginBottom: '12px'
        }}>
          {config.title}
        </h1>

        <p style={{
          fontSize: '16px',
          color: 'var(--ink-secondary)',
          lineHeight: 1.6,
          marginBottom: '32px'
        }}>
          {config.description}
        </p>

        <div style={{
          padding: '16px',
          backgroundColor: 'var(--bg-cream-subtle)',
          borderRadius: '12px',
          border: '1px solid var(--border-cream)',
          marginBottom: '32px'
        }}>
          <p style={{
            fontSize: '14px',
            color: 'var(--ink-muted)',
            margin: 0
          }}>
            🚧 This feature is currently under development. Check back soon for updates!
          </p>
        </div>

        <button
          onClick={onBack}
          style={{
            padding: '12px 32px',
            backgroundColor: 'var(--forest-green)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: 'var(--shadow-warm-sm)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-warm-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-warm-sm)';
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
