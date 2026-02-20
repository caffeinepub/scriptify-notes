import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Save, Loader2, CheckCircle2, RotateCcw } from 'lucide-react';
import { useSaveNote } from '../hooks/useQueries';
import { downloadFile } from '../utils/fileDownload';

interface PDFPreviewProps {
  pdfBlob: Blob;
  originalText: string;
  onStartOver: () => void;
}

export default function PDFPreview({ pdfBlob, originalText, onStartOver }: PDFPreviewProps) {
  const [pdfUrl] = useState(() => URL.createObjectURL(pdfBlob));
  const saveNote = useSaveNote();
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `scriptify_notes_${timestamp}.png`;
    downloadFile(pdfBlob, filename);
  };

  const handleSave = async () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const title = originalText.slice(0, 50).trim() || 'Untitled Note';

    await saveNote.mutateAsync({
      title,
      pdfBlob,
      onProgress: setUploadProgress,
    });
  };

  return (
    <div className="space-y-6">
      {saveNote.isSuccess && (
        <Alert className="border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Your note has been saved successfully! You can find it in your history.
          </AlertDescription>
        </Alert>
      )}

      {saveNote.isError && (
        <Alert variant="destructive">
          <AlertDescription>Failed to save note. Please try again.</AlertDescription>
        </Alert>
      )}

      <div className="border-2 border-amber-200 dark:border-amber-800 rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-4">
        <img src={pdfUrl} alt="Generated handwritten note" className="w-full h-auto" />
      </div>

      <div className="flex flex-wrap gap-3 justify-between items-center">
        <Button onClick={onStartOver} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Convert Another Note
        </Button>

        <div className="flex gap-3">
          <Button onClick={handleDownload} variant="outline" size="lg" className="gap-2">
            <Download className="h-5 w-5" />
            Download Image
          </Button>

          <Button onClick={handleSave} size="lg" disabled={saveNote.isPending || saveNote.isSuccess} className="gap-2">
            {saveNote.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving... {uploadProgress > 0 && `${uploadProgress}%`}
              </>
            ) : saveNote.isSuccess ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save to History
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
