'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import * as fabric from 'fabric';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Download,
  Type,
  MousePointer,
  ImagePlus,
  Sticker,
} from 'lucide-react';
import { Button, Card, CardContent, SaveIndicator } from '@/components/ui';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { StickerLibrary, BackgroundColorPicker, LayerControls, ShapeCropper, TemplateSelector } from '@/components/collage';
import {
  isFabricImage,
  getClipShapeId,
  applyClipPathToImage,
  removeClipPathFromImage,
  type ClipShapeId,
} from '@/lib/fabric/clipShapes';
import { getTemplateById, type TemplateId } from '@/lib/fabric/templates';
import { useCollageStore } from '@/stores/collageStore';
import { useAutoSave } from '@/hooks';
import { getBook, getCollageByBookId, createCollage, updateCollage } from '@/lib/db';
import { cn, resizeImage } from '@/lib/utils';
import type { BookEntry, Collage } from '@/types';

// Dynamically import CollageCanvas to avoid SSR issues with Fabric.js
const CollageCanvas = dynamic(
  () => import('@/components/collage/CollageCanvas').then((mod) => mod.CollageCanvas),
  { ssr: false, loading: () => <CanvasPlaceholder /> }
);


function CanvasPlaceholder() {
  return (
    <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
      <div className="text-muted-foreground animate-pulse">Loading canvas...</div>
    </div>
  );
}

interface FabricObject {
  set: (props: Record<string, unknown>) => void;
  left?: number;
  top?: number;
  clone?: (callback: (cloned: FabricObject) => void) => void;
}

interface FabricCanvas {
  add: (obj: unknown) => void;
  remove: (obj: unknown) => void;
  getActiveObject: () => FabricObject | null;
  setActiveObject: (obj: unknown) => void;
  discardActiveObject: () => void;
  renderAll: () => void;
  toJSON: () => unknown;
  toDataURL: (options?: { format?: string; quality?: number }) => string;
  loadFromJSON: (json: unknown, callback: () => void) => void;
  bringForward: (obj: unknown) => void;
  sendBackwards: (obj: unknown) => void;
  bringToFront: (obj: unknown) => void;
  sendToBack: (obj: unknown) => void;
  getWidth?: () => number;
  getHeight?: () => number;
}


export default function CollagePage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.bookId as string;

  const {
    currentCollage,
    setCurrentCollage,
    updateCanvasJSON,
    setIsSaving,
    isSaving,
    lastSaved,
    setLastSaved,
    activeTool,
    setActiveTool,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useCollageStore();

  const [book, setBook] = useState<BookEntry | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [hasImageSelection, setHasImageSelection] = useState(false);
  const [currentImageShape, setCurrentImageShape] = useState<ClipShapeId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#FDF6E3');
  const [showSidebar, setShowSidebar] = useState(true);
  const [hasPlaceholders, setHasPlaceholders] = useState(false);

  const canvasRef = useRef<FabricCanvas | null>(null);
  const addImagesRef = useRef<((files: FileList | File[]) => Promise<void>) | null>(null);
  const placeholderInputRef = useRef<HTMLInputElement>(null);
  const activePlaceholderRef = useRef<fabric.Rect | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load book and collage data
  useEffect(() => {
    if (!bookId || !mounted) return;

    const loadData = async () => {
      try {
        const loadedBook = await getBook(bookId);
        if (!loadedBook) {
          router.push('/library');
          return;
        }
        setBook(loadedBook);

        let collage = await getCollageByBookId(bookId);
        if (!collage) {
          const collageId = await createCollage(bookId);
          collage = {
            id: collageId,
            bookId,
            canvasJSON: '',
            thumbnail: null,
            colorPalette: ['#FDF6E3', '#D4A5A5', '#9CAF88', '#E6C068', '#8B7355'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        setCurrentCollage(collage);
      } catch (error) {
        console.error('Failed to load data:', error);
        router.push('/library');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [bookId, mounted, router, setCurrentCollage]);

  // Auto-save
  const handleSave = useCallback(async (collage: Collage) => {
    if (!collage.id) return;

    setIsSaving(true);
    try {
      // Generate thumbnail from canvas
      let thumbnail = collage.thumbnail;
      if (canvasRef.current) {
        thumbnail = canvasRef.current.toDataURL({
          format: 'png',
          quality: 0.8,
        });
      }

      await updateCollage(collage.id, {
        canvasJSON: collage.canvasJSON,
        colorPalette: collage.colorPalette,
        thumbnail,
      });
      setLastSaved(new Date().toISOString());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [setIsSaving, setLastSaved]);

  useAutoSave({
    data: currentCollage!,
    onSave: handleSave,
    delay: 3000,
    enabled: mounted && !isLoading && !!currentCollage,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCanvasReady = useCallback((canvas: any) => {
    canvasRef.current = canvas as FabricCanvas;
  }, []);

  const handleCanvasChange = useCallback(() => {
    if (canvasRef.current) {
      // Include custom properties in serialization
      const json = JSON.stringify(
        (canvasRef.current as unknown as { toJSON: (props: string[]) => unknown }).toJSON(['clipShapeId', 'isPlaceholder'])
      );
      updateCanvasJSON(json);
    }
  }, [updateCanvasJSON]);

  const addText = useCallback(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    const text = new fabric.IText('Double-click to edit', {
      left: 100,
      top: 100,
      fontFamily: 'Georgia, serif',
      fontSize: 24,
      fill: '#8B7355',
    });

    canvasRef.current.add(text);
    canvasRef.current.setActiveObject(text);
    canvasRef.current.renderAll();
  }, []);

  const addSticker = useCallback((svgString: string) => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    fabric.loadSVGFromString(svgString).then(({ objects, options }) => {
      const svg = fabric.util.groupSVGElements(objects as fabric.FabricObject[], options);
      svg.set({
        left: 100 + Math.random() * 200,
        top: 100 + Math.random() * 200,
        scaleX: 1,
        scaleY: 1,
      });

      canvasRef.current?.add(svg);
      canvasRef.current?.setActiveObject(svg);
      canvasRef.current?.renderAll();
    });
  }, []);

  const addImages = useCallback(async (files: FileList | null) => {
    if (!files || !addImagesRef.current) return;
    await addImagesRef.current(files);
  }, []);

  const handleLayerAction = useCallback((action: string) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current as unknown as {
      bringObjectForward: (obj: unknown) => void;
      sendObjectBackwards: (obj: unknown) => void;
      bringObjectToFront: (obj: unknown) => void;
      sendObjectToBack: (obj: unknown) => void;
      remove: (obj: unknown) => void;
      add: (obj: unknown) => void;
      setActiveObject: (obj: unknown) => void;
      discardActiveObject: () => void;
      renderAll: () => void;
      clear: () => void;
      getObjects: () => unknown[];
    };

    // Handle clearAll separately since it doesn't need an active object
    if (action === 'clearAll') {
      const objects = canvas.getObjects();
      objects.forEach((obj) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
      return;
    }

    const activeObj = canvasRef.current.getActiveObject();
    if (!activeObj) return;

    switch (action) {
      case 'bringToFront':
        canvas.bringObjectToFront(activeObj);
        break;
      case 'sendToBack':
        canvas.sendObjectToBack(activeObj);
        break;
      case 'delete':
        canvas.remove(activeObj);
        canvas.discardActiveObject();
        break;
      case 'duplicate':
        // Fabric.js v7 clone returns a Promise
        (activeObj as unknown as { clone: () => Promise<FabricObject> }).clone?.().then((cloned: FabricObject) => {
          cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 });
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.renderAll();
        });
        return; // Don't renderAll here, it's done in the promise
    }
    canvas.renderAll();
  }, []);

  // Handle object selection to detect image and its shape
  const handleObjectSelected = useCallback((selected: boolean) => {
    setHasSelection(selected);

    if (!selected || !canvasRef.current) {
      setHasImageSelection(false);
      setCurrentImageShape(null);
      return;
    }

    const activeObj = canvasRef.current.getActiveObject();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isImage = isFabricImage(activeObj as any);
    setHasImageSelection(isImage);

    if (isImage) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shapeId = getClipShapeId(activeObj as any);
      setCurrentImageShape(shapeId);
    } else {
      setCurrentImageShape(null);
    }
  }, []);

  // Apply a shape to the selected image
  const handleApplyShape = useCallback((shapeId: ClipShapeId) => {
    if (!canvasRef.current) return;

    const activeObj = canvasRef.current.getActiveObject();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!isFabricImage(activeObj as any)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyClipPathToImage(activeObj as any, shapeId);
    setCurrentImageShape(shapeId);
    canvasRef.current.renderAll();
  }, []);

  // Remove shape from the selected image
  const handleRemoveShape = useCallback(() => {
    if (!canvasRef.current) return;

    const activeObj = canvasRef.current.getActiveObject();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!isFabricImage(activeObj as any)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    removeClipPathFromImage(activeObj as any);
    setCurrentImageShape(null);
    canvasRef.current.renderAll();
  }, []);

  const exportCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const dataUrl = canvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
    });

    const link = document.createElement('a');
    link.download = `${book?.title || 'collage'}-mood.png`;
    link.href = dataUrl;
    link.click();
  }, [book]);

  const handleUndo = useCallback(() => {
    const state = undo();
    if (state && canvasRef.current) {
      canvasRef.current.loadFromJSON(JSON.parse(state), () => {
        canvasRef.current?.renderAll();
      });
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const state = redo();
    if (state && canvasRef.current) {
      canvasRef.current.loadFromJSON(JSON.parse(state), () => {
        canvasRef.current?.renderAll();
      });
    }
  }, [redo]);

  const handleBackgroundChange = useCallback((color: string) => {
    if (!canvasRef.current) return;
    setBackgroundColor(color);
    (canvasRef.current as unknown as { backgroundColor: string }).backgroundColor = color;
    canvasRef.current.renderAll();
  }, []);

  // Clear all placeholder frames from canvas
  const clearPlaceholders = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current as unknown as {
      getObjects: () => Array<{ isPlaceholder?: boolean }>;
      remove: (obj: unknown) => void;
      renderAll: () => void;
    };

    const objects = canvas.getObjects();
    const placeholders = objects.filter((obj) => obj.isPlaceholder === true);
    placeholders.forEach((obj) => canvas.remove(obj));
    canvas.renderAll();
    setHasPlaceholders(false);
  }, []);

  // Handle placeholder click to upload image
  const handlePlaceholderClick = useCallback((placeholder: fabric.Rect) => {
    activePlaceholderRef.current = placeholder;
    placeholderInputRef.current?.click();
  }, []);

  // Handle image upload into placeholder
  const handlePlaceholderImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const placeholder = activePlaceholderRef.current;

    if (!file || !placeholder || !canvasRef.current) {
      e.target.value = '';
      return;
    }

    try {
      const resized = await resizeImage(file, 800, 800);

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(resized);
      });

      const img = await fabric.FabricImage.fromURL(dataUrl);

      // Get placeholder bounds
      const placeholderLeft = placeholder.left || 0;
      const placeholderTop = placeholder.top || 0;
      const placeholderWidth = placeholder.width || 100;
      const placeholderHeight = placeholder.height || 100;
      const placeholderAngle = placeholder.angle || 0;

      // Scale image to cover the placeholder completely
      const imgWidth = img.width || 1;
      const imgHeight = img.height || 1;
      const scaleX = placeholderWidth / imgWidth;
      const scaleY = placeholderHeight / imgHeight;
      const scale = Math.max(scaleX, scaleY); // Cover the placeholder

      // Create a clip path to crop the image to placeholder bounds
      const clipRect = new fabric.Rect({
        width: placeholderWidth / scale,
        height: placeholderHeight / scale,
        originX: 'center',
        originY: 'center',
      });

      img.set({
        left: placeholderLeft + placeholderWidth / 2,
        top: placeholderTop + placeholderHeight / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        angle: placeholderAngle,
        clipPath: clipRect,
      });

      const canvas = canvasRef.current as unknown as {
        add: (obj: unknown) => void;
        remove: (obj: unknown) => void;
        setActiveObject: (obj: unknown) => void;
        renderAll: () => void;
        getObjects: () => Array<{ isPlaceholder?: boolean }>;
      };

      // Remove the placeholder and add the image
      canvas.remove(placeholder);
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();

      // Check if there are any placeholders left
      const remainingPlaceholders = canvas.getObjects().filter(obj => obj.isPlaceholder === true);
      if (remainingPlaceholders.length === 0) {
        setHasPlaceholders(false);
      }
    } catch (error) {
      console.error('Failed to add image to placeholder:', error);
    }

    // Reset
    activePlaceholderRef.current = null;
    e.target.value = '';
  }, []);

  // Apply a template to the canvas
  const handleApplyTemplate = useCallback((templateId: TemplateId) => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    const template = getTemplateById(templateId);
    if (!template) return;

    // Clear existing placeholders first
    clearPlaceholders();

    const canvas = canvasRef.current as unknown as {
      width: number;
      height: number;
      add: (obj: unknown) => void;
      sendObjectToBack: (obj: unknown) => void;
      renderAll: () => void;
    };

    // Use the actual canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Generate placeholder rectangles from template
    const placeholders = template.generate(canvasWidth, canvasHeight);

    // Create Fabric Rect objects for each placeholder
    placeholders.forEach((placeholder) => {
      const rect = new fabric.Rect({
        left: placeholder.left,
        top: placeholder.top,
        width: placeholder.width,
        height: placeholder.height,
        angle: placeholder.angle || 0,
        fill: 'rgba(200, 200, 200, 0.2)',
        stroke: '#999',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: true,
        hoverCursor: 'pointer',
        // Custom property to identify placeholders
        isPlaceholder: true,
      } as fabric.RectProps & { isPlaceholder: boolean; hoverCursor: string });

      // Add click handler to open file picker
      rect.on('mouseup', () => {
        handlePlaceholderClick(rect);
      });

      canvas.add(rect);
      canvas.sendObjectToBack(rect);
    });

    canvas.renderAll();
    setHasPlaceholders(true);
  }, [clearPlaceholders, handlePlaceholderClick]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading collage builder...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href={`/book/${bookId}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-serif text-lg font-semibold">Mood Collage</h1>
                {book && (
                  <p className="text-sm text-muted-foreground">{book.title}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} />

              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUndo}
                  disabled={!canUndo()}
                  className="h-8 w-8"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRedo}
                  disabled={!canRedo()}
                  className="h-8 w-8"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="secondary" onClick={exportCanvas}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Canvas Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center bg-muted rounded-lg p-1">
                <button
                  onClick={() => setActiveTool('select')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    activeTool === 'select'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  title="Select tool"
                >
                  <MousePointer className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setActiveTool('text');
                    addText();
                  }}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    activeTool === 'text'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  title="Add text"
                >
                  <Type className="h-4 w-4" />
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Add Image
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  addImages(e.target.files);
                  e.target.value = ''; // Reset to allow selecting same file again
                }}
              />
              <input
                ref={placeholderInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePlaceholderImageUpload}
              />

              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  {showSidebar ? 'Hide' : 'Show'} Sidebar
                </Button>
              </div>
            </div>

            {/* Canvas */}
            <CollageCanvas
              onCanvasReady={handleCanvasReady}
              onObjectSelected={handleObjectSelected}
              onCanvasChange={handleCanvasChange}
              onAddImagesReady={(fn) => { addImagesRef.current = fn; }}
              width={showSidebar ? 800 : 1000}
              height={600}
            />

            <p className="text-sm text-muted-foreground mt-2 text-center">
              Drag and drop images onto the canvas, or use the tools above
            </p>
          </div>

          {/* Sidebar */}
          {showSidebar && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-80 space-y-4"
            >
              {/* Templates */}
              <Card>
                <CardContent className="pt-4">
                  <TemplateSelector
                    onSelectTemplate={handleApplyTemplate}
                    onClearTemplate={clearPlaceholders}
                    hasPlaceholders={hasPlaceholders}
                  />
                </CardContent>
              </Card>

              {/* Stickers */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sticker className="h-4 w-4" />
                    <span className="font-medium">Stickers</span>
                  </div>
                  <StickerLibrary onSelectSticker={addSticker} />
                </CardContent>
              </Card>

              {/* Background Color */}
              <Card>
                <CardContent className="pt-4">
                  <BackgroundColorPicker
                    currentColor={backgroundColor}
                    onColorChange={handleBackgroundChange}
                  />
                </CardContent>
              </Card>

              {/* Layer Controls */}
              <Card>
                <CardContent className="pt-4">
                  <LayerControls
                    hasSelection={hasSelection}
                    onBringToFront={() => handleLayerAction('bringToFront')}
                    onSendToBack={() => handleLayerAction('sendToBack')}
                    onDelete={() => handleLayerAction('delete')}
                    onDuplicate={() => handleLayerAction('duplicate')}
                    onClearAll={() => handleLayerAction('clearAll')}
                  />
                </CardContent>
              </Card>

              {/* Shape Cropper */}
              <Card>
                <CardContent className="pt-4">
                  <ShapeCropper
                    hasImageSelected={hasImageSelection}
                    currentShape={currentImageShape}
                    onApplyShape={handleApplyShape}
                    onRemoveShape={handleRemoveShape}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
