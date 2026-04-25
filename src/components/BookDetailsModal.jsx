import { motion } from 'framer-motion';
import { X, MapPin, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BookDetailsModal = ({ book, onClose, onIssueRequest, isIssuePending }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card glow w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-4xl">{book.emoji}</div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{book.title}</h2>
            <p className="text-sm text-muted-foreground">by {book.author}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground">{book.category}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${book.available ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
                {book.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4 rounded-lg bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{book.description}</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">ISBN</p>
            <p className="text-sm font-medium text-foreground">{book.isbn}</p>
          </div>
          <div className="rounded-lg bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Shelf Location</p>
            <p className="text-sm font-medium text-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {book.shelf}</p>
          </div>
          <div className="rounded-lg bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Total Copies</p>
            <p className="text-sm font-medium text-foreground">{book.totalCopies}</p>
          </div>
          <div className="rounded-lg bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Available Copies</p>
            <p className="text-sm font-medium text-foreground">{book.availableCopies}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 border-border/50 text-muted-foreground">
            Close
          </Button>
          {isIssuePending ? (
            <span className="flex flex-1 items-center justify-center rounded-lg bg-warning/10 px-3 py-2 text-sm font-medium text-warning">
              Request Pending
            </span>
          ) : (
            <Button
              onClick={onIssueRequest}
              disabled={!book.available}
              className="flex-1 bg-primary text-primary-foreground disabled:opacity-50"
            >
              <BookOpen className="mr-2 h-4 w-4" /> Raise Issue Request
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookDetailsModal;
