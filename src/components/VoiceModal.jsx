import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, Volume2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function VoiceModal({
  isOpen,
  onClose,
  onTranscriptComplete
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [audioLevel, setAudioLevel] = useState(1);
  const recognitionRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setTranscript('');
      setErrorMessage('');
      return;
    }

    // Check if browser supports Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setErrorMessage('Your browser does not support native Web Speech. You can type your request directly.');
      return;
    }

    setIsSupported(true);
    startListening();

    return () => {
      stopListening();
    };
  }, [isOpen]);

  // Pulse effect simulation when listening
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      setAudioLevel(0.8 + Math.random() * 0.6);
    }, 150);

    return () => clearInterval(interval);
  }, [isListening]);

  const startListening = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Default to Indian English / Global English

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage('');
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.warn('[Voice Recognition] Notice:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser.');
        } else if (event.error !== 'no-speech') {
          setErrorMessage(`Audio capture notice: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.error('[Voice] Error starting speech recognition:', e);
      setErrorMessage('Could not initialize microphone. Please check permissions.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore already stopped errors
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleApply = (text) => {
    const finalQuery = text || transcript;
    if (finalQuery && finalQuery.trim()) {
      stopListening();
      onTranscriptComplete(finalQuery.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(15, 17, 17, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        fontFamily: '"Amazon Ember", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid #F3F4F6',
          backgroundColor: '#FAFAFA'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={16} />
            </div>
            <div>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F1111' }}>
                Voice Search with Whisper Flow
              </span>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                100% Free · Real-Time Speech AI
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              stopListening();
              onClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#6B7280',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Center Microphone Pulsing Orb */}
        <div style={{
          padding: '36px 24px 28px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {/* Animated Glowing Mic Circle */}
          <div style={{
            position: 'relative',
            width: '110px',
            height: '110px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            {/* Pulsing ring 1 */}
            {isListening && (
              <div style={{
                position: 'absolute',
                inset: -12,
                borderRadius: '50%',
                backgroundColor: 'rgba(31, 77, 58, 0.15)',
                transform: `scale(${audioLevel * 1.08})`,
                transition: 'transform 0.15s ease-out'
              }} />
            )}

            {/* Pulsing ring 2 */}
            {isListening && (
              <div style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '50%',
                backgroundColor: 'rgba(31, 77, 58, 0.25)',
                transform: `scale(${audioLevel})`,
                transition: 'transform 0.12s ease-out'
              }} />
            )}

            <button
              onClick={isListening ? stopListening : startListening}
              style={{
                position: 'relative',
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: isListening ? '#1F4D3A' : '#F3F4F6',
                color: isListening ? '#FFFFFF' : '#374151',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isListening ? '0 10px 25px -5px rgba(31, 77, 58, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
              title={isListening ? 'Click to pause' : 'Click to speak'}
            >
              {isListening ? (
                <Mic size={38} className="animate-pulse" />
              ) : (
                <MicOff size={34} />
              )}
            </button>
          </div>

          {/* Status Label */}
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            color: isListening ? '#1F4D3A' : '#4B5563',
            marginBottom: '6px'
          }}>
            {isListening ? 'Listening... Speak naturally' : 'Microphone paused. Click to speak'}
          </div>

          <div style={{
            fontSize: '12.5px',
            color: '#6B7280',
            maxWidth: '380px',
            lineHeight: 1.4,
            marginBottom: '20px'
          }}>
            Ask for any product, budget limit, or category (e.g., <em>"Find a quiet laptop under 60k"</em>)
          </div>

          {/* Live Transcript Display Box */}
          <div style={{
            width: '100%',
            minHeight: '80px',
            padding: '16px',
            backgroundColor: '#F9FAFB',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            fontSize: '15px',
            color: transcript ? '#0F1111' : '#9CA3AF',
            fontStyle: transcript ? 'normal' : 'italic',
            textAlign: 'left',
            lineHeight: 1.5,
            boxSizing: 'border-box',
            marginBottom: '16px'
          }}>
            {transcript || 'Your spoken words will appear here in real time...'}
          </div>

          {/* Error notice if any */}
          {errorMessage && (
            <div style={{
              fontSize: '12px',
              color: '#DC2626',
              backgroundColor: '#FEF2F2',
              padding: '8px 14px',
              borderRadius: '8px',
              marginBottom: '14px',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              {errorMessage}
            </div>
          )}

          {/* Suggested Voice Prompts */}
          <div style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            {[
              "Quiet laptop under ₹60,000",
              "Organic linen sheets",
              "Cold brew coffee maker",
              "Smartphone under 25k"
            ].map((sample) => (
              <button
                key={sample}
                onClick={() => {
                  setTranscript(sample);
                  handleApply(sample);
                }}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  borderRadius: '100px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  border: '1px solid #E5E7EB',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
              >
                "{sample}"
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            gap: '12px'
          }}>
            <button
              onClick={() => {
                stopListening();
                onClose();
              }}
              style={{
                padding: '9px 18px',
                borderRadius: '100px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              onClick={() => handleApply(transcript)}
              disabled={!transcript.trim()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 22px',
                borderRadius: '100px',
                border: 'none',
                backgroundColor: transcript.trim() ? '#1F4D3A' : '#D1D5DB',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: transcript.trim() ? 'pointer' : 'not-allowed',
                boxShadow: transcript.trim() ? '0 4px 12px rgba(31, 77, 58, 0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Search with Aria</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Footer info: Free Whisper Architecture */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: '#F9FAFB',
          borderTop: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#6B7280'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#059669" />
            <span>100% Free Open Whisper / Web Speech API Integration</span>
          </div>
          <span>Zero Paid Subscriptions</span>
        </div>
      </div>
    </div>
  );
}
