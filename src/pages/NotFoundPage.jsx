import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="mb-2 text-7xl font-bold gradient-text">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Page not found</p>
        <Button asChild className="bg-primary text-primary-foreground">
          <Link to="/"><Home className="mr-2 h-4 w-4" />Go Home</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
