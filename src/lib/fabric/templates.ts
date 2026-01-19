export type TemplateId = 'grid-2x2' | 'grid-3x3' | 'hero-grid' | 'feature-left' | 'centered' | 'scattered';

export interface PlaceholderRect {
  left: number;
  top: number;
  width: number;
  height: number;
  angle?: number;
}

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  generate: (canvasWidth: number, canvasHeight: number) => PlaceholderRect[];
}

const GAP = 10; // Gap between cells
const MARGIN_RATIO = 0.08; // 8% margin on each side

export const templates: Template[] = [
  {
    id: 'grid-2x2',
    name: '2x2 Grid',
    description: '4 equal squares',
    generate: (canvasWidth: number, canvasHeight: number): PlaceholderRect[] => {
      const marginX = canvasWidth * MARGIN_RATIO;
      const marginY = canvasHeight * MARGIN_RATIO;
      const contentWidth = canvasWidth - marginX * 2;
      const contentHeight = canvasHeight - marginY * 2;
      const cellWidth = (contentWidth - GAP) / 2;
      const cellHeight = (contentHeight - GAP) / 2;

      return [
        { left: marginX, top: marginY, width: cellWidth, height: cellHeight },
        { left: marginX + cellWidth + GAP, top: marginY, width: cellWidth, height: cellHeight },
        { left: marginX, top: marginY + cellHeight + GAP, width: cellWidth, height: cellHeight },
        { left: marginX + cellWidth + GAP, top: marginY + cellHeight + GAP, width: cellWidth, height: cellHeight },
      ];
    },
  },
  {
    id: 'grid-3x3',
    name: '3x3 Grid',
    description: '9 equal squares',
    generate: (canvasWidth: number, canvasHeight: number): PlaceholderRect[] => {
      const marginX = canvasWidth * MARGIN_RATIO;
      const marginY = canvasHeight * MARGIN_RATIO;
      const contentWidth = canvasWidth - marginX * 2;
      const contentHeight = canvasHeight - marginY * 2;
      const cellWidth = (contentWidth - GAP * 2) / 3;
      const cellHeight = (contentHeight - GAP * 2) / 3;
      const rects: PlaceholderRect[] = [];

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          rects.push({
            left: marginX + col * (cellWidth + GAP),
            top: marginY + row * (cellHeight + GAP),
            width: cellWidth,
            height: cellHeight,
          });
        }
      }

      return rects;
    },
  },
  {
    id: 'hero-grid',
    name: 'Hero + Grid',
    description: 'Large image top, 3 below',
    generate: (canvasWidth: number, canvasHeight: number): PlaceholderRect[] => {
      const marginX = canvasWidth * MARGIN_RATIO;
      const marginY = canvasHeight * MARGIN_RATIO;
      const contentWidth = canvasWidth - marginX * 2;
      const contentHeight = canvasHeight - marginY * 2;
      const heroHeight = (contentHeight - GAP) * 0.6;
      const bottomHeight = (contentHeight - GAP) * 0.4;
      const bottomCellWidth = (contentWidth - GAP * 2) / 3;

      return [
        // Hero image at top
        { left: marginX, top: marginY, width: contentWidth, height: heroHeight },
        // 3 images at bottom
        { left: marginX, top: marginY + heroHeight + GAP, width: bottomCellWidth, height: bottomHeight },
        { left: marginX + bottomCellWidth + GAP, top: marginY + heroHeight + GAP, width: bottomCellWidth, height: bottomHeight },
        { left: marginX + bottomCellWidth * 2 + GAP * 2, top: marginY + heroHeight + GAP, width: bottomCellWidth, height: bottomHeight },
      ];
    },
  },
  {
    id: 'feature-left',
    name: 'Feature Left',
    description: 'Large left, 2 stacked right',
    generate: (canvasWidth: number, canvasHeight: number): PlaceholderRect[] => {
      const marginX = canvasWidth * MARGIN_RATIO;
      const marginY = canvasHeight * MARGIN_RATIO;
      const contentWidth = canvasWidth - marginX * 2;
      const contentHeight = canvasHeight - marginY * 2;
      const leftWidth = (contentWidth - GAP) * 0.6;
      const rightWidth = (contentWidth - GAP) * 0.4;
      const rightCellHeight = (contentHeight - GAP) / 2;

      return [
        // Large image on left
        { left: marginX, top: marginY, width: leftWidth, height: contentHeight },
        // 2 stacked images on right
        { left: marginX + leftWidth + GAP, top: marginY, width: rightWidth, height: rightCellHeight },
        { left: marginX + leftWidth + GAP, top: marginY + rightCellHeight + GAP, width: rightWidth, height: rightCellHeight },
      ];
    },
  },
  {
    id: 'centered',
    name: 'Centered Focal',
    description: 'Large center, 4 corners',
    generate: (canvasWidth: number, canvasHeight: number): PlaceholderRect[] => {
      const marginX = canvasWidth * MARGIN_RATIO;
      const marginY = canvasHeight * MARGIN_RATIO;
      const centerWidth = canvasWidth * 0.4;
      const centerHeight = canvasHeight * 0.4;
      const cornerWidth = canvasWidth * 0.2;
      const cornerHeight = canvasHeight * 0.2;

      return [
        // Center focal image
        {
          left: (canvasWidth - centerWidth) / 2,
          top: (canvasHeight - centerHeight) / 2,
          width: centerWidth,
          height: centerHeight,
        },
        // Top-left corner
        { left: marginX, top: marginY, width: cornerWidth, height: cornerHeight },
        // Top-right corner
        { left: canvasWidth - marginX - cornerWidth, top: marginY, width: cornerWidth, height: cornerHeight },
        // Bottom-left corner
        { left: marginX, top: canvasHeight - marginY - cornerHeight, width: cornerWidth, height: cornerHeight },
        // Bottom-right corner
        { left: canvasWidth - marginX - cornerWidth, top: canvasHeight - marginY - cornerHeight, width: cornerWidth, height: cornerHeight },
      ];
    },
  },
  {
    id: 'scattered',
    name: 'Scattered',
    description: 'Rotated, overlapping frames',
    generate: (canvasWidth: number, canvasHeight: number): PlaceholderRect[] => {
      const baseWidth = canvasWidth * 0.3;
      const baseHeight = canvasHeight * 0.3;
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      return [
        // Slightly rotated and overlapping frames centered around the middle
        { left: centerX - baseWidth * 1.3, top: centerY - baseHeight * 1.1, width: baseWidth, height: baseHeight, angle: -8 },
        { left: centerX + baseWidth * 0.2, top: centerY - baseHeight * 1.2, width: baseWidth * 0.9, height: baseHeight * 0.9, angle: 5 },
        { left: centerX - baseWidth * 0.5, top: centerY - baseHeight * 0.4, width: baseWidth * 1.1, height: baseHeight * 1.1, angle: 3 },
        { left: centerX - baseWidth * 1.2, top: centerY + baseHeight * 0.2, width: baseWidth * 0.85, height: baseHeight * 0.85, angle: -5 },
        { left: centerX + baseWidth * 0.1, top: centerY + baseHeight * 0.1, width: baseWidth, height: baseHeight, angle: 7 },
      ];
    },
  },
];

/**
 * Gets a template by its ID
 */
export function getTemplateById(id: TemplateId): Template | undefined {
  return templates.find((t) => t.id === id);
}

/**
 * Gets all available templates
 */
export function getTemplates(): Template[] {
  return templates;
}
