import { useState, useCallback } from 'react';
import { validateImageFile } from '../utils/fileValidation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileImage, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (file: File) => void;
}

export default function ImageUpload({ onImageUploaded }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    const validation = validateImageFile(file);

    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  const handleProceed = () => {
    if (selectedFile) {
      onImageUploaded(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
            : 'border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleChange}
        />

        {preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Preview" className="max-h-96 mx-auto rounded-lg shadow-lg" />
            <div className="flex gap-3 justify-center">
              <Button onClick={handleProceed} size="lg" className="gap-2">
                <FileImage className="h-5 w-5" />
                Proceed with this image
              </Button>
              <Button
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                  setError(null);
                }}
                variant="outline"
                size="lg"
              >
                Choose different image
              </Button>
            </div>
          </div>
        ) : (
          <label htmlFor="file-upload" className="cursor-pointer block">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
                <Upload className="h-10 w-10 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                  Drop your screenshot here or click to browse
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">
                  Supports PNG and JPG files up to 10MB
                </p>
              </div>
            </div>
          </label>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
