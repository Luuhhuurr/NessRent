import { useState } from 'react';

export default function ImageGallery({ images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const gallery = images?.length ? images : [{ src: null }];

  const selected = gallery[Math.min(selectedIndex, gallery.length - 1)];

  return (
    <div className="flex flex-col gap-[var(--spacing-sm)]">
      <div className="rounded-[var(--radius-lg)] overflow-hidden border border-outline-variant bg-surface-container aspect-[4/3] w-full flex items-center justify-center">
        {selected?.src ? (
          <img
            src={selected.src}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
            photo_camera
          </span>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="grid grid-cols-4 gap-[var(--spacing-xs)]">
          {gallery.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Lihat gambar ${index + 1}`}
              className={`aspect-square rounded-[var(--radius-md)] overflow-hidden border transition-colors ${
                selectedIndex === index
                  ? 'border-primary'
                  : 'border-outline-variant hover:border-outline'
              }`}
            >
              {image?.src ? (
                <img
                  src={image.src}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full grid place-items-center bg-surface-container text-on-surface-variant">
                  <span className="material-symbols-outlined text-[22px]">image</span>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
