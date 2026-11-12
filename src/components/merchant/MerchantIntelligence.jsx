import React from 'react';
import {
  Package,
  TrendingUp,
  Users,
  AlertCircle,
  ArrowRight,
  Bot
} from 'lucide-react';

const INSIGHT_CATEGORIES = [
  {
    id: 'listing_quality',
    title: 'Listing Quality',
    icon: Package,
    iconBg: 'var(--forest-green-light)',
    iconColor: 'var(--forest-green)',
    insights: [
      {
        title: '3 products need better descriptions',
        description: 'Improve product details to increase conversion by ~15%',
        action: 'View insights'
      },
      {
        title: '2 listings missing images',
        description: 'Add high-quality images for better visibility',
        action: 'Review recommendations'
      }
    ]
  },
  {
    id: 'sales_inventory',
    title: 'Sales & Inventory',
    icon: TrendingUp,
    iconBg: 'var(--butter-yellow-light)',
    iconColor: 'var(--butter-yellow-dark)',
    insights: [
      {
        title: 'Kinto Coffee Brewer trending up',
        description: 'Sales increased 23% this week. Consider restocking.',
        action: 'View insights'
      },
      {
        title: 'Low stock alert: Walnut Shelf',
        description: 'Only 8 units remaining. Restock recommended.',
        action: 'Review recommendations'
      }
    ]
  },
  {
    id: 'customer_ops',
    title: 'Customer & Operations',
    icon: Users,
    iconBg: 'var(--coral-light)',
    iconColor: 'var(--coral)',
    insights: [
      {
        title: '2 orders pending acknowledgement',
        description: 'Respond within 2 hours to maintain SLA compliance',
        action: 'View insights'
      },
      {
        title: 'Return rate below average',
        description: 'Your return rate is 2.1% vs industry 4.5%',
        action: 'Review recommendations'
      }
    ]
  }
];

export default function MerchantIntelligence({ insights = null, onViewInsights }) {
  const categories = insights || INSIGHT_CATEGORIES;

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <Bot size={18} color="var(--forest-green)" />
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--forest-green)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              AI-Powered
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--ink)',
            marginBottom: '4px'
          }}>
            Merchant Intelligence
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-secondary)' }}>
            Insights and recommendations from your Merchant Agent
          </p>
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: '20px'
      }}>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-cream)',
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Category Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: category.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} color={category.iconColor} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    marginBottom: '2px'
                  }}>
                    {category.title}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--ink-muted)'
                  }}>
                    {category.insights.length} insights
                  </p>
                </div>
              </div>

              {/* Insights List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {category.insights.map((insight, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px',
                      backgroundColor: 'var(--bg-cream-subtle)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-cream-subtle)'
                    }}
                  >
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--ink)',
                      marginBottom: '4px'
                    }}>
                      {insight.title}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--ink-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '10px'
                    }}>
                      {insight.description}
                    </div>
                    <button
                      onClick={() => onViewInsights && onViewInsights(category.id, insight)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 10px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--forest-green)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {insight.action}
                      <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
