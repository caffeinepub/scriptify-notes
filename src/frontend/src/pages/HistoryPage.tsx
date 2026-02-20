import NoteHistory from '../components/NoteHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HistoryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-3xl text-amber-900 dark:text-amber-100">Your Note History</CardTitle>
          <CardDescription className="text-amber-700 dark:text-amber-300">
            View and download your previously converted handwritten notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NoteHistory />
        </CardContent>
      </Card>
    </div>
  );
}
