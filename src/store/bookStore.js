import { create } from 'zustand';

const dummyBooks = [
  { id: 1, title: 'Deep Learning', author: 'Ian Goodfellow', category: 'AI/ML', isbn: '978-0262035613', available: true, shelf: 'B-12', emoji: '🧠', totalCopies: 5, availableCopies: 3, description: 'A comprehensive textbook on deep learning covering mathematical and conceptual background, deep learning techniques used in industry, and research perspectives.' },
  { id: 2, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Algorithms', isbn: '978-0262033848', available: true, shelf: 'A-03', emoji: '📐', totalCopies: 8, availableCopies: 5, description: 'The leading textbook on computer algorithms, providing a comprehensive introduction to the modern study of algorithms.' },
  { id: 3, title: 'Design Patterns', author: 'Gang of Four', category: 'Software Engineering', isbn: '978-0201633610', available: true, shelf: 'C-07', emoji: '🏗️', totalCopies: 4, availableCopies: 2, description: 'Capturing a wealth of experience about the design of object-oriented software, offering solutions to common software design problems.' },
  { id: 4, title: 'Clean Code', author: 'Robert C. Martin', category: 'Software Engineering', isbn: '978-0132350884', available: false, shelf: 'A-05', emoji: '💻', totalCopies: 6, availableCopies: 0, description: 'A handbook of agile software craftsmanship. Learn to write clean, maintainable code that is easy to understand and modify.' },
  { id: 5, title: 'Pattern Recognition & ML', author: 'Christopher Bishop', category: 'AI/ML', isbn: '978-0387310732', available: true, shelf: 'B-08', emoji: '📊', totalCopies: 3, availableCopies: 1, description: 'The first textbook on pattern recognition to present the Bayesian viewpoint, offering comprehensive coverage of the subject.' },
  { id: 6, title: 'AI: A Modern Approach', author: 'Stuart Russell', category: 'AI/ML', isbn: '978-0136042594', available: true, shelf: 'C-03', emoji: '🤖', totalCopies: 7, availableCopies: 4, description: 'The most widely used textbook on artificial intelligence, used in over 1500 universities worldwide.' },
  { id: 7, title: 'Computer Networks', author: 'Andrew Tanenbaum', category: 'Networking', isbn: '978-0132126953', available: true, shelf: 'D-01', emoji: '🌐', totalCopies: 5, availableCopies: 3, description: 'A comprehensive guide to computer networking concepts, protocols, and architectures used in modern networks.' },
  { id: 8, title: 'Operating System Concepts', author: 'Silberschatz', category: 'Operating Systems', isbn: '978-1118063330', available: true, shelf: 'D-05', emoji: '⚙️', totalCopies: 6, availableCopies: 4, description: 'Covers the fundamental concepts of operating systems, including process management, memory management, and file systems.' },
  { id: 9, title: 'Database System Concepts', author: 'Avi Silberschatz', category: 'Database', isbn: '978-0073523323', available: false, shelf: 'E-02', emoji: '🗄️', totalCopies: 4, availableCopies: 0, description: 'A comprehensive introduction to database systems covering relational model, SQL, database design, and transaction management.' },
  { id: 10, title: 'Hands-On Machine Learning', author: 'Aurélien Géron', category: 'AI/ML', isbn: '978-1492032649', available: true, shelf: 'B-15', emoji: '🔬', totalCopies: 5, availableCopies: 2, description: 'Using concrete examples, minimal theory, and production-ready Python frameworks, this book helps you gain practical understanding of ML.' },
  { id: 11, title: 'The Pragmatic Programmer', author: 'David Thomas', category: 'Software Engineering', isbn: '978-0135957059', available: true, shelf: 'A-10', emoji: '📘', totalCopies: 3, availableCopies: 2, description: 'A classic book full of practical advice for programmers covering topics from career development to architectural techniques.' },
  { id: 12, title: 'Data Structures Using C', author: 'Reema Thareja', category: 'Data Structures', isbn: '978-0198099307', available: true, shelf: 'A-01', emoji: '🔗', totalCopies: 10, availableCopies: 7, description: 'A comprehensive textbook on data structures including arrays, linked lists, trees, graphs, sorting, and searching algorithms.' },
];

const useBookStore = create((set, get) => ({
  books: dummyBooks,

  // Get all books
  getBooks: () => get().books,

  // Get book by ID
  getBookById: (id) => get().books.find((b) => b.id === id),

  // Get categories
  getCategories: () => [...new Set(get().books.map((b) => b.category))],

  // Search books
  searchBooks: (query) => {
    const q = query.toLowerCase();
    return get().books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  },

  // Add a book (admin)
  addBook: (bookData) => {
    const newBook = {
      id: Date.now(),
      ...bookData,
      totalCopies: bookData.totalCopies || 1,
      availableCopies: bookData.availableCopies || 1,
      available: true,
    };
    set((state) => ({ books: [...state.books, newBook] }));
    return newBook;
  },

  // Update a book (admin)
  updateBook: (bookId, updates) => {
    set((state) => ({
      books: state.books.map((b) => (b.id === bookId ? { ...b, ...updates } : b)),
    }));
  },

  // Delete a book (admin)
  deleteBook: (bookId) => {
    set((state) => ({
      books: state.books.filter((b) => b.id !== bookId),
    }));
  },

  // Issue a book (decrement available copies)
  issueBook: (bookId) => {
    set((state) => ({
      books: state.books.map((b) =>
        b.id === bookId
          ? {
              ...b,
              availableCopies: Math.max(0, b.availableCopies - 1),
              available: b.availableCopies - 1 > 0,
            }
          : b
      ),
    }));
  },

  // Return a book (increment available copies)
  returnBook: (bookId) => {
    set((state) => ({
      books: state.books.map((b) =>
        b.id === bookId
          ? {
              ...b,
              availableCopies: Math.min(b.totalCopies, b.availableCopies + 1),
              available: true,
            }
          : b
      ),
    }));
  },
}));

export default useBookStore;
