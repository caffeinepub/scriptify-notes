import { Link } from '@tanstack/react-router';
import { SiCoffeescript } from 'react-icons/si';
import LoginButton from './LoginButton';
import { Button } from '@/components/ui/button';
import { Home, FileText, History } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Paper texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/notebook-texture.dim_1200x1600.png)',
          backgroundSize: '400px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/generated/app-icon.dim_512x512.png"
              alt="Scriptify Notes"
              className="w-10 h-10 group-hover:scale-110 transition-transform"
            />
            <span className="text-2xl font-bold text-amber-900 dark:text-amber-100 tracking-tight">
              Scriptify Notes
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Link to="/convert">
              <Button variant="ghost" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Convert</span>
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="ghost" size="sm" className="gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </Button>
            </Link>
            <div className="ml-2">
              <LoginButton />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-amber-700 dark:text-amber-300">
          <p className="flex items-center justify-center gap-2">
            © {currentYear} Scriptify Notes. Built with{' '}
            <SiCoffeescript className="inline h-4 w-4 text-amber-600 dark:text-amber-400" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-amber-900 dark:hover:text-amber-100 underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
