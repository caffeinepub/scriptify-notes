import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage, Pencil, FileText, Sparkles } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-block p-4 bg-amber-100 dark:bg-amber-900/30 rounded-2xl mb-4">
            <img src="/assets/generated/app-icon.dim_512x512.png" alt="Scriptify Notes" className="w-24 h-24" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-amber-900 dark:text-amber-100 tracking-tight">
            Scriptify Notes
          </h1>
          <p className="text-xl text-amber-800 dark:text-amber-200 max-w-2xl mx-auto leading-relaxed">
            Transform your typed screenshots into beautiful handwritten notes with realistic pen strokes and hand-drawn
            sketches
          </p>
          <div className="flex gap-4 justify-center pt-4">
            {isAuthenticated ? (
              <>
                <Link to="/convert">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Converting
                  </Button>
                </Link>
                <Link to="/history">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl">
                    View History
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-amber-700 dark:text-amber-300 text-lg">Please sign in to start converting notes</p>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center mb-2">
                <FileImage className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              </div>
              <CardTitle className="text-amber-900 dark:text-amber-100">Upload Screenshot</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-amber-700 dark:text-amber-300">
                Upload PNG or JPG screenshots of your typed notes up to 10MB
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              </div>
              <CardTitle className="text-amber-900 dark:text-amber-100">Extract Text</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-amber-700 dark:text-amber-300">
                AI-powered OCR extracts text while preserving structure and formatting
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center mb-2">
                <Pencil className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              </div>
              <CardTitle className="text-amber-900 dark:text-amber-100">Handwriting Style</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-amber-700 dark:text-amber-300">
                Realistic handwriting with natural variations in spacing, rotation, and stroke
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              </div>
              <CardTitle className="text-amber-900 dark:text-amber-100">Generate PDF</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-amber-700 dark:text-amber-300">
                High-quality A4 PDFs at 300 DPI ready for download and printing
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
