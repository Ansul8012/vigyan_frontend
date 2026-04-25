import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, MapPin, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useBookStore from '@/store/bookStore';

const AdminLibraryView = () => {
  const navigate = useNavigate();
  const { books } = useBookStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(books.map((b) => b.category))];

  const filtered = useMemo(() => {
    let result = books;
    if (activeCategory !== 'All') result = result.filter((b) => b.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    return result;
  }, [books, activeCategory, search]);

  return (
    <div className="min-h-screen px-4 pb-12 pt-24">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Library Overview</h1>
          </div>

          <p className="mb-6 text-sm text-muted-foreground">View all books in the catalog with their availability and issue status. Admin view only — no issue or return actions.</p>

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..." className="bg-muted/30 pl-10 border-border/50" />
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
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
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((book, i) => {
            const issuedCount = book.totalCopies - book.availableCopies;
            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 text-2xl">{book.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                  <span className="rounded-full bg-muted/50 px-2 py-0.5">{book.category}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {book.shelf}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/20 p-2">
                    <p className="text-lg font-bold text-foreground">{book.totalCopies}</p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                  </div>
                  <div className="rounded-lg bg-success/10 p-2">
                    <p className="text-lg font-bold text-success">{book.availableCopies}</p>
                    <p className="text-[10px] text-muted-foreground">Available</p>
                  </div>
                  <div className="rounded-lg bg-warning/10 p-2">
                    <p className="text-lg font-bold text-warning">{issuedCount}</p>
                    <p className="text-[10px] text-muted-foreground">Issued</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">No books found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLibraryView;
