import * as fabric from 'fabric';

export type ClipShapeId = 'circle' | 'square' | 'heart' | 'star' | 'flower';

export interface ClipShapeDefinition {
  id: ClipShapeId;
  label: string;
  createClipPath: (width: number, height: number) => fabric.FabricObject;
}

// Heart SVG path normalized to 100x100 viewBox
const HEART_PATH = 'M50 88 C20 58, 0 40, 0 25 C0 10, 12 0, 25 0 C35 0, 45 8, 50 18 C55 8, 65 0, 75 0 C88 0, 100 10, 100 25 C100 40, 80 58, 50 88 Z';

// 5-pointed star path normalized to 100x100 viewBox
const STAR_PATH = 'M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z';

// 6-petal flower path normalized to 100x100 viewBox
const FLOWER_PATH = 'M50 0 C60 20, 75 25, 100 25 C75 35, 70 50, 75 75 C55 65, 50 50, 45 75 C40 50, 25 65, 25 75 C30 50, 25 35, 0 25 C25 25, 40 20, 50 0 Z';

export const clipShapes: ClipShapeDefinition[] = [
  {
    id: 'circle',
    label: 'Circle',
    createClipPath: (width: number, height: number) => {
      const size = Math.min(width, height);
      return new fabric.Circle({
        radius: size / 2,
        originX: 'center',
        originY: 'center',
      });
    },
  },
  {
    id: 'square',
    label: 'Square',
    createClipPath: (width: number, height: number) => {
      const size = Math.min(width, height);
      return new fabric.Rect({
        width: size,
        height: size,
        originX: 'center',
        originY: 'center',
      });
    },
  },
  {
    id: 'heart',
    label: 'Heart',
    createClipPath: (width: number, height: number) => {
      const size = Math.min(width, height);
      const scale = size / 100;
      return new fabric.Path(HEART_PATH, {
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
      });
    },
  },
  {
    id: 'star',
    label: 'Star',
    createClipPath: (width: number, height: number) => {
      const size = Math.min(width, height);
      const scale = size / 100;
      return new fabric.Path(STAR_PATH, {
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
      });
    },
  },
  {
    id: 'flower',
    label: 'Flower',
    createClipPath: (width: number, height: number) => {
      const size = Math.min(width, height);
      const scale = size / 100;
      return new fabric.Path(FLOWER_PATH, {
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
      });
    },
  },
];

/**
 * Type guard to check if a Fabric object is an image
 */
export function isFabricImage(obj: fabric.FabricObject | null | undefined): obj is fabric.FabricImage {
  return obj !== null && obj !== undefined && obj.type === 'image';
}

/**
 * Gets the clip shape ID from a Fabric image's custom property
 */
export function getClipShapeId(image: fabric.FabricImage): ClipShapeId | null {
  // Access custom property stored on the image
  const shapeId = (image as fabric.FabricImage & { clipShapeId?: ClipShapeId }).clipShapeId;
  return shapeId || null;
}

/**
 * Applies a clip path shape to a Fabric image
 */
export function applyClipPathToImage(image: fabric.FabricImage, shapeId: ClipShapeId): void {
  const shapeDef = clipShapes.find((s) => s.id === shapeId);
  if (!shapeDef) return;

  // Use original image dimensions (before scaling) since clip path operates in local coordinate space
  const width = image.width || 0;
  const height = image.height || 0;

  // Create the clip path
  const clipPath = shapeDef.createClipPath(width, height);

  // Apply the clip path to the image
  image.set({
    clipPath,
    // Store the shape ID as a custom property for serialization/restoration
    clipShapeId: shapeId,
  } as Partial<fabric.FabricImage> & { clipShapeId: ClipShapeId });
}

/**
 * Removes the clip path from a Fabric image
 */
export function removeClipPathFromImage(image: fabric.FabricImage): void {
  image.set({
    clipPath: undefined,
    clipShapeId: undefined,
  } as Partial<fabric.FabricImage> & { clipShapeId?: undefined });
}

/**
 * Gets all available clip shapes
 */
export function getClipShapes(): ClipShapeDefinition[] {
  return clipShapes;
}
