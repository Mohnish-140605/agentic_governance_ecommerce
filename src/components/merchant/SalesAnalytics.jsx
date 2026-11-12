import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  ChevronDown
} from 'lucide-react';

// Simple SVG line chart component
function SalesChart({ data, height = 200 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--ink-muted)',
        fontSize: '14px'
      }}>
        No sales data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const width = 600;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight,
    ...d
  }));

  const pathData = points.map((p, i) => 
    i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
  ).join(' ');

  const areaPath = `${pathData} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: '100%' }}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * ratio;
          const value = maxValue - (range * ratio);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="var(--border-cream)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="var(--ink-muted)"
              >
                {value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#gradient)"
          opacity="0.3"
        />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="var(--forest-green)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? 6 : 4}
              fill="#FFFFFF"
              stroke="var(--forest-green)"
              strokeWidth="2"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {hoveredIndex === i && (
              <g>
                <rect
                  x={p.x - 40}
                  y={p.y - 35}
                  width="80"
                  height="24"
                  rx="6"
                  fill="var(--ink)"
                />
                <text
                  x={p.x}
                  y={p.y - 19}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#FFFFFF"
                  fontWeight="600"
                >
                  ₹{p.value.toLocaleString('en-IN')}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* X-axis labels */}
        {points.filter((_, i) => i % Math.ceil(points.length / 6) === 0).map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 8}
            textAnchor="middle"
            fontSize="10"
            fill="var(--ink-muted)"
          >
            {p.label}
          </text>
        ))}

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--forest-green)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--forest-green)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function SalesAnalytics({ salesData = null }) {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [showDateMenu, setShowDateMenu] = useState(false);

  const dateOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This year'];

  // Demo data if no real data provided
  const demoData = [
    { label: 'Week 1', value: 125000 },
    { label: 'Week 2', value: 148000 },
    { label: 'Week 3', value: 132000 },
    { label: 'Week 4', value: 167000 },
    { label: 'Week 5', value: 189000 },
    { label: 'Week 6', value: 156000 },
    { label: 'Week 7', value: 178000 },
    { label: 'Week 8', value: 195000 }
  ];

  const data = salesData || demoData;
  const totalSales = data.reduce((sum, d) => sum + d.value, 0);
  const avgSales = totalSales / data.length;
  const maxSales = Math.max(...data.map(d => d.value));

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--border-cream)',
      borderRadius: '16px',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--ink)',
            marginBottom: '4px'
          }}>
            Sales Analytics
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
            Revenue performance over time
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDateMenu(!showDateMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              backgroundColor: 'var(--bg-cream-subtle)',
              border: '1px solid var(--border-cream)',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--ink)',
              cursor: 'pointer'
            }}
          >
            <Calendar size={14} />
            <span>{dateRange}</span>
            <ChevronDown size={12} />
          </button>

          {showDateMenu && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-cream)',
              borderRadius: '10px',
              boxShadow: 'var(--shadow-warm-md)',
              padding: '6px',
              minWidth: '140px',
              zIndex: 50
            }}>
              {dateOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setDateRange(option);
                    setShowDateMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: 'none',
                    backgroundColor: dateRange === option ? 'var(--forest-green-light)' : 'transparent',
                    color: dateRange === option ? 'var(--forest-green)' : 'var(--ink)',
                    fontSize: '12px',
                    fontWeight: dateRange === option ? 600 : 500,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '16px',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-cream-subtle)'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '4px' }}>
            Total Sales
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '4px' }}>
            Average
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>
            ₹{avgSales.toLocaleString('en-IN')}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '4px' }}>
            Peak
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>
            ₹{maxSales.toLocaleString('en-IN')}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '4px' }}>
            Growth
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '20px',
            fontWeight: 700,
            color: '#166534'
          }}>
            <TrendingUp size={18} />
            +12.5%
          </div>
        </div>
      </div>

      {/* Chart */}
      <SalesChart data={data} height={220} />
    </div>
  );
}
