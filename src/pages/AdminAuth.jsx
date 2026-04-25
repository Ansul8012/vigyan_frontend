import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, QrCode, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QRScanner from '@/components/QRScanner';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
import { z } from 'zod';

const adminSchema = z.object({
  staffId: z.string().min(3, 'Min 3 characters'),
  fullName: z.string().min(2, 'Min 2 characters').regex(/^[a-zA-Z\s.]+$/, 'Letters only'),
  department: z.string().min(1, 'Required'),
});

const AdminAuth = () => {
  const navigate = useNavigate();
  const { adminSignup, adminLogin } = useAuthStore();
  const [showLoginScanner, setShowLoginScanner] = useState(false);
  const [showSignupScanner, setShowSignupScanner] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ staffId: '', fullName: '', department: '' });
  const [idCard, setIdCard] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const result = adminSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => { fieldErrors[err.path[0]] = err.message; });
      setErrors(fieldErrors);
      return false;
    }
    if (!idCard) {
      setErrors((prev) => ({ ...prev, idCard: 'Please upload your staff ID card' }));
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

  // TODO: Replace with API call — POST /api/auth/admin/signup
  const handleSignupScan = async (data) => {
    setShowSignupScanner(false);
    const result = await adminSignup({ ...form, qrData: data });
    if (result.success) {
      toast.success('Admin account created!');
      navigate('/admin');
    } else {
      toast.error(result.error || 'Signup failed');
      setSignupStep(1);
    }
  };

  // TODO: Replace with API call — POST /api/auth/admin/login
  const handleLoginScan = async (data) => {
    setShowLoginScanner(false);
    const result = await adminLogin(data);
    if (result.success) {
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } else {
      toast.error(result.error || 'Login failed. QR code not recognized.');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 pt-20">
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-purple-500/5 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/3 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">
            <Shield className="h-7 w-7 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Library staff access</p>
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
                  className="mx-auto mb-4 flex h-20 w-20 cursor-pointer items-center justify-center rounded-2xl bg-purple-500/10 animate-pulse-glow"
                >
                  <QrCode className="h-10 w-10 text-purple-400" />
                </motion.div>
                <p className="mb-2 font-medium text-foreground">Scan your Staff ID</p>
                <p className="text-sm text-muted-foreground">Click the icon above to open QR scanner</p>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <AnimatePresence mode="wait">
                {signupStep === 1 ? (
                  <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSignupSubmit} className="space-y-3">
                    {[
                      { name: 'staffId', label: 'Staff ID', placeholder: 'e.g., ADM2024001' },
                      { name: 'fullName', label: 'Full Name', placeholder: 'Dr. Jane Smith' },
                      { name: 'department', label: 'Department', placeholder: 'Library Sciences' },
                    ].map((field) => (
                      <div key={field.name}>
                        <Label className="text-sm text-muted-foreground">{field.label}</Label>
                        <Input name={field.name} value={form[field.name]} onChange={handleChange} placeholder={field.placeholder} className="mt-1 bg-muted/30 border-border/50" />
                        {errors[field.name] && <p className="mt-1 text-xs text-destructive">{errors[field.name]}</p>}
                      </div>
                    ))}
                    <div>
                      <Label className="text-sm text-muted-foreground">Upload Staff ID Card</Label>
                      <div className="mt-1 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-muted/20 p-4 hover:border-purple-400/50 transition-colors">
                        <input type="file" accept="image/*" onChange={(e) => { setIdCard(e.target.files[0]); setErrors((prev) => { const n = {...prev}; delete n.idCard; return n; }); }} className="hidden" id="staff-upload" />
                        <label htmlFor="staff-upload" className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
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
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10">
                      <QrCode className="h-8 w-8 text-purple-400" />
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">Scan your Staff ID Card QR code to complete registration</p>
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
          <QRScanner onScan={handleLoginScan} onClose={() => setShowLoginScanner(false)} title="Admin Login" description="Scan your staff ID card QR code" />
        )}
      </AnimatePresence>

      {/* Signup QR Scanner */}
      <AnimatePresence>
        {showSignupScanner && (
          <QRScanner onScan={handleSignupScan} onClose={() => { setShowSignupScanner(false); setSignupStep(1); }} title="Verify Staff ID" description="Scan the QR code on your staff ID card" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAuth;
