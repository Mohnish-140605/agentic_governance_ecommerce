import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import KPICards from '../components/merchant/KPICards';
import TransactionsTable from '../components/merchant/TransactionsTable';
import TopProducts from '../components/merchant/TopProducts';
import GovernanceOverview from '../components/merchant/GovernanceOverview';
import SLAOverview from '../components/merchant/SLAOverview';
import VendorOrderInbox from '../components/merchant/VendorOrderInbox';
import {
  fetchAuditLogs,
  fetchGovernanceSummary,
  fetchListings,
  fetchOrders,
  fetchSLAMetrics
} from '../services/api';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Time unavailable';
  const numericTimestamp = Number(timestamp);
  const date = new Date(Number.isNaN(numericTimestamp) ? timestamp : numericTimestamp * 1000);
  return Number.isNaN(date.getTime()) ? 'Time unavailable' : date.toLocaleString();
};

const fetchDashboardData = async () => {
  const [orders, listings, sla, governance, auditLogs] = await Promise.all([
    fetchOrders(),
    fetchListings(),
    fetchSLAMetrics(),
    fetchGovernanceSummary(),
    fetchAuditLogs(5)
  ]);
  return { orders, listings, sla, governance, auditLogs };
};

const mapGovernanceDecisions = (logs = []) => logs.map((log) => ({
  id: log.id,
  action: (log.action_type || 'Agent action').replace(/_/g, ' ').toLowerCase(),
  status: log.decision === 'AUTO_EXECUTE'
    ? 'approved'
    : log.decision === 'HUMAN_APPROVAL'
      ? 'pending'
      : 'blocked',
  timestamp: formatTimestamp(log.timestamp),
  details: log.reason_code || log.explainability || 'Decision recorded in the governance audit.'
}));

const getGovernanceStats = (summary) => {
  if (!summary) return [];
  return [
    {
      id: 'evaluated',
      label: 'Proposals evaluated',
      value: summary.total_proposals_evaluated ?? 0
    },
    {
      id: 'approved',
      label: 'Auto-executed',
      value: summary.auto_executed_actions ?? 0
    },
    {
      id: 'pending',
      label: 'Human approval',
      value: summary.actions_requiring_approval ?? 0
    },
    {
      id: 'blocked',
      label: 'Blocked',
      value: summary.blocked_actions ?? 0
    }
  ];
};

export default function Screen7_SellerHub({
  listingsRefreshVersion,
  onOpenAddListing,
  onShowToast,
  currentUser,
  onVendorChange
}) {
  const [backendData, setBackendData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(null);

  const loadBackendData = async ({ manual = false } = {}) => {
    if (manual) {
      setIsRefreshing(true);
      setRefreshError(null);
    }
    try {
      setBackendData(await fetchDashboardData());
    } catch (error) {
      console.error('[Merchant dashboard] Failed to load backend data:', error);
      setRefreshError('Unable to refresh dashboard data. Try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetchDashboardData().then((data) => {
      if (active) setBackendData(data);
    }).catch((error) => {
      console.error('[Merchant dashboard] Failed to load backend data:', error);
      if (active) setRefreshError('Unable to load dashboard data.');
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, [listingsRefreshVersion]);

  const displayOrders = useMemo(() => {
    const source = Array.isArray(backendData?.orders) ? backendData.orders : [];
    return source.map((order) => ({
      ...order,
      id: String(order.id || 'Unknown order'),
      item: order.item || order.product_name || 'Unnamed product',
      status: order.status || 'unknown',
      price: order.price == null ? null : Number(order.price),
      timestamp: order.timestamp || formatTimestamp(order.created_at)
    }));
  }, [backendData]);

  const displayListings = useMemo(
    () => Array.isArray(backendData?.listings) ? backendData.listings : [],
    [backendData]
  );

  const kpiMetrics = useMemo(() => {
    return {
      activeProducts: Array.isArray(backendData?.listings)
        ? displayListings.filter((listing) => !/inactive|blocked/i.test(listing.status || '')).length
        : null,
      recordedOrders: Array.isArray(backendData?.orders) ? displayOrders.length : null,
      cancelledOrders: Array.isArray(backendData?.orders)
        ? displayOrders.filter((order) => ['failed', 'cancelled'].includes(order.status)).length
        : null,
      recordedOrderValue: Array.isArray(backendData?.orders)
        ? displayOrders
          .filter((order) => ['placed', 'dispatched'].includes(order.status))
          .reduce((total, order) => total + (Number.isFinite(order.price) ? order.price : 0), 0)
        : null
    };
  }, [backendData, displayListings, displayOrders]);

  const connected = Array.isArray(backendData?.orders)
    && Array.isArray(backendData?.listings)
    && Boolean(backendData?.sla)
    && Boolean(backendData?.governance)
    && Array.isArray(backendData?.auditLogs);
  const hasUnavailableData = !Array.isArray(backendData?.orders)
    || !Array.isArray(backendData?.listings)
    || !Array.isArray(backendData?.auditLogs);
  const governanceStats = getGovernanceStats(backendData?.governance);
  const governanceDecisions = mapGovernanceDecisions(
    Array.isArray(backendData?.auditLogs) ? backendData.auditLogs : []
  );
  const products = displayListings.slice(0, 5).map((listing) => ({
    ...listing,
    sku: listing.id,
    stock: Number(listing.stock) || 0,
    price: Number(listing.price) || 0
  }));
  const merchantName = currentUser?.name?.split(' ')[0] || 'Merchant';

  return (
    <div style={{ minHeight: '100%', backgroundColor: 'var(--bg-cream)' }}>
      <main className="merchant-content" style={{ maxWidth: '1480px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--forest-green)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}>
              Merchant control center
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 32px)', marginBottom: '6px' }}>
              Welcome, {merchantName}
            </h1>
            <p style={{ maxWidth: '780px', fontSize: '14px' }}>
              Merchant actions are proposed, checked by the shared deterministic Governance Engine, and audited before execution.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 12px',
              border: '1px solid',
              borderColor: connected ? 'var(--forest-green-border)' : 'var(--status-review-border)',
              borderRadius: '9999px',
              backgroundColor: connected ? 'var(--forest-green-light)' : 'var(--status-review-bg)',
              color: connected ? 'var(--forest-green)' : 'var(--status-review-text)',
              fontSize: '12px',
              fontWeight: 650
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: connected ? '#15803D' : '#B45309' }} />
              {isLoading ? 'Loading backend data' : connected ? 'Backend connected' : 'Backend data unavailable'}
            </span>
            <button
              type="button"
              onClick={() => loadBackendData({ manual: true })}
              disabled={isRefreshing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 12px',
                border: '1px solid var(--border-cream)',
                borderRadius: '9999px',
                background: '#fff',
                color: 'var(--ink-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: isRefreshing ? 'wait' : 'pointer'
              }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh data
            </button>
          </div>
        </div>

        {hasUnavailableData && !isLoading && (
          <div role="status" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px',
            padding: '11px 14px',
            border: '1px solid var(--status-review-border)',
            borderRadius: '12px',
            background: 'var(--status-review-bg)',
            color: 'var(--status-review-text)',
            fontSize: '13px'
          }}>
            <AlertCircle size={16} />
            Some backend order, listing, or audit data is unavailable. No sample records are being shown.
          </div>
        )}
        {refreshError && (
          <div role="alert" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px',
            padding: '11px 14px',
            border: '1px solid #FECACA',
            borderRadius: '12px',
            background: '#FEF2F2',
            color: '#B91C1C',
            fontSize: '13px'
          }}>
            <AlertCircle size={16} />
            {refreshError}
          </div>
        )}
        <VendorOrderInbox
          key={`${currentUser?.id || 'demo'}:${currentUser?.vendor_id || ''}`}
          onShowToast={onShowToast}
          currentUser={currentUser}
          onVendorChange={onVendorChange}
        />

        <KPICards
          metrics={kpiMetrics}
          ordersUnavailable={!Array.isArray(backendData?.orders)}
          listingsUnavailable={!Array.isArray(backendData?.listings)}
        />

        <div className="dashboard-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <TopProducts
            products={products}
            isAvailable={Array.isArray(backendData?.listings)}
            onViewAll={onOpenAddListing}
          />
          <TransactionsTable
            orders={displayOrders}
            isAvailable={Array.isArray(backendData?.orders)}
            onViewOrder={(order) => onShowToast?.(`Viewing order ${order.id}`)}
          />
        </div>

        <div className="dashboard-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: '20px'
        }}>
          <GovernanceOverview stats={governanceStats} decisions={governanceDecisions} />
          <SLAOverview metrics={backendData?.sla || null} isLoading={isLoading} />
        </div>

        {!backendData?.governance && !isLoading && (
          <div role="status" style={{ marginTop: '14px', color: 'var(--ink-muted)', fontSize: '12px' }}>
            Governance and SLA summaries are unavailable until the FastAPI backend responds.
          </div>
        )}
      </main>
    </div>
  );
}
