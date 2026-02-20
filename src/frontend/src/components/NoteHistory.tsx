import { useGetAllNotes, useDeleteNote } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Trash2, FileText, Loader2, AlertCircle } from 'lucide-react';
import { downloadFile } from '../utils/fileDownload';

export default function NoteHistory() {
  const { data: notes, isLoading, error } = useGetAllNotes();
  const deleteNote = useDeleteNote();

  const handleDownload = async (noteId: string, title: string, pdfUrl: string) => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      downloadFile(blob, `${title}.png`);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote.mutateAsync(noteId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600 dark:text-amber-400" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load notes. Please try again.</AlertDescription>
      </Alert>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-20 h-20 mx-auto bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
          <FileText className="h-10 w-10 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p className="text-lg font-semibold text-amber-900 dark:text-amber-100">No notes yet</p>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            Start converting your first screenshot to create handwritten notes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => {
        const date = new Date(Number(note.createdAt) / 1000000);
        const pdfUrl = note.pdfBlob.getDirectURL();

        return (
          <Card key={note.id} className="border-amber-200 dark:border-amber-800">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-amber-900 dark:text-amber-100 truncate">{note.title}</CardTitle>
                  <CardDescription className="text-amber-700 dark:text-amber-300">
                    {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(note.id, note.title, pdfUrl)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                    disabled={deleteNote.isPending}
                    className="gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {deleteNote.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-amber-200 dark:border-amber-700 rounded-lg overflow-hidden">
                <img src={pdfUrl} alt={`Preview of ${note.title}`} className="w-full h-auto" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
