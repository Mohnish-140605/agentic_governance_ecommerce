import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  Megaphone,
  Bot,
  ShieldCheck,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import CairnLogo from '../CairnLogo';

const MERCHANT_NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, group: 'main' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, group: 'main', badge: 3 },
  { id: 'products', label: 'Products', icon: Package, group: 'main' },
  { id: 'inventory', label: 'Inventory', icon: Package, group: 'main' },
  { id: 'customers', label: 'Customers', icon: Users, group: 'main' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'main' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, group: 'main' },
  { id: 'merchant_agent', label: 'Merchant Agent', icon: Bot, group: 'tools' },
  { id: 'governance', label: 'Governance & Trust', icon: ShieldCheck, group: 'tools' },
  { id: 'sla', label: 'SLA Management', icon: Clock, group: 'tools' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'system' }
];

export default function MerchantSidebar({
  activeScreen,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
  merchantName = 'Studio Hasami',
  merchantAvatar = null
}) {
  const groups = {
    main: MERCHANT_NAV_ITEMS.filter(item => item.group === 'main'),
    tools: MERCHANT_NAV_ITEMS.filter(item => item.group === 'tools'),
    system: MERCHANT_NAV_ITEMS.filter(item => item.group === 'system')
  };

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const isActive = activeScreen === item.id ||
      (item.id === 'overview' && activeScreen === 'seller_hub') ||
      (item.id === 'products' && activeScreen === 'seller_hub') ||
      (item.id === 'orders' && activeScreen === 'seller_orders');

    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: collapsed ? '0' : '12px',
          padding: collapsed ? '12px' : '10px 14px',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: isActive ? 'var(--forest-green-light)' : 'transparent',
          color: isActive ? 'var(--forest-green)' : 'var(--ink-secondary)',
          fontSize: '14px',
          fontWeight: isActive ? 600 : 500,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          justifyContent: collapsed ? 'center' : 'flex-start',
          position: 'relative'
        }}
        title={collapsed ? item.label : ''}
      >
        <Icon size={18} style={{ flexShrink: 0 }} />
        {!collapsed && (
          <>
            <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
            {item.badge && (
              <span style={{
                backgroundColor: 'var(--coral)',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '9999px',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                {item.badge}
              </span>
            )}
          </>
        )}
        {collapsed && item.badge && (
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            backgroundColor: 'var(--coral)',
            color: '#FFFFFF',
            fontSize: '9px',
            fontWeight: 700,
            padding: '1px 4px',
            borderRadius: '9999px',
            minWidth: '14px',
            textAlign: 'center'
          }}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="merchant-sidebar" style={{
      width: collapsed ? '72px' : '260px',
      height: '100vh',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid var(--border-cream)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
      transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      overflow: 'hidden'
    }}>
      {/* Logo & Merchant Identity */}
      <div style={{
        padding: collapsed ? '20px 12px' : '20px 20px',
        borderBottom: '1px solid var(--border-cream-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? '0' : '12px',
        justifyContent: collapsed ? 'center' : 'flex-start'
      }}>
        <CairnLogo size={collapsed ? 32 : 36} />
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--ink)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {merchantName}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'var(--ink-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Merchant Studio
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        overflowY: 'auto',
        padding: collapsed ? '12px 8px' : '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {/* Main Group */}
        <div style={{ marginBottom: collapsed ? '8px' : '16px' }}>
          {!collapsed && (
            <div style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--ink-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 14px',
              marginBottom: '8px'
            }}>
              Main
            </div>
          )}
          {groups.main.map(renderNavItem)}
        </div>

        {/* Tools Group */}
        <div style={{ marginBottom: collapsed ? '8px' : '16px' }}>
          {!collapsed && (
            <div style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--ink-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 14px',
              marginBottom: '8px'
            }}>
              Tools
            </div>
          )}
          {groups.tools.map(renderNavItem)}
        </div>

        {/* System Group */}
        <div>
          {!collapsed && (
            <div style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--ink-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 14px',
              marginBottom: '8px'
            }}>
              System
            </div>
          )}
          {groups.system.map(renderNavItem)}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid var(--border-cream-subtle)',
        display: 'flex',
        justifyContent: collapsed ? 'center' : 'flex-end'
      }}>
        <button
          onClick={onToggleCollapse}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid var(--border-cream)',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--ink-secondary)',
            transition: 'all 0.15s ease'
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
