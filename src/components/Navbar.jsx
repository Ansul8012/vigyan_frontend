import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, User, Shield, LogOut, Menu, X, LayoutDashboard, Library, CalendarClock, Database, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const userInitial = user?.fullName?.charAt(0)?.toUpperCase() || '?';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ rotate: 15 }} className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </motion.div>
          <span className="gradient-text text-xl font-bold">Vigyaan</span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link to="/auth/student"><User className="mr-2 h-4 w-4" />Login as Student</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="border-primary/50 text-primary hover:bg-primary/10">
                <Link to="/auth/admin"><Shield className="mr-2 h-4 w-4" />Login as Admin</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />Dashboard
                </Link>
              </Button>
              {user?.role === 'student' && (
                <>
                  <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                    <Link to="/library"><Library className="mr-2 h-4 w-4" />Library</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                    <Link to="/slots"><CalendarClock className="mr-2 h-4 w-4" />Book Slot</Link>
                  </Button>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                    <Link to="/vigyaan"><Zap className="mr-2 h-4 w-4" />Vigyaan</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                    <Link to="/admin/library"><Library className="mr-2 h-4 w-4" />Library</Link>
                  </Button>
                </>
              )}
              <div className="flex items-center gap-2 rounded-full border border-border/50 px-3 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                  {userInitial}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-foreground">{user?.fullName}</span>
                  <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{user?.role}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-muted-foreground md:hidden">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/auth/student" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50"><User className="h-4 w-4" />Login as Student</Link>
                  <Link to="/auth/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-primary hover:bg-primary/10"><Shield className="h-4 w-4" />Login as Admin</Link>
                </>
              ) : (
                <>
                  <div className="mb-2 flex items-center gap-2 px-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">{userInitial}</div>
                    <div><p className="text-sm font-medium text-foreground">{user?.fullName}</p><p className="text-xs text-muted-foreground">{user?.role}</p></div>
                  </div>
                  <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50"><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
                  {user?.role === 'student' && (
                    <>
                      <Link to="/library" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50"><Library className="h-4 w-4" />Library</Link>
                      <Link to="/slots" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50"><CalendarClock className="h-4 w-4" />Book Slot</Link>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <>
                      <Link to="/vigyaan" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50"><Zap className="h-4 w-4" />Vigyaan</Link>
                      <Link to="/admin/books" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50"><Database className="h-4 w-4" />Manage Books</Link>
                      <Link to="/admin/students" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50"><Users className="h-4 w-4" />Students</Link>
                      <Link to="/admin/library" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50"><Library className="h-4 w-4" />Library</Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"><LogOut className="h-4 w-4" />Logout</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
