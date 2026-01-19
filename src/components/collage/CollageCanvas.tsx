'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { useDropzone } from 'react-dropzone';
import { ImagePlus } from 'lucide-react';
import { useCollageStore } from '@/stores/collageStore';
import { useUndoRedo } from '@/hooks';
import { resizeImage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CollageCanvasProps {
  onCanvasReady: (canvas: fabric.Canvas) => void;
  onObjectSelected: (selected: boolean) => void;
  onCanvasChange: () => void;
  width?: number;
  height?: number;
}

export function CollageCanvas({
  onCanvasReady,
  onObjectSelected,
  onCanvasChange,
  width = 800,
  height = 600,
}: CollageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { currentCollage, pushHistory } = useCollageStore();

  useUndoRedo({
    onUndo: (state) => {
      if (fabricRef.current && state) {
        fabricRef.current.loadFromJSON(JSON.parse(state)).then(() => {
          fabricRef.current?.renderAll();
        });
      }
    },
    onRedo: (state) => {
      if (fabricRef.current && state) {
        fabricRef.current.loadFromJSON(JSON.parse(state)).then(() => {
          fabricRef.current?.renderAll();
        });
      }
    },
    enabled: isReady,
  });

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#FDF6E3',
      selection: true,
      preserveObjectStacking: true,
    });

    // Event handlers
    canvas.on('selection:created', () => onObjectSelected(true));
    canvas.on('selection:updated', () => onObjectSelected(true));
    canvas.on('selection:cleared', () => onObjectSelected(false));

    canvas.on('object:added', () => {
      saveState();
      onCanvasChange();
    });
    canvas.on('object:modified', () => {
      saveState();
      onCanvasChange();
    });
    canvas.on('object:removed', () => {
      saveState();
      onCanvasChange();
    });

    function saveState() {
      if (fabricRef.current) {
        const json = JSON.stringify(fabricRef.current.toJSON());
        pushHistory(json);
      }
    }

    fabricRef.current = canvas;
    setIsReady(true);
    onCanvasReady(canvas as unknown as fabric.Canvas);

    // Load existing state if available
    if (currentCollage?.canvasJSON) {
      try {
        canvas.loadFromJSON(JSON.parse(currentCollage.canvasJSON)).then(() => {
          canvas.renderAll();
        });
      } catch (e) {
        console.error('Failed to load canvas state:', e);
      }
    }

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle image drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!fabricRef.current) return;

    for (const file of acceptedFiles) {
      try {
        const resized = await resizeImage(file, 800, 800);
        const reader = new FileReader();

        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string;

          try {
            const img = await fabric.FabricImage.fromURL(dataUrl);
            if (!fabricRef.current) return;

            // Scale down if too large
            const maxSize = 300;
            if (img.width && img.height) {
              const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
              img.scale(scale);
            }

            // Center the image
            img.set({
              left: (width - (img.getScaledWidth() || 0)) / 2,
              top: (height - (img.getScaledHeight() || 0)) / 2,
            });

            fabricRef.current.add(img);
            fabricRef.current.setActiveObject(img);
            fabricRef.current.renderAll();
          } catch (imgError) {
            console.error('Failed to create image:', imgError);
          }
        };

        reader.readAsDataURL(resized);
      } catch (error) {
        console.error('Failed to add image:', error);
      }
    }
  }, [width, height]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    noClick: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative rounded-lg overflow-hidden border-2 transition-colors',
        isDragActive ? 'border-primary border-dashed' : 'border-border'
      )}
    >
      <input {...getInputProps()} />

      <canvas ref={canvasRef} />

      {/* Drop overlay */}
      {isDragActive && (
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-primary">
            <ImagePlus className="h-12 w-12" />
            <span className="font-medium">Drop images here</span>
          </div>
        </div>
      )}
    </div>
  );
}
