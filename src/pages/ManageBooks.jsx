import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Edit3, Search, QrCode, BookOpen, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useBookStore from '@/store/bookStore';
import QRScanner from '@/components/QRScanner';
import { toast } from 'sonner';
import { z } from 'zod';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category/Genre is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  shelf: z.string().min(1, 'Shelf location is required'),
  emoji: z.string().min(1, 'Emoji/cover is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  totalCopies: z.number().min(1, 'At least 1 copy required'),
});

const formFields = [
  { name: 'title', label: 'Book Title', placeholder: 'e.g., Deep Learning' },
  { name: 'author', label: 'Author', placeholder: 'e.g., Ian Goodfellow' },
  { name: 'category', label: 'Category / Genre', placeholder: 'e.g., AI/ML' },
  { name: 'isbn', label: 'ISBN', placeholder: 'e.g., 978-0262035613' },
  { name: 'shelf', label: 'Shelf Location', placeholder: 'e.g., B-12' },
  { name: 'emoji', label: 'Emoji Cover', placeholder: 'e.g., 🧠' },
];

const ManageBooks = () => {
  const navigate = useNavigate();
  const { books, addBook, updateBook, deleteBook } = useBookStore();
  const [view, setView] = useState('list');
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({
    title: '', author: '', category: '', isbn: '', shelf: '', emoji: '📚', description: '', totalCopies: 1, qrCode: '',
  });

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setForm({ title: '', author: '', category: '', isbn: '', shelf: '', emoji: '📚', description: '', totalCopies: 1, qrCode: '' });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'totalCopies' ? parseInt(value) || 0 : value,
    }));
  };

  const validateForm = () => {
    const result = bookSchema.safeParse({ ...form, totalCopies: parseInt(form.totalCopies) || 0 });
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => { fieldErrors[err.path[0]] = err.message; });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  // TODO: Replace with API call — POST /api/admin/books
  const handleAdd = () => {
    if (!validateForm()) return;
    if (!form.qrCode) {
      toast.error('Please scan the book QR code');
      return;
    }
    addBook({ ...form, availableCopies: form.totalCopies, available: true });
    toast.success('Book added successfully!');
    resetForm();
    setView('list');
  };

  // TODO: Replace with API call — PUT /api/admin/books/:id
  const handleUpdate = () => {
    if (!validateForm()) return;
    updateBook(editingBook.id, form);
    toast.success('Book updated successfully!');
    resetForm();
    setEditingBook(null);
    setView('list');
  };

  // TODO: Replace with API call — DELETE /api/admin/books/:id
  const confirmDeleteBook = () => {
    if (!deleteConfirm) return;
    deleteBook(deleteConfirm.id);
    toast.success('Book removed from catalog');
    setDeleteConfirm(null);
  };

  const startEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      shelf: book.shelf,
      emoji: book.emoji,
      description: book.description || '',
      totalCopies: book.totalCopies,
      qrCode: book.qrCode || 'existing',
    });
    setEditingBook(book);
    setView('edit');
  };

  const handleQRScan = (data) => {
    setForm((prev) => ({ ...prev, qrCode: data }));
    setShowQR(false);
    toast.success('QR code scanned successfully!');
  };

  const goBackToList = () => {
    setView('list');
    resetForm();
    setEditingBook(null);
  };

  const isEdit = view === 'edit';
  const isFormView = view === 'add' || view === 'edit';

  return (
    <div className="min-h-screen px-4 pb-12 pt-24">
      <div className="container mx-auto max-w-5xl">
        {/* List View */}
        {view === 'list' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Dashboard
                </Button>
                <h1 className="text-2xl font-bold text-foreground">Manage Books</h1>
              </div>
              <Button onClick={() => { resetForm(); setView('add'); }} className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" /> Add Book
              </Button>
            </div>

            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books..."
                className="bg-muted/30 pl-10 border-border/50"
              />
            </div>

            <div className="space-y-3">
              {filteredBooks.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card flex items-center gap-4 p-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 text-2xl">{book.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author} • {book.category} • Shelf: {book.shelf}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {book.availableCopies}/{book.totalCopies} copies
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(book)} className="text-primary hover:bg-primary/10">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(book)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredBooks.length === 0 && (
              <div className="py-12 text-center">
                <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-muted-foreground">No books found</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Add / Edit Form — rendered inline, NOT as a child component */}
        {isFormView && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={goBackToList}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <h2 className="text-xl font-semibold text-foreground">{isEdit ? 'Edit Book' : 'Add New Book'}</h2>
            </div>
            <div className="glass-card p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {formFields.map((field) => (
                  <div key={field.name}>
                    <Label className="text-sm text-muted-foreground">{field.label}</Label>
                    <Input name={field.name} value={form[field.name]} onChange={handleChange} placeholder={field.placeholder} className="mt-1 bg-muted/30 border-border/50" />
                    {errors[field.name] && <p className="mt-1 text-xs text-destructive">{errors[field.name]}</p>}
                  </div>
                ))}
                <div>
                  <Label className="text-sm text-muted-foreground">Total Copies</Label>
                  <Input name="totalCopies" type="number" value={form.totalCopies} onChange={handleChange} min="1" className="mt-1 bg-muted/30 border-border/50" />
                  {errors.totalCopies && <p className="mt-1 text-xs text-destructive">{errors.totalCopies}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm text-muted-foreground">Description</Label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="A short description of the book..."
                    rows={3}
                    className="mt-1 w-full rounded-lg bg-muted/30 border border-border/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Button variant="outline" onClick={() => setShowQR(true)} className="border-primary/50 text-primary">
                  <QrCode className="mr-2 h-4 w-4" />
                  {form.qrCode ? 'QR Scanned ✓' : 'Scan Book QR Code'}
                </Button>
                {form.qrCode && <span className="text-xs text-success">QR code captured</span>}
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={goBackToList} className="border-border/50 text-muted-foreground">
                  Cancel
                </Button>
                <Button onClick={isEdit ? handleUpdate : handleAdd} className="bg-primary text-primary-foreground">
                  <Save className="mr-2 h-4 w-4" />
                  {isEdit ? 'Update Book' : 'Add Book'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* QR Scanner */}
      <AnimatePresence>
        {showQR && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowQR(false)}
            title="Scan Book QR Code"
            description="Scan the QR code on the book to store in database"
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card glow w-full max-w-sm p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-7 w-7 text-destructive" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Delete Book?</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Are you sure you want to delete <strong className="text-foreground">"{deleteConfirm.title}"</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 border-border/50">
                  Cancel
                </Button>
                <Button onClick={confirmDeleteBook} className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageBooks;
