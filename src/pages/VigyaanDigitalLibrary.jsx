import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, RotateCcw, ArrowRight, X, CheckCircle2, MapPin, ScanLine, Clock, Shield, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useRequestStore from '@/store/requestStore';
import useBookStore from '@/store/bookStore';
import useVigyaanStore from '@/store/vigyaanStore';
import QRScanner from '@/components/QRScanner';
import { toast } from 'sonner';

const VigyaanDigitalLibrary = () => {
  const navigate = useNavigate();
  const { getPendingIssueRequests, getPendingReturnRequests, fulfillRequest } = useRequestStore();
  const { issueBook, returnBook } = useBookStore();
  const { isOpen, openVigyaan, closeVigyaan } = useVigyaanStore();

  const [activeTab, setActiveTab] = useState('issue');
  const [processingRequest, setProcessingRequest] = useState(null);
  const [processStep, setProcessStep] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [scanPurpose, setScanPurpose] = useState(''); // verify-student | verify-book | close-admin
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const issueRequests = getPendingIssueRequests();
  const returnRequests = getPendingReturnRequests();

  const openScannerFor = (purpose) => {
    setShowCloseConfirm(false);
    setScanPurpose(purpose);
    setShowScanner(true);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const keepVigyaanLocked = () => {
      navigate('/vigyaan', { replace: true });
      window.history.pushState({ vigyaanLocked: true }, '', '/vigyaan');
    };

    window.history.pushState({ vigyaanLocked: true }, '', window.location.pathname);
    window.addEventListener('popstate', keepVigyaanLocked);

    return () => {
      window.removeEventListener('popstate', keepVigyaanLocked);
    };
  }, [isOpen, navigate]);

  // --- Issue Flow Steps ---
  // 0: verify student QR → 1: guide to shelf → 2: scan book QR → 3: select months → 4: success
  // --- Return Flow Steps ---
  // 0: verify student QR → 1: scan book QR → 2: guide to shelf to place book → 3: success

  const startProcess = (request) => {
    setProcessingRequest(request);
    setProcessStep(0);
    openScannerFor('verify-student');
  };

  const handleScan = (data) => {
    // Camera is auto-closed by QRScanner on successful scan
    setShowScanner(false);

    if (scanPurpose === 'verify-student') {
      // TODO: Replace with API call — POST /api/vigyaan/verify-student
      toast.success('Student identity verified!');
      if (processingRequest.type === 'issue') {
        setProcessStep(1); // guide to shelf
      } else {
        setProcessStep(1); // return: next scan book
      }
    } else if (scanPurpose === 'verify-book') {
      // TODO: Replace with API call — POST /api/vigyaan/verify-book
      toast.success('Book verified successfully!');
      if (processingRequest.type === 'issue') {
        setProcessStep(3); // select months
      } else {
        setProcessStep(2); // guide to shelf to place
      }
    } else if (scanPurpose === 'close-admin') {
      // TODO: Replace with API call — POST /api/vigyaan/close
      toast.success('Admin verified! Closing Vigyaan...');
      closeVigyaan();
      setShowCloseConfirm(false);
      navigate('/admin');
    }
  };

  // TODO: Replace with API call — POST /api/vigyaan/issue
  const handleIssueComplete = () => {
    issueBook(processingRequest.bookId);
    fulfillRequest(processingRequest.id);
    setProcessStep(4);
  };

  // TODO: Replace with API call — POST /api/vigyaan/return
  const handleReturnComplete = () => {
    returnBook(processingRequest.bookId);
    fulfillRequest(processingRequest.id);
    setProcessStep(3);
  };

  const resetProcess = () => {
    setProcessingRequest(null);
    setProcessStep(0);
    setScanPurpose('');
    setSelectedMonths(1);
  };

  const getDueDate = (months) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (!isOpen) {
    return (
      <div className="fixed inset-0 z-[100] overflow-auto bg-background">
        <div className="pointer-events-none absolute left-[10%] top-[8%] h-72 w-72 rounded-full bg-primary/10 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-[8%] right-[10%] h-80 w-80 rounded-full bg-accent/10 blur-[130px]" />

        <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-5xl space-y-6">
            <div className="glass-card glow overflow-hidden p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.25fr_0.9fr] lg:items-center">
                <div>
                  <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-primary">
                    <Shield className="h-3.5 w-3.5" /> Isolated library station
                  </span>
                  <h1 className="max-w-2xl text-4xl font-bold leading-tight text-foreground lg:text-5xl">
                    Open <span className="gradient-text">Vigyaan</span> for guided issue and return verification.
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    This full-screen desk stays locked to Vigyaan once opened. Students can process requests here, and only an admin ID scan can close the station.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 text-sm">
                    <div className="rounded-xl border border-border/40 bg-muted/20 px-4 py-3 text-muted-foreground">
                      <span className="block text-[11px] uppercase tracking-[0.18em]">Issue queue</span>
                      <span className="mt-1 block text-xl font-semibold text-foreground">{issueRequests.length}</span>
                    </div>
                    <div className="rounded-xl border border-border/40 bg-muted/20 px-4 py-3 text-muted-foreground">
                      <span className="block text-[11px] uppercase tracking-[0.18em]">Return queue</span>
                      <span className="mt-1 block text-xl font-semibold text-foreground">{returnRequests.length}</span>
                    </div>
                    <div className="rounded-xl border border-border/40 bg-muted/20 px-4 py-3 text-muted-foreground">
                      <span className="block text-[11px] uppercase tracking-[0.18em]">Close method</span>
                      <span className="mt-1 block text-sm font-medium text-foreground">Admin QR verification</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  {[
                    { title: 'Student verification', description: 'Scan the student ID QR only when a request is being processed.', icon: Users },
                    { title: 'Book verification', description: 'Verify the exact book before issuing or accepting a return.', icon: ScanLine },
                    { title: 'Guided shelf steps', description: 'Show shelf location, due date, and final success confirmation.', icon: MapPin },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-border/40 bg-card/40 p-4 backdrop-blur-xl">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <h2 className="font-semibold text-foreground">{item.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => {
                    // TODO: Replace with API call — POST /api/vigyaan/open
                    openVigyaan();
                    toast.success('Vigyaan is now open!');
                  }}
                  className="h-12 flex-1 bg-primary text-primary-foreground"
                >
                  <Zap className="mr-2 h-4 w-4" /> Open Vigyaan Station
                </Button>
                <div className="flex-1 rounded-xl border border-border/40 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                  Once opened, browser back navigation is locked and the desk remains in kiosk mode until verified closure.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ===== ISOLATION MODE: Full screen, no navbar/footer =====
  // Processing a request
  if (processingRequest) {
    const isIssue = processingRequest.type === 'issue';

    return (
      <div className="fixed inset-0 z-[100] bg-background overflow-auto">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="min-h-screen flex items-start justify-center px-4 py-8">
          <div className="w-full max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <Button variant="ghost" size="sm" onClick={resetProcess} className="text-muted-foreground">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Requests
              </Button>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Shield className="h-3.5 w-3.5" /> Vigyaan station locked
              </span>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card glow p-6">
              <div className="mb-6 rounded-2xl border border-border/40 bg-muted/20 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Guided verification flow</p>
                    <h2 className="mt-2 text-2xl font-semibold text-foreground">{isIssue ? 'Issue request processing' : 'Return request processing'}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Follow the secure steps below. Camera access opens only during scanning and closes automatically after each verification.</p>
                  </div>
                  <div className="rounded-2xl border border-border/40 bg-card/50 px-4 py-3 text-sm">
                    <p className="text-muted-foreground">Processing for</p>
                    <p className="font-semibold text-foreground">{processingRequest.studentName}</p>
                    <p className="text-xs text-muted-foreground">{processingRequest.studentId}</p>
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mb-6 flex items-center justify-center gap-2">
                {(isIssue ? [0, 1, 2, 3, 4] : [0, 1, 2, 3]).map((step) => (
                  <div key={step} className={`h-2 rounded-full transition-all ${step <= processStep ? 'w-8 bg-primary' : 'w-2 bg-muted'}`} />
                ))}
              </div>

              <div className="mb-4 text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <span className="text-2xl">{processingRequest.bookEmoji}</span>
                  <h2 className="text-lg font-semibold text-foreground">{processingRequest.bookTitle}</h2>
                </div>
                <p className="text-sm text-muted-foreground">Student: {processingRequest.studentName} ({processingRequest.studentId})</p>
                <span className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-medium ${isIssue ? 'bg-primary/20 text-primary' : 'bg-warning/20 text-warning'}`}>
                  {isIssue ? 'Issue Request' : 'Return Request'}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {/* ISSUE FLOW */}
                {isIssue && processStep === 1 && (
                  <motion.div key="issue-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                    <div className="mb-4 rounded-xl bg-muted/30 p-6">
                      <MapPin className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="font-medium text-foreground">Guide student to shelf</p>
                      <p className="mt-1 text-2xl font-bold gradient-text">{processingRequest.bookShelf}</p>
                      <p className="mt-2 text-sm text-muted-foreground">Ask the student to go to shelf <strong>{processingRequest.bookShelf}</strong>, pick up the book, and come back for verification.</p>
                    </div>
                    <Button onClick={() => openScannerFor('verify-book')} className="w-full bg-primary text-primary-foreground">
                      <ScanLine className="mr-2 h-4 w-4" /> Scan Book QR Code <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}

                {isIssue && processStep === 3 && (
                  <motion.div key="issue-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                    <div className="mb-4 rounded-xl bg-muted/30 p-4">
                      <Clock className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="mb-3 font-medium text-foreground">How many months to issue?</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((m) => (
                          <button
                            key={m}
                            onClick={() => setSelectedMonths(m)}
                            className={`rounded-lg p-3 text-sm font-medium transition-colors ${
                              selectedMonths === m ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                            }`}
                          >
                            {m} {m === 1 ? 'month' : 'months'}
                          </button>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">Return by: <strong className="text-foreground">{getDueDate(selectedMonths)}</strong></p>
                    </div>
                    <Button onClick={handleIssueComplete} className="w-full bg-primary text-primary-foreground">
                      Confirm Issue <CheckCircle2 className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}

                {isIssue && processStep === 4 && (
                  <motion.div key="issue-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                      <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-success" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-foreground">Book Issued Successfully!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Thank you for your visit. Happy reading! 📚</p>
                    <div className="mt-4 rounded-lg bg-muted/30 p-3">
                      <p className="text-sm text-muted-foreground">Return Date</p>
                      <p className="font-semibold text-foreground">{getDueDate(selectedMonths)}</p>
                    </div>
                    <Button onClick={resetProcess} className="mt-4 w-full bg-primary text-primary-foreground">
                      Done
                    </Button>
                  </motion.div>
                )}

                {/* RETURN FLOW */}
                {!isIssue && processStep === 1 && (
                  <motion.div key="return-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                    <div className="mb-4 rounded-xl bg-muted/30 p-6">
                      <ScanLine className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="font-medium text-foreground">Verify the book</p>
                      <p className="mt-2 text-sm text-muted-foreground">Scan the book's QR code to verify the student has brought the correct book for return.</p>
                    </div>
                    <Button onClick={() => openScannerFor('verify-book')} className="w-full bg-primary text-primary-foreground">
                      <ScanLine className="mr-2 h-4 w-4" /> Scan Book QR Code
                    </Button>
                  </motion.div>
                )}

                {!isIssue && processStep === 2 && (
                  <motion.div key="return-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                    <div className="mb-4 rounded-xl bg-muted/30 p-6">
                      <MapPin className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="font-medium text-foreground">Place the book back</p>
                      <p className="mt-1 text-2xl font-bold gradient-text">{processingRequest.bookShelf}</p>
                      <p className="mt-2 text-sm text-muted-foreground">Ask the student to go to shelf <strong>{processingRequest.bookShelf}</strong> and place the book back.</p>
                    </div>
                    <Button onClick={handleReturnComplete} className="w-full bg-primary text-primary-foreground">
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Book Placed Successfully
                    </Button>
                  </motion.div>
                )}

                {!isIssue && processStep === 3 && (
                  <motion.div key="return-3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                      <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-success" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-foreground">Book Returned Successfully!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Thank you for returning the book. Come back again! 📖</p>
                    <Button onClick={resetProcess} className="mt-4 w-full bg-primary text-primary-foreground">
                      Done
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {showScanner && (
            <QRScanner
              onScan={handleScan}
              onClose={() => setShowScanner(false)}
              title={scanPurpose === 'verify-student' ? 'Verify Student Identity' : 'Verify Book'}
              description={scanPurpose === 'verify-student' ? 'Scan the student\'s ID card QR code' : 'Scan the book\'s QR code'}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Main view - requests list (ISOLATED full screen)
  return (
    <div className="fixed inset-0 z-[100] bg-background overflow-auto">
      <div className="pointer-events-none absolute left-[8%] top-0 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[6%] right-[8%] h-80 w-80 rounded-full bg-accent/10 blur-[140px]" />
      <div className="min-h-screen px-4 py-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 rounded-3xl border border-border/40 bg-card/50 p-6 backdrop-blur-xl lg:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
                      <span className="gradient-text">Vigyaan</span> Digital Library
                    </h1>
                    <span className="flex items-center gap-1 rounded-full bg-success/20 px-2.5 py-0.5 text-xs font-medium text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Open
                    </span>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                    This isolated station handles student issue and return requests with QR-based identity checks, shelf guidance, and secure closure by admin verification only.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCloseConfirm(true)}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <X className="mr-1 h-4 w-4" /> Close Vigyaan
                </Button>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  { label: 'Pending issues', value: issueRequests.length, hint: 'Students waiting to collect books' },
                  { label: 'Pending returns', value: returnRequests.length, hint: 'Books ready for shelf placement' },
                  { label: 'Station mode', value: 'Locked', hint: 'Back navigation is blocked until closure' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/40 bg-muted/20 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{item.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.hint}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setActiveTab('issue')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'issue' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                <BookOpen className="h-4 w-4" /> Issue Requests ({issueRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('return')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'return' ? 'bg-warning text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                <RotateCcw className="h-4 w-4" /> Return Requests ({returnRequests.length})
              </button>
            </div>

            {/* Requests */}
            <div className="space-y-3">
              {(activeTab === 'issue' ? issueRequests : returnRequests).map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card flex flex-col gap-4 p-5 md:flex-row md:items-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 text-2xl">{req.bookEmoji}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{req.bookTitle}</h3>
                    <p className="text-sm text-muted-foreground">{req.bookAuthor}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Student: <span className="text-foreground">{req.studentName}</span> ({req.studentId})
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {activeTab === 'issue'
                        ? 'Flow: verify student → guide shelf pickup → verify book → choose duration → complete issue'
                        : 'Flow: verify student → verify book → guide shelf return → complete return'}
                    </p>
                  </div>
                  <Button onClick={() => startProcess(req)} className="bg-primary text-primary-foreground md:min-w-[140px]">
                    Process <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>

            {(activeTab === 'issue' ? issueRequests : returnRequests).length === 0 && (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-success/50" />
                <p className="font-medium text-foreground">All caught up!</p>
                <p className="text-sm text-muted-foreground">No pending {activeTab} requests</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Close Vigyaan Confirmation */}
      <AnimatePresence>
        {showCloseConfirm && !showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-card glow w-full max-w-sm p-6 text-center"
            >
              <Shield className="mx-auto mb-3 h-10 w-10 text-warning" />
              <h3 className="text-lg font-semibold text-foreground">Close Vigyaan?</h3>
              <p className="mt-2 text-sm text-muted-foreground">Admin verification is required to close the digital library. Please scan your admin ID card.</p>
              <div className="mt-4 flex gap-3">
                <Button variant="outline" onClick={() => setShowCloseConfirm(false)} className="flex-1 border-border/50">Cancel</Button>
                <Button onClick={() => openScannerFor('close-admin')} className="flex-1 bg-destructive text-destructive-foreground">
                  Verify & Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScanner && !processingRequest && (
          <QRScanner
            onScan={handleScan}
            onClose={() => { setShowScanner(false); setShowCloseConfirm(false); }}
            title="Admin Verification"
            description="Scan your admin ID card QR code to verify"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VigyaanDigitalLibrary;
