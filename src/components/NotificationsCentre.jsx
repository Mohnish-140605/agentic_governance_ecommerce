import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Bell, CheckCheck, Package, ShieldAlert, Tag, Truck, Volume2, VolumeX, XCircle } from 'lucide-react';
import {
  fetchNotifications,
  markNotificationRead,
  resolvePriceProposal,
  subscribeEvents
} from '../services/api';

const EVENT_ICON = {
  ORDER_CREATED: Package,
  NEW_ORDER_REQUEST: Package,
  VENDOR_ACKNOWLEDGED: CheckCheck,
  VENDOR_ACCEPTED: CheckCheck,
  VENDOR_REJECTED: XCircle,
  VENDOR_REASSIGNED: Package,
  ORDER_PREPARING: Package,
  ORDER_DISPATCHED: Truck,
  ORDER_DELIVERED: CheckCheck,
  PRICE_CHANGE_PROPOSED: Tag,
  PRICE_APPROVED: CheckCheck,
  PRICE_REJECTED: XCircle,
  SLA_BREACHED: ShieldAlert,
  NO_VENDOR_AVAILABLE: ShieldAlert,
};

async function playNotificationTone() {
  if (!window.AudioContext) {
    throw new Error('Audio notifications are not supported by this browser.');
  }
  const context = new window.AudioContext();
  try {
    await context.resume();
  } catch (error) {
    await context.close();
    throw error;
  }
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, context.currentTime);
  oscillator.frequency.setValueAtTime(1174.66, context.currentTime + 0.11);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.28);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.onended = () => context.close();
  oscillator.start();
  oscillator.stop(context.currentTime + 0.3);
}

/**
 * NotificationsCentre — in-app notification feed with SSE live updates
 * (Priority 6/12 frontend). Polls on mount, subscribes to SSE for
 * real-time pushes, marks items read.
 */
export default function NotificationsCentre({
  recipientType = 'user',
  recipientId = 'usr_priya',
  onOrderEvent,
  onNavigateToScreen
}) {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [liveConnected, setLiveConnected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem(`cairn_notification_sound_${recipientType}_${recipientId}`) === 'true';
    } catch {
      return false;
    }
  });
  const [soundError, setSoundError] = useState('');
  const [busyProposalId, setBusyProposalId] = useState(null);
  const [resolvedProposalIds, setResolvedProposalIds] = useState([]);
  const itemsRef = useRef([]);
  const soundEnabledRef = useRef(soundEnabled);
  const initializedRef = useRef(false);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const load = useCallback(async ({ notifyNew = false } = {}) => {
    setLoading(true);
    setLoadError('');
    try {
      const list = await fetchNotifications(recipientType, recipientId);
      const previousIds = new Set(itemsRef.current.map((item) => item.id));
      const hasNewUnread = list.some((item) => !item.read_at && !previousIds.has(item.id));
      if (notifyNew && initializedRef.current && hasNewUnread && soundEnabledRef.current) {
        try {
          await playNotificationTone();
          setSoundError('');
        } catch (error) {
          setSoundError(error.message || 'Could not play notification sound.');
        }
      }
      itemsRef.current = list;
      setItems(list);
      setUnread(list.filter((n) => !n.read_at).length);
      initializedRef.current = true;
    } catch (error) {
      console.error('[Notifications] Failed to load notifications:', error);
      setLoadError('Notifications are temporarily unavailable. Retrying…');
    } finally {
      setLoading(false);
    }
  }, [recipientType, recipientId]);

  useEffect(() => { load(); }, [load]);

  // SSE live updates
  useEffect(() => {
    const scope = `${recipientType}:${recipientId}`;
    const es = subscribeEvents(scope, (event) => {
      if (['ORDER_CREATED', 'VENDOR_ALLOCATED', 'NEW_ORDER_REQUEST',
           'VENDOR_ACKNOWLEDGED', 'VENDOR_ACCEPTED', 'VENDOR_REJECTED',
           'ORDER_PREPARING', 'ORDER_DISPATCHED', 'ORDER_DELIVERED', 'PRICE_CHANGE_PROPOSED',
           'PRICE_APPROVED', 'PRICE_REJECTED', 'BUYER_APPROVED', 'BUYER_REJECTED',
           'SLA_BREACHED', 'VENDOR_REASSIGNED', 'NO_VENDOR_AVAILABLE'].includes(event.type)) {
        load({ notifyNew: true });
        onOrderEvent?.(event);
      }
    });
    es.onopen = () => setLiveConnected(true);
    es.onerror = () => setLiveConnected(false);
    const refreshTimer = window.setInterval(() => load({ notifyNew: true }), 30000);
    return () => {
      es.close();
      window.clearInterval(refreshTimer);
    };
  }, [recipientType, recipientId, load, onOrderEvent]);

  const markRead = async (id) => {
    setActionError('');
    const result = await markNotificationRead(id, recipientId);
    if (result?.status !== 'READ') throw new Error('Notification could not be marked as read.');
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read_at: Date.now() / 1000 } : n));
    itemsRef.current = itemsRef.current.map((n) => n.id === id ? { ...n, read_at: Date.now() / 1000 } : n);
    setUnread((u) => Math.max(0, u - 1));
  };

  const markAllRead = async () => {
    setActionError('');
    try {
      for (const n of items.filter((i) => !i.read_at)) {
        const result = await markNotificationRead(n.id, recipientId);
        if (result?.status !== 'READ') throw new Error(`Could not mark notification ${n.id} as read.`);
      }
      const readItems = items.map((n) => ({ ...n, read_at: n.read_at || Date.now() / 1000 }));
      itemsRef.current = readItems;
      setItems(readItems);
      setUnread(0);
    } catch (error) {
      console.error('[Notifications] Failed to mark all as read:', error);
      setActionError(error.message || 'Could not mark notifications as read.');
    }
  };

  const toggleSound = async () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEnabledRef.current = next;
    setSoundError('');
    try {
      localStorage.setItem(`cairn_notification_sound_${recipientType}_${recipientId}`, String(next));
    } catch (error) {
      setSoundError(`Could not save sound preference: ${error.message}`);
    }
    if (next) {
      try {
        await playNotificationTone();
      } catch (error) {
        setSoundError(error.message || 'Could not play notification sound.');
      }
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read_at) await markRead(notification.id);
    } catch (error) {
      console.error('[Notifications] Failed to mark notification as read:', error);
      setActionError(error.message || 'Could not mark notification as read.');
    }
    const hasInlinePriceAction = recipientType === 'user'
      && notification.event_type === 'PRICE_CHANGE_PROPOSED'
      && notification.payload?.proposal_id;
    if (!hasInlinePriceAction) {
      setOpen(false);
      onNavigateToScreen?.(recipientType === 'vendor' ? 'seller_hub' : 'orders');
    }
  };

  const handlePriceProposal = async (notification, approve) => {
    const proposalId = notification.payload?.proposal_id;
    if (!proposalId) return;
    setBusyProposalId(proposalId);
    setActionError('');
    try {
      const result = await resolvePriceProposal(proposalId, recipientId, approve);
      const expectedStatus = approve ? 'APPROVED' : 'REJECTED';
      if (result?.status !== expectedStatus) {
        throw new Error(result?.message || 'The buyer decision was not confirmed.');
      }
      setResolvedProposalIds((prev) => [...prev, proposalId]);
      onOrderEvent?.({ type: approve ? 'BUYER_APPROVED' : 'BUYER_REJECTED', payload: notification.payload });
      await load();
      if (!notification.read_at) {
        try {
          await markRead(notification.id);
        } catch {
          setActionError('Your price decision was saved, but this notification could not be marked as read.');
        }
      }
    } catch (error) {
      setActionError(error.message || 'Could not resolve the vendor price proposal.');
    } finally {
      setBusyProposalId(null);
    }
  };

  const timeAgo = (ts) => {
    if (!ts) return '';
    const diff = Date.now() / 1000 - ts;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        aria-expanded={open}
        aria-controls={`notifications-panel-${recipientType}`}
        style={{
          position: 'relative', background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px', borderRadius: '10px', color: 'var(--ink)'
        }}
      >
        <Bell size={20} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            background: '#DC2626', color: '#fff', fontSize: '9px', fontWeight: 800,
            minWidth: '16px', height: '16px', borderRadius: '9999px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px'
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div id={`notifications-panel-${recipientType}`} style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 50,
          width: '360px', maxWidth: '90vw', maxHeight: '420px', overflowY: 'auto',
          background: '#fff', border: '1px solid var(--border-cream)',
          borderRadius: '14px', boxShadow: '0 12px 40px rgba(0,0,0,0.12)'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderBottom: '1px solid var(--border-cream-subtle)',
            position: 'sticky', top: 0, background: '#fff', zIndex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>Notifications</span>
              <span style={{ fontSize: '10px', color: liveConnected ? '#166534' : 'var(--ink-muted)' }}>
                {liveConnected ? 'Live' : 'Reconnecting'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button type="button" onClick={toggleSound} aria-pressed={soundEnabled}
                aria-label={soundEnabled ? 'Disable notification sound' : 'Enable notification sound'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 8px', border: '1px solid var(--border-cream)', borderRadius: '8px', background: '#fff', color: 'var(--ink-secondary)', cursor: 'pointer', fontSize: '11px' }}>
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                Sound {soundEnabled ? 'on' : 'off'}
              </button>
              {unread > 0 && (
              <button onClick={markAllRead} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '11.5px', fontWeight: 700, color: 'var(--forest-green)',
                display: 'inline-flex', alignItems: 'center', gap: '4px'
              }}>
                <CheckCheck size={13} /> Mark all read
              </button>
              )}
            </div>
          </div>

          {soundError && <div role="status" style={{ padding: '8px 16px', color: '#B91C1C', fontSize: '11px' }}>{soundError}</div>}
          {loadError && <div role="alert" style={{ padding: '12px 16px', color: '#B91C1C', fontSize: '12px' }}>{loadError}</div>}
          {actionError && <div role="alert" style={{ padding: '8px 16px', color: '#B91C1C', fontSize: '11px' }}>{actionError}</div>}

          {loading && <div style={{ padding: '20px', textAlign: 'center', fontSize: '12.5px', color: 'var(--ink-muted)' }}>Loading…</div>}
          {!loading && !loadError && items.length === 0 && (
            <div style={{ padding: '30px 16px', textAlign: 'center', fontSize: '12.5px', color: 'var(--ink-muted)' }}>
              No notifications yet. Order updates will appear here in real time.
            </div>
          )}

          {items.map((n) => {
            const Icon = EVENT_ICON[n.event_type] || Bell;
            const isUnread = !n.read_at;
            return (
              <div key={n.id} style={{ borderBottom: '1px solid var(--border-cream-subtle)' }}>
                <button
                  type="button"
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    display: 'flex', gap: '10px', width: '100%', textAlign: 'left',
                    padding: '12px 16px', border: 'none', cursor: 'pointer',
                    background: isUnread ? 'var(--forest-green-light)' : 'transparent'
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                    background: isUnread ? '#fff' : 'var(--bg-cream-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--forest-green)'
                  }}>
                    <Icon size={15} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: isUnread ? 700 : 600, color: 'var(--ink)' }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--ink-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                      {n.body}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--ink-muted)', marginTop: '4px' }}>
                      {timeAgo(n.created_at)}
                    </div>
                  </div>
                  {isUnread && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '9999px', background: 'var(--forest-green)', flexShrink: 0, marginTop: '6px' }} />
                  )}
                </button>
                {recipientType === 'user' && n.event_type === 'PRICE_CHANGE_PROPOSED'
                  && n.payload?.proposal_id && !resolvedProposalIds.includes(n.payload.proposal_id) && (
                    <div style={{ display: 'flex', gap: '8px', padding: '0 16px 12px 58px' }}>
                      <button type="button" disabled={Boolean(busyProposalId)}
                        onClick={() => handlePriceProposal(n, true)}
                        style={btnStyle('#166534', '#DCFCE7')}>
                        Approve price
                      </button>
                      <button type="button" disabled={Boolean(busyProposalId)}
                        onClick={() => handlePriceProposal(n, false)}
                        style={btnStyle('#B91C1C', '#FEE2E2')}>
                        Reject price
                      </button>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function btnStyle(color, background) {
  return {
    border: `1px solid ${color}`,
    borderRadius: '9999px',
    padding: '6px 10px',
    color,
    background,
    fontSize: '11px',
    fontWeight: 700,
    cursor: 'pointer'
  };
}
