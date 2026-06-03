import { useState } from 'react';

export default function ImageGallery({ images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Use placeholder thumbnails if no additional images provided
  const thumbnails = images.length > 1 ? images.slice(1, 4) : [
    { src: images[0]?.src, isPlaceholder: true },
    { src: null, isPlaceholder: true },
    { src: null, isPlaceholder: true },
  ];

  return (
    <div className="space-y-[var(--spacing-md)]">
      {/* Main Image */}
      <div className="bg-surface-container-lowest rounded-[var(--radius-lg)] overflow-hidden shadow-[0_4px_20px_rgba(31,41,55,0.04)] aspect-[4/3] w-full flex items-center justify-center">
        <img
          src={images[selectedIndex]?.src || images[0]?.src}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-3 gap-[var(--spacing-xs)]">
        {thumbnails.map((thumb, index) => (
          <div
            key={index}
            onClick={() => !thumb.isPlaceholder && setSelectedIndex(index + 1)}
            className={`bg-surface-container-lowest rounded-[var(--radius-md)] overflow-hidden shadow-[0_4px_20px_rgba(31,41,55,0.04)] aspect-square border cursor-pointer transition-opacity ${
              selectedIndex === index + 1
                ? 'border-primary opacity-100'
                : 'border-surface-variant opacity-70 hover:opacity-100'
            }`}
          >
            {thumb.isPlaceholder ? (
              <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px]">
                  {index === 1 ? 'photo_camera_back' : 'sd_card'}
                </span>
              </div>
            ) : (
              <img
                src={thumb.src}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}