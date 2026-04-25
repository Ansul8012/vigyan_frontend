import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Users, Eye, Trash2, X, BookOpen, Mail, GraduationCap, CreditCard, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// TODO: Replace with API call — GET /api/admin/students
const dummyStudents = [
  { id: '1', studentId: 'STU2024001', fullName: 'Arjun Sharma', email: 'arjun@geu.ac.in', course: 'B.Tech CSE', completionYear: '2026', issuedBooks: 2, booksToReturn: 1, idCardUrl: null },
  { id: '2', studentId: 'STU2024002', fullName: 'Priya Patel', email: 'priya@geu.ac.in', course: 'B.Tech IT', completionYear: '2026', issuedBooks: 1, booksToReturn: 0, idCardUrl: null },
  { id: '3', studentId: 'STU2024003', fullName: 'Rahul Kumar', email: 'rahul@geu.ac.in', course: 'B.Tech ECE', completionYear: '2027', issuedBooks: 3, booksToReturn: 2, idCardUrl: null },
  { id: '4', studentId: 'STU2024004', fullName: 'Neha Singh', email: 'neha@geu.ac.in', course: 'BCA', completionYear: '2025', issuedBooks: 0, booksToReturn: 0, idCardUrl: null },
  { id: '5', studentId: 'STU2024005', fullName: 'Vikram Thapa', email: 'vikram@geu.ac.in', course: 'B.Tech CSE', completionYear: '2026', issuedBooks: 4, booksToReturn: 1, idCardUrl: null },
];

const ManageStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState(dummyStudents);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // student object to confirm deletion

  const filtered = students.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  // TODO: Replace with API call — DELETE /api/admin/students/:id
  const confirmDelete = () => {
    if (!deleteConfirm) return;
    setStudents((prev) => prev.filter((s) => s.id !== deleteConfirm.id));
    toast.success(`Access revoked for ${deleteConfirm.fullName}`);
    if (selectedStudent?.id === deleteConfirm.id) setSelectedStudent(null);
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen px-4 pb-12 pt-24">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Student Records</h1>
            <span className="rounded-full bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground">{students.length} students</span>
          </div>

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ID, or email..." className="bg-muted/30 pl-10 border-border/50" />
          </div>

          <div className="space-y-3">
            {filtered.map((student, i) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card flex items-center gap-4 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {student.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{student.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{student.studentId} • {student.course}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {student.issuedBooks} issued</span>
                  {student.booksToReturn > 0 && (
                    <span className="flex items-center gap-1 text-warning">{student.booksToReturn} to return</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student)} className="text-primary hover:bg-primary/10">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(student)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-muted-foreground">No students found</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Student Details Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-card glow w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Student Details</h2>
                <button onClick={() => setSelectedStudent(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {selectedStudent.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedStudent.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStudent.studentId}</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Mail, label: 'Email', value: selectedStudent.email },
                  { icon: GraduationCap, label: 'Course', value: selectedStudent.course },
                  { icon: CreditCard, label: 'Completion Year', value: selectedStudent.completionYear },
                  { icon: BookOpen, label: 'Books Issued', value: selectedStudent.issuedBooks },
                  { icon: BookOpen, label: 'Books to Return', value: selectedStudent.booksToReturn },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-lg bg-muted/20 p-3">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <Button variant="outline" onClick={() => setSelectedStudent(null)} className="flex-1 border-border/50">Close</Button>
                <Button
                  variant="outline"
                  onClick={() => { setDeleteConfirm(selectedStudent); }}
                  className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Revoke Access
                </Button>
              </div>
            </motion.div>
          </motion.div>
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
              <h3 className="mb-2 text-lg font-semibold text-foreground">Revoke Access?</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Are you sure you want to revoke access for <strong className="text-foreground">{deleteConfirm.fullName}</strong>? This will remove the student from Vigyaan.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 border-border/50">
                  Cancel
                </Button>
                <Button onClick={confirmDelete} className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  <Trash2 className="mr-2 h-4 w-4" /> Revoke
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageStudents;
