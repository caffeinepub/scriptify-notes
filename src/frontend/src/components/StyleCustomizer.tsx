import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import type { HandwritingStyle } from '../types/handwritingStyles';
import { generatePDF } from '../services/pdfGenerator';

interface StyleCustomizerProps {
  text: string;
  onStyleSelected: (style: HandwritingStyle) => void;
  onPDFGenerated: (blob: Blob) => void;
  currentStyle: HandwritingStyle;
}

export default function StyleCustomizer({ text, onStyleSelected, onPDFGenerated, currentStyle }: StyleCustomizerProps) {
  const [style, setStyle] = useState<HandwritingStyle>(currentStyle);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStyleChange = (key: keyof HandwritingStyle, value: string) => {
    const newStyle = { ...style, [key]: value };
    setStyle(newStyle);
    onStyleSelected(newStyle);
    sessionStorage.setItem('handwritingStyle', JSON.stringify(newStyle));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const pdfBlob = await generatePDF(text, style);
      onPDFGenerated(pdfBlob);
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ink Color Selection */}
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <Label className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-4 block">Ink Color</Label>
            <RadioGroup value={style.inkColor} onValueChange={(value) => handleStyleChange('inkColor', value)}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-transparent hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                  <RadioGroupItem value="blue" id="ink-blue" />
                  <Label htmlFor="ink-blue" className="flex-1 cursor-pointer flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-700"></div>
                    <span className="text-amber-900 dark:text-amber-100">Blue Ink</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-transparent hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                  <RadioGroupItem value="black" id="ink-black" />
                  <Label htmlFor="ink-black" className="flex-1 cursor-pointer flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-gray-950"></div>
                    <span className="text-amber-900 dark:text-amber-100">Black Ink</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Paper Background Selection */}
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <Label className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-4 block">
              Paper Background
            </Label>
            <RadioGroup
              value={style.paperBackground}
              onValueChange={(value) => handleStyleChange('paperBackground', value)}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-transparent hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                  <RadioGroupItem value="ruled" id="paper-ruled" />
                  <Label htmlFor="paper-ruled" className="flex-1 cursor-pointer">
                    <div className="space-y-1">
                      <div className="text-amber-900 dark:text-amber-100 font-medium">Ruled Paper</div>
                      <div className="text-xs text-amber-700 dark:text-amber-300">Classic lined notebook</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-transparent hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                  <RadioGroupItem value="graph" id="paper-graph" />
                  <Label htmlFor="paper-graph" className="flex-1 cursor-pointer">
                    <div className="space-y-1">
                      <div className="text-amber-900 dark:text-amber-100 font-medium">Graph Paper</div>
                      <div className="text-xs text-amber-700 dark:text-amber-300">Grid pattern background</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-transparent hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                  <RadioGroupItem value="margin" id="paper-margin" />
                  <Label htmlFor="paper-margin" className="flex-1 cursor-pointer">
                    <div className="space-y-1">
                      <div className="text-amber-900 dark:text-amber-100 font-medium">With Margins</div>
                      <div className="text-xs text-amber-700 dark:text-amber-300">Ruled with left margin line</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
        <CardContent className="pt-6">
          <Label className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-4 block">Preview</Label>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-amber-200 dark:border-amber-700 min-h-[200px]">
            <p className="text-amber-700 dark:text-amber-300 text-sm italic">
              Your handwritten notes will be rendered with {style.inkColor} ink on {style.paperBackground} paper
              background with natural variations in spacing, rotation, and stroke thickness.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-end">
        <Button onClick={handleGenerate} size="lg" disabled={isGenerating || !text.trim()} className="gap-2">
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Handwritten PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
