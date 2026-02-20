export interface CharacterVariations {
  spacing: number;
  rotation: number;
  baselineShift: number;
  strokeThickness: number;
}

export function applyHandwritingVariations(): CharacterVariations {
  return {
    spacing: Math.random() * 1.5 - 0.5,
    rotation: (Math.random() * 4 - 2) * (Math.PI / 180),
    baselineShift: Math.random() * 2 - 1,
    strokeThickness: 0.9 + Math.random() * 0.2,
  };
}
