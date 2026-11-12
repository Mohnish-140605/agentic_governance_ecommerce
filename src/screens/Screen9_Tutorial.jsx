import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  FileCheck, 
  Clock, 
  HeartHandshake,
  MapPin,
  Navigation,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import TrustReceipt from '../components/TrustReceipt';

export default function Screen9_HowAriaWorks({ onNavigateToScreen, currentLocation, onUpdateLocation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, requesting, granted, denied
  const [userLocation, setUserLocation] = useState(null);

  const tutorialSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Cairn',
      subtitle: 'Your mindful shopping companion',
      description: 'Cairn is designed to make online shopping safe, transparent, and stress-free. Let us show you how it works in just a few minutes.',
      icon: <HeartHandshake size={32} color="var(--forest-green)" />,
      action: null
    },
    {
      id: 'location',
      title: 'Set Your Location',
      subtitle: 'For accurate delivery estimates',
      description: 'We use your location to show accurate delivery times and nearby merchants. Your location is only used for delivery purposes and is never shared.',
      icon: <MapPin size={32} color="var(--forest-green)" />,
      action: 'request_location'
    },
    {
      id: 'search',
      title: 'Search Naturally',
      subtitle: 'Just tell Aria what you need',
      description: 'No complicated filters or endless scrolling. Simply type or speak what you\'re looking for, like "Find me a quiet laptop under ₹60,000".',
      icon: <Sparkles size={32} color="var(--forest-green)" />,
      action: null
    },
    {
      id: 'governance',
      title: 'Aria Checks Your Rules',
      subtitle: 'Your personal safeguards at work',
      description: 'Before any purchase, Aria verifies the order against your spending limits, approval thresholds, and preferred merchants.',
      icon: <ShieldCheck size={32} color="var(--forest-green)" />,
      action: null
    },
    {
      id: 'receipt',
      title: 'Get Your Trust Receipt',
      subtitle: 'Complete transparency',
      description: 'Every order comes with a Trust Receipt showing exactly what was checked, the price, delivery details, and a cryptographic verification hash.',
      icon: <FileCheck size={32} color="var(--forest-green)" />,
      action: null
    },
    {
      id: 'hold',
      title: '15-Minute Safety Hold',
      subtitle: 'Time to change your mind',
      description: 'All orders have a 15-minute hold period. If you change your mind, you can cancel with one click before the order is processed.',
      icon: <Clock size={32} color="var(--forest-green)" />,
      action: null
    },
    {
      id: 'ready',
      title: 'You\'re All Set!',
      subtitle: 'Start shopping with confidence',
      description: 'You now know how Cairn works. Start exploring products, set your spending rules, and let Aria handle the rest.',
      icon: <CheckCircle size={32} color="var(--forest-green)" />,
      action: 'start_shopping'
    }
  ];

  const currentTutorialStep = tutorialSteps[currentStep];

  // Request geolocation
  const requestLocation = () => {
    setLocationStatus('requesting');
    
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setLocationStatus('granted');
        
        // Update location in parent component
        if (onUpdateLocation) {
          onUpdateLocation({
            lat: latitude,
            lng: longitude,
            name: 'Current Location'
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Auto-play tutorial
  useEffect(() => {
    if (isPlaying && currentStep < tutorialSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 5000); // 5 seconds per step
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep === tutorialSteps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, tutorialSteps.length]);

  // Handle step actions
  const handleStepAction = () => {
    if (currentTutorialStep.action === 'request_location') {
      requestLocation();
    } else if (currentTutorialStep.action === 'start_shopping') {
      onNavigateToScreen('explore');
    }
  };

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const restartTutorial = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setLocationStatus('idle');
    setUserLocation(null);
  };

  return (
    <div className="tutorial-wrap animate-fade-in" style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-cream)',
      padding: 'clamp(20px, 4vw, 40px)'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--forest-green-light)',
            color: 'var(--forest-green)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            marginBottom: '16px'
          }}>
            <Sparkles size={14} />
            <span>GETTING STARTED</span>
          </div>
          
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 600,
            color: 'var(--ink)',
            marginBottom: '12px'
          }}>
            How Cairn Works
          </h1>
          
          <p style={{
            fontSize: '16px',
            color: 'var(--ink-secondary)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            A quick tutorial to help you understand how Cairn keeps your shopping safe and transparent.
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--ink-muted)'
            }}>
              Step {currentStep + 1} of {tutorialSteps.length}
            </span>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: isPlaying ? 'var(--coral-light)' : 'var(--forest-green-light)',
                  color: isPlaying ? 'var(--coral-dark)' : 'var(--forest-green)',
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                {isPlaying ? 'Pause' : 'Auto-play'}
              </button>
              <button
                onClick={restartTutorial}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: 'var(--bg-cream-subtle)',
                  color: 'var(--ink-secondary)',
                  border: '1px solid var(--border-cream)',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <RotateCcw size={14} />
                Restart
              </button>
            </div>
          </div>
          
          <div style={{
            height: '6px',
            backgroundColor: 'var(--bg-cream-subtle)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`,
              backgroundColor: 'var(--forest-green)',
              borderRadius: '3px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Tutorial Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--border-cream)',
          padding: 'clamp(24px, 5vw, 48px)',
          boxShadow: 'var(--shadow-warm-lg)',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            {/* Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              backgroundColor: 'var(--forest-green-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              {currentTutorialStep.icon}
            </div>

            {/* Title */}
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 600,
              color: 'var(--ink)',
              marginBottom: '8px'
            }}>
              {currentTutorialStep.title}
            </h2>

            {/* Subtitle */}
            <p style={{
              fontSize: '16px',
              color: 'var(--forest-green)',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              {currentTutorialStep.subtitle}
            </p>

            {/* Description */}
            <p style={{
              fontSize: '15px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.6,
              maxWidth: '600px',
              marginBottom: '32px'
            }}>
              {currentTutorialStep.description}
            </p>

            {/* Location Status (for location step) */}
            {currentTutorialStep.id === 'location' && (
              <div style={{
                backgroundColor: 'var(--bg-cream-subtle)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                width: '100%',
                maxWidth: '400px'
              }}>
                {locationStatus === 'idle' && (
                  <div style={{ fontSize: '14px', color: 'var(--ink-secondary)' }}>
                    📍 Location not set
                  </div>
                )}
                {locationStatus === 'requesting' && (
                  <div style={{ fontSize: '14px', color: 'var(--ink-secondary)' }}>
                    ⏳ Requesting location...
                  </div>
                )}
                {locationStatus === 'granted' && userLocation && (
                  <div style={{ fontSize: '14px', color: 'var(--forest-green)', fontWeight: 600 }}>
                    ✅ Location set: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                  </div>
                )}
                {locationStatus === 'denied' && (
                  <div style={{ fontSize: '14px', color: 'var(--coral-dark)' }}>
                    ❌ Location access denied. You can continue without it.
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            {currentTutorialStep.action && (
              <button
                onClick={handleStepAction}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
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
                {currentTutorialStep.action === 'request_location' && locationStatus !== 'granted' && (
                  <>
                    <Navigation size={16} />
                    Enable Location
                  </>
                )}
                {currentTutorialStep.action === 'request_location' && locationStatus === 'granted' && (
                  <>
                    <CheckCircle size={16} />
                    Location Enabled
                  </>
                )}
                {currentTutorialStep.action === 'start_shopping' && (
                  <>
                    <ArrowRight size={16} />
                    Start Shopping
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={goToPrevStep}
            disabled={currentStep === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: currentStep === 0 ? 'var(--bg-cream-subtle)' : '#FFFFFF',
              color: currentStep === 0 ? 'var(--ink-muted)' : 'var(--ink)',
              border: '1px solid var(--border-cream)',
              borderRadius: 'var(--radius-pill)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ← Previous
          </button>

          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: index === currentStep ? 'var(--forest-green)' : 'var(--border-cream)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  padding: 0
                }}
              />
            ))}
          </div>

          <button
            onClick={goToNextStep}
            disabled={currentStep === tutorialSteps.length - 1}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: currentStep === tutorialSteps.length - 1 ? 'var(--bg-cream-subtle)' : 'var(--forest-green)',
              color: currentStep === tutorialSteps.length - 1 ? 'var(--ink-muted)' : '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: currentStep === tutorialSteps.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Next →
          </button>
        </div>

        {/* Trust Receipt Preview */}
        {currentStep >= 4 && (
          <div style={{
            marginTop: '48px',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border-cream)',
            padding: 'clamp(24px, 5vw, 48px)',
            boxShadow: 'var(--shadow-warm-lg)'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <div style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 700,
                color: 'var(--forest-green)',
                marginBottom: '8px'
              }}>
                THE SIGNATURE ELEMENT
              </div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 600,
                color: 'var(--ink)',
                marginBottom: '8px'
              }}>
                Your Trust Receipt
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--ink-secondary)',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                Every order comes with a detailed receipt showing all verification steps and a cryptographic hash.
              </p>
            </div>

            <TrustReceipt
              id="CRN-2026-TUTORIAL"
              item="Example Product - Quiet Study Laptop"
              price={58990}
              status="placed"
              authorizedAt="Just now"
              paymentChannel="Your Payment Method"
              destination={currentLocation?.name || 'Your Location'}
              sha256="4e89bb02a819c991a03f421...910a"
              onTrackOrder={() => onNavigateToScreen('orders')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
