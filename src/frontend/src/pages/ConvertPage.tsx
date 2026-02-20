import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import TextEditor from '../components/TextEditor';
import StyleCustomizer from '../components/StyleCustomizer';
import PDFPreview from '../components/PDFPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { HandwritingStyle } from '../types/handwritingStyles';

type ConversionStep = 'upload' | 'extract' | 'customize' | 'preview';

export default function ConvertPage() {
  const [currentStep, setCurrentStep] = useState<ConversionStep>('upload');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [editedText, setEditedText] = useState<string>('');
  const [style, setStyle] = useState<HandwritingStyle>({
    inkColor: 'blue',
    paperBackground: 'ruled',
  });
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const stepProgress = {
    upload: 0,
    extract: 33,
    customize: 66,
    preview: 100,
  };

  const handleImageUploaded = (file: File) => {
    setUploadedImage(file);
    setCurrentStep('extract');
  };

  const handleTextExtracted = (text: string) => {
    setExtractedText(text);
    setEditedText(text);
    setCurrentStep('customize');
  };

  const handleTextEdited = (text: string) => {
    setEditedText(text);
  };

  const handleStyleSelected = (selectedStyle: HandwritingStyle) => {
    setStyle(selectedStyle);
  };

  const handlePDFGenerated = (blob: Blob) => {
    setPdfBlob(blob);
    setCurrentStep('preview');
  };

  const handleStartOver = () => {
    setCurrentStep('upload');
    setUploadedImage(null);
    setExtractedText('');
    setEditedText('');
    setPdfBlob(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Card className="border-2 border-amber-200 dark:border-amber-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-3xl text-amber-900 dark:text-amber-100">Convert Your Notes</CardTitle>
          <CardDescription className="text-amber-700 dark:text-amber-300">
            Follow the steps below to transform your typed notes into handwritten masterpieces
          </CardDescription>
          <div className="pt-4">
            <Progress value={stepProgress[currentStep]} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 'upload' && <ImageUpload onImageUploaded={handleImageUploaded} />}

          {currentStep === 'extract' && uploadedImage && (
            <TextEditor
              image={uploadedImage}
              onTextExtracted={handleTextExtracted}
              onTextEdited={handleTextEdited}
              extractedText={extractedText}
            />
          )}

          {currentStep === 'customize' && (
            <StyleCustomizer
              text={editedText}
              onStyleSelected={handleStyleSelected}
              onPDFGenerated={handlePDFGenerated}
              currentStyle={style}
            />
          )}

          {currentStep === 'preview' && pdfBlob && (
            <PDFPreview pdfBlob={pdfBlob} originalText={editedText} onStartOver={handleStartOver} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
