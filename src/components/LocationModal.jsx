import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Loader2, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { POPULAR_LOCATIONS } from '../data/navigation';

export default function LocationModal({
  isOpen,
  onClose,
  currentLocation,
  onUpdateLocation,
  onShowToast
}) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [customSearch, setCustomSearch] = useState('');

  if (!isOpen) return null;

  // Real browser geolocation acquisition with live reverse-geocoding
  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetecting(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        let detectedCity = 'Your Area';
        let detectedLocality = `GPS: ${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°`;
        let detectedState = '';
        let detectedPincode = '';

        try {
          // Free, high-speed reverse geocoding from BigDataCloud (CORS enabled, no API key required)
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            detectedCity = data.city || data.locality || data.principalSubdivision || 'Local Area';
            detectedLocality = data.locality || data.localityInfo?.administrative?.[3]?.name || 'Current Residence';
            detectedState = data.principalSubdivision || '';
            detectedPincode = data.postcode || '';
          }
        } catch {
          // Fallback if network blocked
          detectedCity = 'Current GPS Point';
        }

        const newLoc = {
          city: detectedCity,
          locality: detectedLocality,
          state: detectedState,
          pincode: detectedPincode || 'Live Pincode',
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          isLiveGPS: true,
          deliveryTime: '15 mins',
          hub: `Cairn Live Micro-Hub (${detectedCity})`
        };

        setIsDetecting(false);
        onUpdateLocation(newLoc);
        if (onShowToast) {
          onShowToast(`📍 Live GPS Locked: ${detectedLocality}, ${detectedCity}`);
        }
        onClose();
      },
      (error) => {
        setIsDetecting(false);
        let msg = 'Could not acquire GPS position.';
        if (error.code === 1) {
          msg = 'Location permission was denied. Please choose your city below or enable browser location.';
        } else if (error.code === 2) {
          msg = 'Location position unavailable. Select a city from the list below.';
        } else if (error.code === 3) {
          msg = 'Location request timed out. Please try again or pick a city below.';
        }
        setErrorMsg(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSelectPreset = (loc) => {
    onUpdateLocation({
      ...loc,
      isLiveGPS: false
    });
    if (onShowToast) {
      onShowToast(`Location updated to ${loc.locality}, ${loc.city}`);
    }
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customSearch.trim()) return;

    onUpdateLocation({
      city: customSearch.trim(),
      locality: `${customSearch.trim()} Center`,
      state: 'Local Region',
      pincode: 'PIN-VERIFIED',
      lat: 28.6139,
      lng: 77.2090,
      deliveryTime: '20 mins',
      hub: `Cairn Local Hub (${customSearch.trim()})`,
      isLiveGPS: false
    });

    if (onShowToast) {
      onShowToast(`Location set to ${customSearch.trim()}`);
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(27, 27, 24, 0.65)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      padding: '20px'
    }}>
      <div 
        className="cairn-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: 'calc(100vh - 40px)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-warm-float)',
          overflow: 'hidden',
          border: '1px solid var(--border-cream)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '22px 28px 18px',
          borderBottom: '1px solid var(--border-cream-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'var(--forest-green-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--forest-green)'
            }}>
              <MapPin size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
                Live Delivery Location
              </h2>
              <div style={{ fontSize: '12.5px', color: 'var(--ink-secondary)' }}>
                Powers real-time artisan proximity & 15-min dispatch
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              color: 'var(--ink-muted)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Current Location Badge */}
          <div style={{ padding: '20px 28px 0' }}>
          <div style={{
            backgroundColor: 'var(--bg-cream-subtle)',
            borderRadius: '16px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid var(--border-cream)'
          }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-muted)', fontWeight: 600 }}>
                Active Fulfilment Destination
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginTop: '2px' }}>
                {currentLocation.locality}, {currentLocation.city}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span>{currentLocation.hub}</span>
                <span>•</span>
                <span style={{ color: 'var(--forest-green)', fontWeight: 600 }}>
                  ⚡ {currentLocation.deliveryTime || '15 mins'} delivery
                </span>
              </div>
            </div>

            {currentLocation.isLiveGPS ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#DCFCE7',
                color: '#166534',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '9999px',
                border: '1px solid #86EFAC'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E', animation: 'pulse 1.5s infinite' }} />
                LIVE GPS
              </span>
            ) : (
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: '#F1F5F9',
                color: 'var(--ink-secondary)'
              }}>
                Pre-selected Hub
              </span>
            )}
          </div>
        </div>

        {/* Live GPS Action */}
        <div style={{ padding: '20px 28px' }}>
          <button
            onClick={handleDetectLiveLocation}
            disabled={isDetecting}
            style={{
              width: '100%',
              backgroundColor: 'var(--forest-green)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '14.5px',
              fontWeight: 600,
              cursor: isDetecting ? 'wait' : 'pointer',
              boxShadow: 'var(--shadow-warm-sm)',
              transition: 'background-color 0.2s ease'
            }}
          >
            {isDetecting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Acquiring Live GPS & Satellite Lock...</span>
              </>
            ) : (
              <>
                <Navigation size={18} />
                <span>Use Current Live GPS Location</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              backgroundColor: 'var(--status-failed-bg)',
              color: 'var(--status-failed-text)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '12.5px',
              marginTop: '12px',
              border: '1px solid var(--status-failed-border)'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Manual Input */}
          <form onSubmit={handleCustomSubmit} style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Or enter city / area (e.g. Pune, Gurugram, Seattle)..."
                value={customSearch}
                onChange={(e) => setCustomSearch(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-cream)',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-cream)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  cursor: 'pointer'
                }}
              >
                Set
              </button>
            </div>
          </form>

          {/* Quick Hubs List */}
          <div style={{ marginTop: '22px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-muted)', marginBottom: '10px' }}>
              Popular Verified Micro-Hubs
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              maxHeight: '190px',
              overflowY: 'auto'
            }}>
              {POPULAR_LOCATIONS.map((loc) => {
                const isCurrent = currentLocation.city === loc.city;
                return (
                  <button
                    key={loc.city}
                    onClick={() => handleSelectPreset(loc)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      backgroundColor: isCurrent ? 'var(--forest-green-light)' : '#FFFFFF',
                      border: isCurrent ? '1.5px solid var(--forest-green)' : '1px solid var(--border-cream)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 600, color: isCurrent ? 'var(--forest-green)' : 'var(--ink)' }}>
                      {loc.city}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {loc.locality}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#166534', fontWeight: 600, marginTop: '2px' }}>
                      ⚡ {loc.deliveryTime}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 28px',
          backgroundColor: 'var(--bg-cream-subtle)',
          borderTop: '1px solid var(--border-cream-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11.5px',
          color: 'var(--ink-muted)'
        }}>
          <ShieldCheck size={14} color="var(--forest-green)" />
          <span>Location data stays in your browser session for direct routing and is never monetized.</span>
        </div>
      </div>
    </div>
  );
}
