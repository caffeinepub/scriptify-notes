import type { HandwritingStyle } from '../types/handwritingStyles';

// Simple PDF generation using canvas and data URLs
// This creates a basic PDF-like document without external dependencies

export async function generatePDF(text: string, style: HandwritingStyle): Promise<Blob> {
  // A4 dimensions at 96 DPI (web standard)
  const width = 794; // 210mm at 96 DPI
  const height = 1123; // 297mm at 96 DPI
  const margin = 60;
  const contentWidth = width - 2 * margin;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  // Background color (paper)
  ctx.fillStyle = '#fffdf5';
  ctx.fillRect(0, 0, width, height);

  // Draw paper lines based on style
  if (style.paperBackground === 'ruled' || style.paperBackground === 'margin') {
    ctx.strokeStyle = '#c8c8dc';
    ctx.lineWidth = 0.5;
    for (let y = 120; y < height - 60; y += 30) {
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(width - margin, y);
      ctx.stroke();
    }
  }

  if (style.paperBackground === 'graph') {
    ctx.strokeStyle = '#dcdce6';
    ctx.lineWidth = 0.5;
    // Horizontal lines
    for (let y = 60; y < height - 60; y += 20) {
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(width - margin, y);
      ctx.stroke();
    }
    // Vertical lines
    for (let x = margin; x < width - margin; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 60);
      ctx.lineTo(x, height - 60);
      ctx.stroke();
    }
  }

  if (style.paperBackground === 'margin') {
    ctx.strokeStyle = '#dc6464';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(margin + 50, 60);
    ctx.lineTo(margin + 50, height - 60);
    ctx.stroke();
  }

  // Set text style
  const inkColor = style.inkColor === 'blue' ? '#1e3a8a' : '#1f2937';
  ctx.fillStyle = inkColor;
  ctx.font = '22px "Caveat", "Patrick Hand", cursive';

  // Draw text with handwriting variations
  const lines = text.split('\n');
  let yPosition = 100;
  const lineHeight = 32;
  const startX = margin + (style.paperBackground === 'margin' ? 60 : 0);

  for (const line of lines) {
    if (yPosition > height - 100) {
      // Would need multiple pages - for now just stop
      break;
    }

    // Split line into words for wrapping
    const words = line.split(' ');
    let currentLine = '';
    let currentX = startX;

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > contentWidth - (style.paperBackground === 'margin' ? 60 : 0) && currentLine) {
        // Draw current line
        drawHandwrittenLine(ctx, currentLine, startX, yPosition, inkColor);
        currentLine = word;
        yPosition += lineHeight;

        if (yPosition > height - 100) break;
      } else {
        currentLine = testLine;
      }
    }

    // Draw remaining text
    if (currentLine && yPosition <= height - 100) {
      drawHandwrittenLine(ctx, currentLine, startX, yPosition, inkColor);
      yPosition += lineHeight;
    }
  }

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Create a simple PDF-like structure
          // For a real PDF, we'd need a PDF library, but this creates an image
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      'image/png',
      1.0
    );
  });
}

function drawHandwrittenLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string
): void {
  ctx.fillStyle = color;
  let currentX = x;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    // Apply random variations
    const rotation = (Math.random() * 4 - 2) * (Math.PI / 180);
    const baselineShift = Math.random() * 3 - 1.5;
    const spacing = Math.random() * 2 - 0.5;

    ctx.save();
    ctx.translate(currentX, y + baselineShift);
    ctx.rotate(rotation);
    ctx.fillText(char, 0, 0);
    ctx.restore();

    const charWidth = ctx.measureText(char).width;
    currentX += charWidth + spacing;
  }
}
