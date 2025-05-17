import { Logo } from '@/components/core/logo';
import { Github, Instagram } from 'lucide-react'; // Removed Linkedin, Twitter. Added Instagram
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-12 bg-secondary/20 border-t border-border/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex justify-center md:justify-start">
            <Logo />
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Alpha Coders. All rights reserved.</p>
            <p>Built with <span className="text-primary">Next.js</span> and <span className="text-accent">Passion</span>.</p>
          </div>

          <div className="flex justify-center md:justify-end space-x-4">
            <Link href="https://github.com/vikashgupta16/Alpha-Coders" aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-6 w-6" />
            </Link>
            <Link href="https://www.instagram.com/alphacodersstcet/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
            </Link>
            {/* Twitter and LinkedIn links removed */}
          </div>
        </div>
      </div>
    </footer>
  );
}
