import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle2, AlertTriangle, X, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan, onClose, title = 'Scan QR Code', description = 'Position the QR code within the frame' }) => {
  const [status, setStatus] = useState('scanning'); // scanning | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const html5QrCodeRef = useRef(null);
  const scannerIdRef = useRef('qr-reader-' + Math.random().toString(36).substr(2, 9));
  const stoppedRef = useRef(false);
  const hasScannedRef = useRef(false);
  const completeTimeoutRef = useRef(null);
  const cleanupPromiseRef = useRef(null);
  const isCompletingRef = useRef(false);

  const forceStopCameraTracks = useCallback((scannerRoot = document.getElementById(scannerIdRef.current)) => {
    if (!scannerRoot) return;

    scannerRoot.querySelectorAll('video').forEach((videoEl) => {
      const stream = videoEl.srcObject;
      if (stream && typeof stream.getTracks === 'function') {
        stream.getTracks().forEach((track) => track.stop());
      }
      videoEl.srcObject = null;
    });
  }, []);

  const stopScanner = useCallback(async () => {
    if (completeTimeoutRef.current) {
      clearTimeout(completeTimeoutRef.current);
      completeTimeoutRef.current = null;
    }

    if (stoppedRef.current && !html5QrCodeRef.current) {
      forceStopCameraTracks();
      return;
    }

    if (cleanupPromiseRef.current) {
      await cleanupPromiseRef.current;
      return;
    }

    stoppedRef.current = true;

    const scannerRoot = document.getElementById(scannerIdRef.current);
    forceStopCameraTracks(scannerRoot);

    const cleanupTask = (async () => {
      if (html5QrCodeRef.current) {
        try {
          const state = html5QrCodeRef.current.getState?.();
          if (state === 2 || state === 3) {
            await html5QrCodeRef.current.stop();
          }
        } catch (err) {
          // ignore stop errors
        }

        forceStopCameraTracks(scannerRoot);

        try {
          await html5QrCodeRef.current.clear();
        } catch (err) {
          // ignore clear errors
        }

        html5QrCodeRef.current = null;
      }

      forceStopCameraTracks(document.getElementById(scannerIdRef.current) || scannerRoot);
    })();

    cleanupPromiseRef.current = cleanupTask;

    try {
      await cleanupTask;
    } finally {
      if (cleanupPromiseRef.current === cleanupTask) {
        cleanupPromiseRef.current = null;
      }
    }
  }, [forceStopCameraTracks]);

  const completeScan = useCallback(async (decodedText) => {
    if (hasScannedRef.current || isCompletingRef.current) return;

    hasScannedRef.current = true;
    isCompletingRef.current = true;
    setStatus('success');

    try {
      await stopScanner();
      await onScan?.(decodedText);
    } finally {
      isCompletingRef.current = false;
    }
  }, [onScan, stopScanner]);

  const startScanner = useCallback(async () => {
    if (html5QrCodeRef.current) return;
    stoppedRef.current = false;
    hasScannedRef.current = false;
    isCompletingRef.current = false;

    try {
      const html5QrCode = new Html5Qrcode(scannerIdRef.current);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 200, height: 200 },
          aspectRatio: 1.0,
        },
        async (decodedText) => {
          await completeScan(decodedText);
        },
        () => {} // ignore scan failures (no QR found in frame)
      );
    } catch (err) {
      console.error('Camera error:', err);
      isCompletingRef.current = false;
      setErrorMsg(
        typeof err === 'string'
          ? err
          : err?.message || 'Camera access denied. Please allow camera permissions.'
      );
      setStatus('error');
      await stopScanner();
    }
  }, [completeScan, stopScanner]);

  useEffect(() => {
    startScanner();

    return () => {
      forceStopCameraTracks();
      stopScanner();
    };
  }, [forceStopCameraTracks, startScanner, stopScanner]);

  const handleClose = async () => {
    hasScannedRef.current = false;
    isCompletingRef.current = false;
    await stopScanner();
    onClose?.();
  };

  const handleSimulate = async () => {
    await completeScan('SIMULATED_QR_DATA_' + Date.now());
  };

  const handleRetry = () => {
    setStatus('scanning');
    setErrorMsg('');
    stoppedRef.current = false;
    hasScannedRef.current = false;
    isCompletingRef.current = false;
    startScanner();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card glow relative mx-4 w-full max-w-md p-6"
      >
        <button onClick={handleClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors z-10">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-xl bg-muted/30">
          {/* Camera feed */}
          <div id={scannerIdRef.current} className="w-full" />

          {/* Scanning overlay with corner markers */}
          {status === 'scanning' && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="absolute left-2 top-2 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-primary" />
              <div className="absolute right-2 top-2 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-primary" />
              <div className="absolute bottom-2 left-2 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-2 right-2 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-primary" />
              <div className="absolute left-2 right-2 h-0.5 animate-scan-line bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
          )}

          {/* Success overlay */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  <CheckCircle2 className="h-16 w-16 text-success" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error placeholder */}
          {status === 'error' && (
            <div className="flex h-56 items-center justify-center">
              <Camera className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Error state */}
        <AnimatePresence>
          {status === 'error' && errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center gap-2 rounded-lg bg-warning/10 p-3 text-sm text-warning"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex flex-col gap-2">
          {status === 'error' && (
            <Button onClick={handleRetry} className="w-full bg-primary text-primary-foreground">
              <Camera className="mr-2 h-4 w-4" />
              Retry Camera
            </Button>
          )}
          <Button
            onClick={handleSimulate}
            variant={status === 'error' ? 'default' : 'outline'}
            className="w-full"
          >
            <ScanLine className="mr-2 h-4 w-4" />
            Simulate QR Scan (Demo)
          </Button>
          <Button variant="ghost" onClick={handleClose} className="w-full text-muted-foreground">
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QRScanner;
