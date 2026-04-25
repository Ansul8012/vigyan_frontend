import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, BookOpen, Brain, QrCode, ScanLine, CalendarClock, Users, Shield,
  ArrowRight, GraduationCap, CheckCircle2, MapPin, RotateCcw, Zap, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Brain, title: 'AI Book Recommendations', description: 'Get personalized book suggestions powered by artificial intelligence based on your reading history.' },
  { icon: QrCode, title: 'QR Code Authentication', description: 'Instant login and verification using your student or staff ID card QR code.' },
  { icon: ScanLine, title: 'Automated Book Issuing', description: 'Scan and issue books in seconds with our automated QR-based verification system.' },
  { icon: CalendarClock, title: 'Slot Booking System', description: 'Reserve your library seat in advance and manage your study schedule efficiently.' },
  { icon: Users, title: 'Student & Admin Portal', description: 'Dedicated dashboards for students and administrators with role-based access control.' },
  { icon: Shield, title: 'Smart Library Management', description: 'Complete library operations management with real-time tracking and analytics.' },
];

const studentSteps = [
  { num: '01', icon: QrCode, title: 'Sign Up & Login', description: 'Create your account with your student ID details and ID card photo. Login anytime by simply scanning your student ID card QR code — no passwords needed.' },
  { num: '02', icon: BookOpen, title: 'Browse & Raise Issue Request', description: 'Explore the full library catalog, search by category, and ask the AI assistant for book recommendations. Found a book? Raise an issue request directly from the library view.' },
  { num: '03', icon: MapPin, title: 'Visit Vigyaan & Get Your Book', description: 'Come to the Vigyaan desk. Your identity is verified via QR scan, then you\'re guided to the exact shelf location. Pick up the book and scan its QR to confirm — choose how many months you need it (max 6).' },
  { num: '04', icon: RotateCcw, title: 'Return Your Book', description: 'When done reading, raise a return request from your dashboard. Visit the Vigyaan desk — your identity and book are verified via QR scan, and you place the book back on its shelf. Done!' },
];

const adminSteps = [
  { num: '01', icon: Zap, title: 'Open Vigyaan Digital Library', description: 'Start the Vigyaan digital library session from the admin dashboard. This opens an isolated full-screen mode where all student book transactions are processed.' },
  { num: '02', icon: CheckCircle2, title: 'Process Issue & Return Requests', description: 'View all pending student requests. For each request, verify the student\'s identity via QR scan, guide them to the correct shelf, and confirm the book with a QR scan.' },
  { num: '03', icon: BookOpen, title: 'Manage Books & Students', description: 'Add, edit, or remove books from the catalog with QR codes. View all registered students, their issued books, and manage their access to the library system.' },
  { num: '04', icon: Shield, title: 'Close Vigyaan Securely', description: 'When the library session is over, close Vigyaan with admin QR verification. This ensures only authorized staff can start and end library operations.' },
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Library Management
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl"
          >
            Welcome to{' '}
            <span className="gradient-text">Vigyaan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 text-lg text-muted-foreground md:text-xl"
          >
            The smart library management system for Graphic Era Deemed to be University.
            AI recommendations, QR authentication, and seamless book management.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/auth/student"><BookOpen className="mr-2 h-5 w-5" />Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-border text-foreground hover:bg-muted/50">
              <Link to="/auth/admin"><Shield className="mr-2 h-5 w-5" />Admin Portal</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center"
          >
            {[['12,000+', 'Books Available'], ['5,000+', 'Active Students'], ['500+', 'AI Queries/Day']].map(([num, label]) => (
              <div key={label}>
                <p className="gradient-text text-2xl font-bold">{num}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-muted-foreground">Everything you need for a modern library experience.</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Guide */}
      <section className="bg-muted/20 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <GraduationCap className="h-4 w-4" />
              For Students
            </div>
            <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
              How to <span className="gradient-text">Issue & Return</span> Books
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A step-by-step guide for students to borrow and return books using Vigyaan's QR-powered system.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {studentSteps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="glass-card flex items-start gap-4 p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="gradient-text text-sm font-bold">Step {s.num}</span>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Guide */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 text-sm text-purple-400">
              <Shield className="h-4 w-4" />
              For Library Staff
            </div>
            <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
              How <span className="gradient-text">Admins</span> Manage the Library
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A guide for library staff to manage books, process student requests, and operate the Vigyaan digital library.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {adminSteps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="glass-card flex items-start gap-4 p-6 border-purple-500/10"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
                  <s.icon className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="bg-gradient-to-r from-purple-400 to-primary bg-clip-text text-sm font-bold text-transparent">Step {s.num}</span>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-border glow p-8 text-center md:p-12"
          >
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">Ready to Get Started?</h2>
            <p className="mb-6 text-muted-foreground">Join thousands of students using Vigyaan for a smarter library experience.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-primary text-primary-foreground">
                <Link to="/auth/student">Student Login <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-border text-foreground">
                <Link to="/auth/admin">Admin Login</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
