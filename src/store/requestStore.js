import { create } from 'zustand';

// Dummy issue/return requests
const dummyRequests = [
  {
    id: 'req-1',
    type: 'issue',
    studentId: 'STU2024001',
    studentName: 'Arjun Sharma',
    bookId: 1,
    bookTitle: 'Deep Learning',
    bookAuthor: 'Ian Goodfellow',
    bookEmoji: '🧠',
    bookShelf: 'B-12',
    bookIsbn: '978-0262035613',
    status: 'pending', // pending | fulfilled
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req-2',
    type: 'return',
    studentId: 'STU2024002',
    studentName: 'Priya Patel',
    bookId: 3,
    bookTitle: 'Clean Code',
    bookAuthor: 'Robert C. Martin',
    bookEmoji: '💻',
    bookShelf: 'A-05',
    bookIsbn: '978-0132350884',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req-3',
    type: 'issue',
    studentId: 'STU2024003',
    studentName: 'Rahul Kumar',
    bookId: 6,
    bookTitle: 'AI: A Modern Approach',
    bookAuthor: 'Stuart Russell',
    bookEmoji: '🤖',
    bookShelf: 'C-03',
    bookIsbn: '978-0136042594',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

const useRequestStore = create((set, get) => ({
  requests: dummyRequests,

  // Get pending requests
  getPendingRequests: () => get().requests.filter((r) => r.status === 'pending'),
  getPendingIssueRequests: () => get().requests.filter((r) => r.status === 'pending' && r.type === 'issue'),
  getPendingReturnRequests: () => get().requests.filter((r) => r.status === 'pending' && r.type === 'return'),

  // Student raises an issue request
  raiseIssueRequest: (data) => {
    const newRequest = {
      id: 'req-' + Date.now(),
      type: 'issue',
      studentId: data.studentId,
      studentName: data.studentName,
      bookId: data.bookId,
      bookTitle: data.bookTitle,
      bookAuthor: data.bookAuthor,
      bookEmoji: data.bookEmoji,
      bookShelf: data.bookShelf,
      bookIsbn: data.bookIsbn,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ requests: [...state.requests, newRequest] }));
    return newRequest;
  },

  // Student raises a return request
  raiseReturnRequest: (data) => {
    const newRequest = {
      id: 'req-' + Date.now(),
      type: 'return',
      studentId: data.studentId,
      studentName: data.studentName,
      bookId: data.bookId,
      bookTitle: data.bookTitle,
      bookAuthor: data.bookAuthor,
      bookEmoji: data.bookEmoji,
      bookShelf: data.bookShelf,
      bookIsbn: data.bookIsbn,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ requests: [...state.requests, newRequest] }));
    return newRequest;
  },

  // Admin fulfills a request (removes it)
  fulfillRequest: (requestId) => {
    set((state) => ({
      requests: state.requests.filter((r) => r.id !== requestId),
    }));
  },

  // Student cancels a pending request
  cancelRequest: (requestId) => {
    // TODO: Replace with API call — DELETE /api/requests/:requestId
    set((state) => ({
      requests: state.requests.filter((r) => r.id !== requestId),
    }));
  },

  // Get requests for a specific student
  getStudentRequests: (studentId) => get().requests.filter((r) => r.studentId === studentId && r.status === 'pending'),
}));

export default useRequestStore;
