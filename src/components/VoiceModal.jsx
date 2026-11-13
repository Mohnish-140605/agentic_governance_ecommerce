import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Mic, MicOff, ShieldCheck, Sparkles, X } from 'lucide-react';

const appendSpeech = (current, next) => {
  const phrase = next.trim();
  if (!phrase) return current;
  return current ? `${current}${/\s$/.test(current) ? '' : ' '}${phrase}` : phrase;
};

const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export default function VoiceModal({ isOpen, onClose, onTranscriptComplete }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const recognitionRef = useRef(null);
  const shouldContinueRef = useRef(false);
  const fullTranscriptRef = useRef('');
  const restartTimerRef = useRef(null);
  const startTimerRef = useRef(null);
  const startListeningRef = useRef(null);

  const stopListening = useCallback(() => {
    shouldContinueRef.current = false;
    window.clearTimeout(restartTimerRef.current);
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // The browser may already have stopped recognition.
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    if (recognitionRef.current) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = navigator.language || 'en-IN';
      shouldContinueRef.current = true;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage('');
      };

      recognition.onresult = (event) => {
        let finalText = fullTranscriptRef.current;
        let interimText = '';

        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const result = event.results[index];
          const phrase = result[0].transcript;
          if (result.isFinal) {
            finalText = appendSpeech(finalText, phrase);
          } else {
            interimText = appendSpeech(interimText, phrase);
          }
        }

        fullTranscriptRef.current = finalText;
        setTranscript(appendSpeech(finalText, interimText));
      };

      recognition.onerror = (event) => {
        const messages = {
          'not-allowed': 'Microphone access was denied. Allow microphone access in your browser settings and try again.',
          'service-not-allowed': 'The browser speech service is unavailable. Try another browser or type your request.',
          'audio-capture': 'No microphone was found. Connect a microphone and try again.',
          network: 'Speech recognition could not connect. Check your internet connection and try again.'
        };
        const message = messages[event.error];
        if (message) {
          shouldContinueRef.current = false;
          setErrorMessage(message);
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (recognitionRef.current !== recognition) return;
        recognitionRef.current = null;

        if (shouldContinueRef.current) {
          restartTimerRef.current = window.setTimeout(() => {
            if (startListeningRef.current) startListeningRef.current();
          }, 250);
        } else {
          setIsListening(false);
        }
      };

      recognition.start();
    } catch (error) {
      recognitionRef.current = null;
      shouldContinueRef.current = false;
      setIsListening(false);
      setErrorMessage('Could not start the microphone. Check browser permissions and try again.');
      console.error('[Voice] Error starting speech recognition:', error);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    startListeningRef.current = startListening;
    startTimerRef.current = window.setTimeout(startListening, 0);

    return () => {
      window.clearTimeout(startTimerRef.current);
      stopListening();
    };
  }, [isOpen, startListening, stopListening]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        stopListening();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, stopListening]);

  const closeModal = () => {
    stopListening();
    onClose();
  };

  const handleApply = (text = transcript) => {
    const finalQuery = text.trim();
    if (!finalQuery) return;
    stopListening();
    onTranscriptComplete(finalQuery);
    onClose();
  };

  if (!isOpen) return null;

  const isSupported = Boolean(getSpeechRecognition());
  const suggestions = [
    'Quiet laptop under ₹60,000',
    'Organic linen sheets',
    'Cold brew coffee maker',
    'Smartphone under 25k'
  ];

  return createPortal(
    <div className="voice-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeModal();
    }}>
      <section
        className="voice-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-modal-title"
      >
        <header className="voice-modal-header">
          <div className="voice-modal-brand">
            <span className="voice-modal-brand-icon"><Sparkles size={16} /></span>
            <div>
              <h2 id="voice-modal-title">Voice search</h2>
              <p>Speak naturally to search with Aria</p>
            </div>
          </div>
          <button className="voice-modal-close" onClick={closeModal} aria-label="Close voice search">
            <X size={20} />
          </button>
        </header>

        <div className="voice-modal-content">
          <button
            type="button"
            className={`voice-orb${isListening ? ' is-listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            aria-pressed={isListening}
            disabled={!isSupported}
          >
            <span className="voice-orb-ring voice-orb-ring-one" />
            <span className="voice-orb-ring voice-orb-ring-two" />
            <span className="voice-orb-core">
              {isListening ? <Mic size={30} /> : <MicOff size={28} />}
            </span>
          </button>

          <div className={`voice-status${isListening ? ' is-listening' : ''}`} aria-live="polite">
            {isListening ? 'Listening' : errorMessage || !isSupported ? 'Microphone unavailable' : 'Ready when you are'}
          </div>
          <p className="voice-instructions">
            {isListening
              ? 'Say what you are looking for. Your words will appear below.'
              : 'Tap the microphone to start speaking.'}
          </p>

          <div className="voice-transcript" aria-live="polite" aria-label="Speech transcript">
            {transcript || <span className="voice-transcript-placeholder">Your spoken words will appear here...</span>}
          </div>

          {(errorMessage || !isSupported) && (
            <div className="voice-error" role="alert">
              {errorMessage || 'Speech recognition is not available in this browser. You can type your request instead.'}
            </div>
          )}

          {isSupported && (
            <div className="voice-suggestions" aria-label="Try a sample search">
              {suggestions.map((sample) => (
                <button key={sample} onClick={() => handleApply(sample)}>{sample}</button>
              ))}
            </div>
          )}

          <div className="voice-actions">
            <button className="voice-cancel" onClick={closeModal}>Cancel</button>
            <button
              className="voice-submit"
              onClick={() => handleApply()}
              disabled={!transcript.trim()}
            >
              Search with Aria <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <footer className="voice-modal-footer">
          <ShieldCheck size={14} />
          <span>Speech recognition is provided by your browser.</span>
        </footer>
      </section>
    </div>,
    document.body
  );
}
