import { applyHandwritingVariations } from '../utils/handwritingVariations';
import type { HandwritingStyle } from '../types/handwritingStyles';

export function renderHandwrittenText(
  ctx: CanvasRenderingContext2D,
  text: string,
  style: HandwritingStyle,
  startX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): number {
  const inkColor = style.inkColor === 'blue' ? '#1e3a8a' : '#1f2937';
  ctx.fillStyle = inkColor;
  ctx.font = '20px "Caveat", "Patrick Hand", cursive';

  const words = text.split(' ');
  let currentX = startX;
  let currentY = startY;
  const spaceWidth = ctx.measureText(' ').width;

  for (const word of words) {
    const wordWidth = ctx.measureText(word).width;

    if (currentX + wordWidth > maxWidth && currentX > startX) {
      currentX = startX;
      currentY += lineHeight;
    }

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const variations = applyHandwritingVariations();

      ctx.save();
      ctx.translate(currentX, currentY);
      ctx.rotate(variations.rotation);
      ctx.translate(0, variations.baselineShift);

      ctx.fillText(char, 0, 0);
      ctx.restore();

      const charWidth = ctx.measureText(char).width;
      currentX += charWidth + variations.spacing;
    }

    currentX += spaceWidth;
  }

  return currentY;
}
