import React, { useState } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Badge } from '../ui';

const STATUS_CONFIG = {
  unknown: { label: 'Unknown', variant: 'review' },
  placed: { label: 'Placed', variant: 'placed' },
  dispatched: { label: 'Dispatched', variant: 'placed' },
  needs_ok: { label: 'Pending', variant: 'review' },
  failed: { label: 'Cancelled', variant: 'failed' },
  review: { label: 'In Review', variant: 'review' }
};

const GOVERNANCE_CONFIG = {
  approved: { label: 'Approved', variant: 'placed' },
  pending: { label: 'Pending', variant: 'review' },
  blocked: { label: 'Blocked', variant: 'failed' }
};

export default function TransactionsTable({ orders = [], isAvailable = true, onViewOrder }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [governanceFilter, setGovernanceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.item?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.merchant?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesGovernance = governanceFilter === 'all' || 
      (order.status === 'placed' && governanceFilter === 'approved') ||
      (order.status === 'needs_ok' && governanceFilter === 'pending') ||
      (order.status === 'failed' && governanceFilter === 'blocked');
    
    return matchesSearch && matchesStatus && matchesGovernance;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (timestamp) => {
    return timestamp || 'Time unavailable';
  };

  return (
    <div style={{
      minWidth: 0,
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--border-cream)',
      borderRadius: '16px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border-cream-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
            Recent Transactions
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
            {isAvailable ? `${filteredOrders.length} orders found` : 'Order data unavailable'}
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={14} color="var(--ink-muted)" style={{ position: 'absolute', left: '10px' }} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px 8px 32px',
                border: '1px solid var(--border-cream)',
                borderRadius: '8px',
                fontSize: '12px',
                width: '160px',
                backgroundColor: 'var(--bg-cream-subtle)'
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--border-cream)',
              borderRadius: '8px',
              fontSize: '12px',
              backgroundColor: 'var(--bg-cream-subtle)',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Status</option>
            <option value="placed">Placed</option>
            <option value="dispatched">Dispatched</option>
            <option value="needs_ok">Pending</option>
            <option value="failed">Cancelled</option>
          </select>

          {/* Governance Filter */}
          <select
            value={governanceFilter}
            onChange={(e) => setGovernanceFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--border-cream)',
              borderRadius: '8px',
              fontSize: '12px',
              backgroundColor: 'var(--bg-cream-subtle)',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Governance</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px'
        }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--border-cream)',
              backgroundColor: 'var(--bg-cream-subtle)'
            }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Order ID
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Product
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Date
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Amount
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Status
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Governance
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => {
                const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.unknown;
                const governanceStatus = ['placed', 'dispatched'].includes(order.status) ? 'approved' :
                  order.status === 'needs_ok' ? 'pending' : 'blocked';
                const governanceConfig = GOVERNANCE_CONFIG[governanceStatus];

                return (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: '1px solid var(--border-cream-subtle)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-cream-subtle)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--ink-muted)' }}>
                      {order.id}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>
                        {order.item}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                        {order.merchant || 'Merchant unavailable'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--ink-secondary)', fontSize: '12px' }}>
                      {formatDate(order.timestamp)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--ink)' }}>
                      {order.price == null ? '—' : `₹${Number(order.price).toLocaleString('en-IN')}`}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <Badge variant={statusConfig.variant} size="sm">
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <Badge variant={governanceConfig.variant} size="sm">
                        {governanceConfig.label}
                      </Badge>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => onViewOrder && onViewOrder(order)}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border-cream)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'var(--forest-green)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Eye size={12} />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{
                  padding: '40px 16px',
                  textAlign: 'center',
                  color: 'var(--ink-muted)',
                  fontSize: '14px'
                }}>
                  {isAvailable
                    ? 'No orders found matching your filters.'
                    : 'Order data is unavailable from the backend.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-cream-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '6px 10px',
                border: '1px solid var(--border-cream)',
                borderRadius: '6px',
                backgroundColor: currentPage === 1 ? 'var(--bg-cream-subtle)' : '#FFFFFF',
                color: currentPage === 1 ? 'var(--ink-muted)' : 'var(--ink)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 500
              }}
            >
              <ChevronLeft size={14} />
              Previous
            </button>
            <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 10px',
                border: '1px solid var(--border-cream)',
                borderRadius: '6px',
                backgroundColor: currentPage === totalPages ? 'var(--bg-cream-subtle)' : '#FFFFFF',
                color: currentPage === totalPages ? 'var(--ink-muted)' : 'var(--ink)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 500
              }}
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
