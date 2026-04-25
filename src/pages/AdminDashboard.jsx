import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Database, BarChart3, Library, ArrowRight, Zap, AlertTriangle, Clock3 } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useRequestStore from '@/store/requestStore';
import useVigyaanStore from '@/store/vigyaanStore';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { getPendingRequests } = useRequestStore();
  const { isOpen } = useVigyaanStore();

  const pendingCount = getPendingRequests().length;

  const overdueReturns = [
    // TODO: Replace with API call — GET /api/admin/overdue-returns
    { id: 'ovr-1', bookTitle: 'Pattern Recognition & ML', studentName: 'Aman Verma', studentId: 'STU2024008', daysLate: 7, dueDate: '2026-04-05' },
    { id: 'ovr-2', bookTitle: 'Database System Concepts', studentName: 'Sneha Rawat', studentId: 'STU2024012', daysLate: 4, dueDate: '2026-04-08' },
    { id: 'ovr-3', bookTitle: 'Clean Code', studentName: 'Rohit Negi', studentId: 'STU2024004', daysLate: 11, dueDate: '2026-04-01' },
  ];

  const stats = [
    { label: 'Total Books', value: '12,450', icon: BookOpen, color: 'primary' },
    { label: 'Active Students', value: '5,230', icon: Users, color: 'info' },
    { label: 'Queries Left Today', value: String(pendingCount), icon: BarChart3, color: 'warning' },
    { label: 'Overdue Returns', value: String(overdueReturns.length), icon: AlertTriangle, color: 'destructive' },
  ];

  const actions = [
    { label: 'Open Vigyaan', description: 'Launch the digital library to process issue & return requests', icon: Zap, color: 'primary', to: '/vigyaan' },
    { label: 'Manage Books', description: 'Add, update, or remove books from the catalog', icon: Database, color: 'info', to: '/admin/books' },
    { label: 'Student Records', description: 'View and manage all registered students', icon: Users, color: 'success', to: '/admin/students' },
    { label: 'View Library', description: 'Browse all books and their issue/return status', icon: Library, color: 'warning', to: '/admin/library' },
  ];

  const colorMap = {
    primary: 'text-primary bg-primary/10 border-primary/30',
    info: 'text-info bg-info/10 border-info/30',
    success: 'text-success bg-success/10 border-success/30',
    warning: 'text-warning bg-warning/10 border-warning/30',
    destructive: 'text-destructive bg-destructive/10 border-destructive/30',
  };

  return (
    <div className="min-h-screen px-4 pb-12 pt-24">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, <span className="gradient-text">{user?.fullName || 'Admin'}</span>
          </h1>
          <p className="text-muted-foreground">{user?.department} • {user?.staffId}</p>
          {isOpen && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-success">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Vigyaan is Open
            </span>
          )}
        </motion.div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {actions.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <Link
                to={a.to}
                className="glass-card group flex items-center gap-4 p-5 text-left transition-colors hover:border-primary/50"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${colorMap[a.color]}`}>
                  <a.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{a.label}</h3>
                  <p className="text-sm text-muted-foreground">{a.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Overdue Returns Overview</h2>
              <p className="text-sm text-muted-foreground">Read-only visibility into delayed returns, who issued them, and how many days they are overdue.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" /> {overdueReturns.length} overdue books
            </span>
          </div>

          <div className="space-y-3">
            {overdueReturns.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.08 }}
                className="glass-card flex flex-col gap-4 p-5 lg:flex-row lg:items-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 text-destructive">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.bookTitle}</h3>
                  <p className="text-sm text-muted-foreground">Issued by {item.studentName} ({item.studentId})</p>
                </div>
                <div className="grid gap-2 text-sm sm:grid-cols-2 lg:min-w-[260px]">
                  <div className="rounded-xl bg-muted/30 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Due date</p>
                    <p className="font-medium text-foreground">{item.dueDate}</p>
                  </div>
                  <div className="rounded-xl bg-destructive/10 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Delay</p>
                    <p className="font-medium text-destructive">{item.daysLate} days overdue</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
