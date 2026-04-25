import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, AlertTriangle, Library, CalendarClock, ArrowRight, BookMarked, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';
import useRequestStore from '@/store/requestStore';
import { toast } from 'sonner';

const MONTHLY_ISSUE_LIMIT = 5;

const dummyIssuedBooks = [
  { id: 1, title: 'Deep Learning', author: 'Ian Goodfellow', emoji: '🧠', status: 'issued', dueDate: '2026-04-15', shelf: 'B-12', isbn: '978-0262035613' },
  { id: 2, title: 'Pattern Recognition & ML', author: 'Christopher Bishop', emoji: '📊', status: 'overdue', dueDate: '2026-04-05', shelf: 'B-08', isbn: '978-0387310732' },
];

const getDaysRemaining = (dueDate) => {
  if (!dueDate) return null;
  return Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
};

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { raiseReturnRequest, getStudentRequests, cancelRequest } = useRequestStore();
  const [returnRequested, setReturnRequested] = useState({});

  const activeBooks = dummyIssuedBooks.filter((b) => b.status === 'issued' || b.status === 'overdue');
  const overdueCount = activeBooks.filter((b) => b.status === 'overdue').length;
  const issuedThisMonth = activeBooks.length;
  const remainingIssues = Math.max(0, MONTHLY_ISSUE_LIMIT - issuedThisMonth);

  const pendingRequests = getStudentRequests(user?.studentId);

  const handleReturnRequest = (book) => {
    raiseReturnRequest({
      studentId: user?.studentId,
      studentName: user?.fullName,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookEmoji: book.emoji,
      bookShelf: book.shelf,
      bookIsbn: book.isbn,
    });
    setReturnRequested((prev) => ({ ...prev, [book.id]: true }));
    toast.success('Return request raised successfully!');
  };

  const handleCancelRequest = (requestId, bookId) => {
    // TODO: Replace with API call — DELETE /api/requests/:requestId
    cancelRequest(requestId);
    setReturnRequested((prev) => {
      const next = { ...prev };
      delete next[bookId];
      return next;
    });
    toast.success('Request cancelled successfully!');
  };

  const isReturnPending = (bookId) => {
    return returnRequested[bookId] || pendingRequests.some((r) => r.bookId === bookId && r.type === 'return');
  };

  const stats = [
    { label: 'Books Issued', value: issuedThisMonth, icon: BookOpen, color: 'primary' },
    { label: 'Overdue', value: overdueCount, icon: AlertTriangle, color: 'warning' },
    { label: 'Can Issue This Month', value: remainingIssues, icon: BookMarked, color: 'success' },
  ];

  const colorMap = {
    primary: 'text-primary border-primary/30 bg-primary/10',
    warning: 'text-warning border-warning/30 bg-warning/10',
    success: 'text-success border-success/30 bg-success/10',
  };

  const statusBadge = {
    issued: 'bg-primary/20 text-primary',
    overdue: 'bg-destructive/20 text-destructive',
  };

  return (
    <div className="min-h-screen px-4 pb-12 pt-24">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, <span className="gradient-text">{user?.fullName || 'Student'}</span>
          </h1>
          <p className="text-muted-foreground">{user?.course} • {user?.studentId}</p>
        </motion.div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${colorMap[s.color]}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {[
            { to: '/library', label: 'View Library', icon: Library, desc: 'Browse & raise issue requests' },
            { to: '/slots', label: 'Book a Slot', icon: CalendarClock, desc: 'Reserve a library seat' },
          ].map((a, i) => (
            <motion.div key={a.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
              <Link to={a.to} className="glass-card group flex items-center justify-between p-5 transition-colors hover:border-primary/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <a.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{a.label}</span>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Pending Requests</h2>
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req.id} className="glass-card flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 text-xl">{req.bookEmoji}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{req.bookTitle}</h3>
                    <p className="text-xs text-muted-foreground">{req.bookAuthor}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${req.type === 'issue' ? 'bg-primary/20 text-primary' : 'bg-warning/20 text-warning'}`}>
                      {req.type === 'issue' ? 'Issue Request' : 'Return Request'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCancelRequest(req.id, req.bookId)}
                      className="h-8 px-3 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    >
                      Cancel Request
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Active Books */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Your Books</h2>
          {activeBooks.length === 0 ? (
            <div className="glass-card flex flex-col items-center justify-center p-12 text-center">
              <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="mb-1 font-medium text-foreground">No books issued currently</p>
              <p className="mb-4 text-sm text-muted-foreground">Browse the library to find your next read</p>
              <Button asChild className="bg-primary text-primary-foreground">
                <Link to="/library">Browse Library</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeBooks.map((book, i) => {
                const days = getDaysRemaining(book.dueDate);
                const daysColor = days !== null ? (days < 0 ? 'text-destructive' : days <= 3 ? 'text-warning' : 'text-muted-foreground') : 'text-muted-foreground';
                const pending = isReturnPending(book.id);

                return (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="glass-card flex items-center gap-4 p-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 text-2xl">{book.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        {days !== null && (
                          <p className={`text-sm font-medium ${daysColor}`}>
                            {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`}
                          </p>
                        )}
                        {book.dueDate && <p className="text-xs text-muted-foreground">{book.dueDate}</p>}
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadge[book.status]}`}>
                          {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                        </span>
                      </div>
                      {pending ? (
                        <span className="flex items-center gap-1 rounded-lg bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
                          <CheckCircle2 className="h-3 w-3" /> Requested
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-warning/50 text-warning hover:bg-warning/10"
                          onClick={() => handleReturnRequest(book)}
                        >
                          <RotateCcw className="mr-1 h-3 w-3" /> Return
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
