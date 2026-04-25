import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, BookOpen, Brain, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/store/authStore';
import useBookStore from '@/store/bookStore';
import useRequestStore from '@/store/requestStore';
import BookDetailsModal from '@/components/BookDetailsModal';
import AIAssistant from '@/components/AIAssistant';
import { toast } from 'sonner';

const LibraryView = () => {
  const { user } = useAuthStore();
  const { books } = useBookStore();
  const { raiseIssueRequest, getStudentRequests } = useRequestStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAI, setShowAI] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const categories = ['All', ...new Set(books.map((b) => b.category))];

  const filteredBooks = useMemo(() => {
    let result = books;
    if (activeCategory !== 'All') result = result.filter((b) => b.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    return result;
  }, [books, activeCategory, search]);

  const pendingRequests = getStudentRequests(user?.studentId);
  const isIssuePending = (bookId) => pendingRequests.some((r) => r.bookId === bookId && r.type === 'issue');

  const handleIssueRequest = (book) => {
    if (!book.available) {
      toast.error('This book is currently not available');
      return;
    }
    if (isIssuePending(book.id)) {
      toast.info('You already have a pending issue request for this book');
      return;
    }
    raiseIssueRequest({
      studentId: user?.studentId,
      studentName: user?.fullName,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookEmoji: book.emoji,
      bookShelf: book.shelf,
      bookIsbn: book.isbn,
    });
    toast.success('Issue request raised! Visit the library to complete the process.');
  };

  return (
    <div className="min-h-screen px-4 pb-12 pt-24">
      <div className="container mx-auto max-w-6xl">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <MapPin className="h-3 w-3" /> Graphic Era Deemed to be University
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            <span className="gradient-text">Vigyaan Library</span>
          </h1>
          <p className="text-sm text-muted-foreground">Browse books, get AI recommendations, and raise issue requests</p>
        </motion.div>

        {/* Search + AI Toggle */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books by title or author..."
              className="bg-muted/30 pl-10 border-border/50"
            />
          </div>
          <Button
            variant={showAI ? 'default' : 'outline'}
            onClick={() => setShowAI(!showAI)}
            className={showAI ? 'bg-primary text-primary-foreground' : 'border-primary/50 text-primary'}
          >
            <Brain className="mr-2 h-4 w-4" /> Ask AI
          </Button>
        </motion.div>

        {/* Categories */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* AI Panel */}
        <AnimatePresence>
          {showAI && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
              <AIAssistant books={books} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Book Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-card overflow-hidden"
            >
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted/50 text-3xl">{book.emoji}</div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${book.available ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
                    {book.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <h3 className="mb-1 font-semibold text-foreground line-clamp-1">{book.title}</h3>
                <p className="mb-2 text-sm text-muted-foreground">{book.author}</p>
                <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted/50 px-2 py-0.5">{book.category}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{book.shelf}</span>
                  <span>{book.availableCopies}/{book.totalCopies} copies</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-border/50 text-muted-foreground"
                    onClick={() => setSelectedBook(book)}
                  >
                    <Info className="mr-1 h-3 w-3" /> About
                  </Button>
                  {isIssuePending(book.id) ? (
                    <span className="flex flex-1 items-center justify-center rounded-lg bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
                      Request Pending
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleIssueRequest(book)}
                      disabled={!book.available}
                      className="flex-1 bg-primary text-primary-foreground disabled:opacity-50"
                    >
                      Raise Issue
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="font-medium text-foreground">No books found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or category</p>
          </div>
        )}
      </div>

      {/* Book Details Modal */}
      <AnimatePresence>
        {selectedBook && (
          <BookDetailsModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onIssueRequest={() => {
              handleIssueRequest(selectedBook);
              setSelectedBook(null);
            }}
            isIssuePending={isIssuePending(selectedBook.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LibraryView;
