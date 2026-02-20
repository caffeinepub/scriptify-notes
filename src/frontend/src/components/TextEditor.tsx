import { useState, useEffect } from 'react';
import { useOCR } from '../hooks/useOCR';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, ArrowRight, Info } from 'lucide-react';

interface TextEditorProps {
  image: File;
  onTextExtracted: (text: string) => void;
  onTextEdited: (text: string) => void;
  extractedText: string;
}

export default function TextEditor({ image, onTextExtracted, onTextEdited, extractedText }: TextEditorProps) {
  const { extractText, isExtracting, progress, error } = useOCR();
  const [text, setText] = useState(extractedText);
  const [hasExtracted, setHasExtracted] = useState(!!extractedText);

  useEffect(() => {
    if (!hasExtracted && image) {
      const extract = async () => {
        const result = await extractText(image);
        if (result) {
          setText(result);
          onTextExtracted(result);
          setHasExtracted(true);
        }
      };
      extract();
    }
  }, [image, hasExtracted, extractText, onTextExtracted]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onTextEdited(e.target.value);
  };

  const handleContinue = () => {
    onTextEdited(text);
  };

  if (isExtracting) {
    return (
      <div className="space-y-6 py-8">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 dark:text-amber-400 mx-auto" />
          <div>
            <p className="text-lg font-semibold text-amber-900 dark:text-amber-100">Extracting text from image...</p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">This may take a moment</p>
          </div>
          <Progress value={progress} className="max-w-md mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20">
        <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-900 dark:text-amber-100">Demo Mode</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          OCR text extraction is in demo mode. Please type or paste your text below to continue with the handwriting
          conversion.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="extracted-text" className="text-amber-900 dark:text-amber-100">
          Your Text (Type or Paste Here)
        </Label>
        <Textarea
          id="extracted-text"
          value={text}
          onChange={handleTextChange}
          rows={15}
          className="font-mono text-sm border-amber-300 dark:border-amber-700"
          placeholder="Type or paste your text here to convert it into handwritten notes..."
        />
        <p className="text-xs text-amber-600 dark:text-amber-400">
          {text.length} characters • Edit the text as needed before converting
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleContinue} size="lg" disabled={!text.trim()} className="gap-2">
          Continue to Styling
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
