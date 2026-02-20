import { useState, useCallback } from 'react';
import { extractTextFromImage } from '../services/ocrService';

export function useOCR() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const extractText = useCallback(async (imageFile: File): Promise<string | null> => {
    setIsExtracting(true);
    setProgress(0);
    setError(null);

    try {
      const text = await extractTextFromImage(imageFile, (p) => setProgress(p));
      setProgress(100);
      return text;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract text');
      return null;
    } finally {
      setIsExtracting(false);
    }
  }, []);

  return {
    extractText,
    isExtracting,
    progress,
    error,
  };
}
