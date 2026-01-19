'use client';

import { motion } from 'framer-motion';
import { useCollageStore } from '@/stores/collageStore';
import { getStickersByCategory, stickerCategories } from '@/lib/fabric/stickers';
import { cn } from '@/lib/utils';

interface StickerLibraryProps {
  onSelectSticker: (svgString: string) => void;
}

export function StickerLibrary({ onSelectSticker }: StickerLibraryProps) {
  const { stickerCategory, setStickerCategory } = useCollageStore();
  const stickers = getStickersByCategory(stickerCategory);

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {stickerCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setStickerCategory(cat.id)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              stickerCategory === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sticker grid */}
      <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto scrollbar-cozy pr-1">
        {stickers.map((sticker) => (
          <motion.button
            key={sticker.id}
            onClick={() => onSelectSticker(sticker.svg)}
            className={cn(
              'aspect-square p-2 rounded-lg',
              'bg-card border border-border',
              'hover:border-primary hover:bg-primary/5',
              'transition-colors',
              'flex items-center justify-center'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={sticker.name}
          >
            <div
              className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: sticker.svg }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
