import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, QrCode, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QRScanner from '@/components/QRScanner';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
import { z } from 'zod';

const studentSchema = z.object({
  studentId: z.string().min(3, 'Min 3 characters').max(20, 'Max 20 characters'),
  fullName: z.string().min(2, 'Min 2 characters').regex(/^[a-zA-Z\s]+$/, 'Letters only'),
  course: z.string().min(1, 'Required'),
  completionYear: z.string().regex(/^20\d{2}$/, 'Format: 20XX'),
  email: z.string().email('Invalid email'),
});

const StudentAuth = () => {
  const navigate = useNavigate();
  const { studentSignup, studentLogin, isLoading } = useAuthStore();
  const [showLoginScanner, setShowLoginScanner] = useState(false);
  const [showSignupScanner, setShowSignupScanner] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ studentId: '', fullName: '', course: '', completionYear: '', email: '' });
  const [idCard, setIdCard] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const result = studentSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => { fieldErrors[err.path[0]] = err.message; });
      setErrors(fieldErrors);
      return false;
    }
    if (!idCard) {
      setErrors((prev) => ({ ...prev, idCard: 'Please upload your student ID card' }));
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSignupStep(2);
      setShowSignupScanner(true);
    }
  };

  // TODO: Replace with API call — POST /api/auth/student/signup
  const handleSignupScan = async (data) => {
    setShowSignupScanner(false);
    const result = await studentSignup({ ...form, qrData: data });
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Signup failed');
      setSignupStep(1);
    }
  };

  // TODO: Replace with API call — POST /api/auth/student/login
  const handleLoginScan = async (data) => {
    setShowLoginScanner(false);
    const result = await studentLogin(data);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Login failed. QR code not recognized.');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 pt-20">
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/3 h-80 w-80 rounded-full bg-purple-500/5 blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Student Portal</h1>
          <p className="text-sm text-muted-foreground">Access your library account</p>
        </div>

        <div className="glass-card p-6">
          <Tabs defaultValue="login">
            <TabsList className="mb-4 grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup" onClick={() => { setSignupStep(1); setShowSignupScanner(false); }}>Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="py-8 text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowLoginScanner(true)}
                  className="mx-auto mb-4 flex h-20 w-20 cursor-pointer items-center justify-center rounded-2xl bg-primary/10 animate-pulse-glow"
                >
                  <QrCode className="h-10 w-10 text-primary" />
                </motion.div>
                <p className="mb-2 font-medium text-foreground">Scan your Student ID</p>
                <p className="text-sm text-muted-foreground">Click the icon above to open QR scanner</p>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <AnimatePresence mode="wait">
                {signupStep === 1 ? (
                  <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSignupSubmit} className="space-y-3">
                    {[
                      { name: 'studentId', label: 'Student ID', placeholder: 'e.g., STU2024001' },
                      { name: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
                      { name: 'course', label: 'Course', placeholder: 'B.Tech CSE' },
                      { name: 'completionYear', label: 'Completion Year', placeholder: '2026' },
                      { name: 'email', label: 'Email', placeholder: 'you@geu.ac.in', type: 'email' },
                    ].map((field) => (
                      <div key={field.name}>
                        <Label className="text-sm text-muted-foreground">{field.label}</Label>
                        <Input name={field.name} type={field.type || 'text'} value={form[field.name]} onChange={handleChange} placeholder={field.placeholder} className="mt-1 bg-muted/30 border-border/50" />
                        {errors[field.name] && <p className="mt-1 text-xs text-destructive">{errors[field.name]}</p>}
                      </div>
                    ))}
                    <div>
                      <Label className="text-sm text-muted-foreground">Upload Student ID Card</Label>
                      <div className="mt-1 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-muted/20 p-4 hover:border-primary/50 transition-colors">
                        <input type="file" accept="image/*" onChange={(e) => { setIdCard(e.target.files[0]); setErrors((prev) => { const n = {...prev}; delete n.idCard; return n; }); }} className="hidden" id="id-upload" />
                        <label htmlFor="id-upload" className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                          <Upload className="h-4 w-4" />{idCard ? idCard.name : 'Click to upload'}
                        </label>
                      </div>
                      {errors.idCard && <p className="mt-1 text-xs text-destructive">{errors.idCard}</p>}
                    </div>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground">
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center py-6">
                    <Button variant="ghost" onClick={() => { setSignupStep(1); setShowSignupScanner(false); }} className="mb-4 text-sm text-muted-foreground">
                      <ArrowLeft className="mr-1 h-4 w-4" />Back to form
                    </Button>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <QrCode className="h-8 w-8 text-primary" />
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">Now scan your Student ID Card QR code to complete registration</p>
                    <Button onClick={() => setShowSignupScanner(true)} className="bg-primary text-primary-foreground">
                      <QrCode className="mr-2 h-4 w-4" /> Open QR Scanner
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      {/* Login QR Scanner */}
      <AnimatePresence>
        {showLoginScanner && (
          <QRScanner onScan={handleLoginScan} onClose={() => setShowLoginScanner(false)} title="Student Login" description="Scan your student ID card QR code" />
        )}
      </AnimatePresence>

      {/* Signup QR Scanner */}
      <AnimatePresence>
        {showSignupScanner && (
          <QRScanner onScan={handleSignupScan} onClose={() => { setShowSignupScanner(false); setSignupStep(1); }} title="Verify Student ID" description="Scan the QR code on your student ID card" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentAuth;
