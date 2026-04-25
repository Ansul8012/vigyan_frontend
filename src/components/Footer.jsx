import { BookOpen, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <span className="gradient-text text-lg font-bold">Vigyaan</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-Powered Library Management System for Graphic Era Deemed to be University. Smart, fast, and intelligent.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/auth/student" className="text-sm text-muted-foreground hover:text-primary transition-colors">Student Login</Link></li>
              <li><Link to="/auth/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />library@geu.ac.in
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Github className="h-4 w-4" />github.com/vigyaan
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border/30 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Vigyaan — Graphic Era Deemed to be University. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
