"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  // The listing image (main) opens first; fall back to the first upload.
  const initialIndex = Math.max(
    0,
    images.findIndex((image) => image.main),
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const active = images[activeIndex];

  if (!active) {
    return (
      <div
        aria-hidden="true"
        className="flex items-center justify-center aspect-square rounded-[16px] bg-gradient-to-br from-gold-light/30 to-gold/20 text-6xl"
      >
        🏺
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square rounded-[16px] overflow-hidden bg-surface border border-[#e0e0e0] shadow-sm">
        <Image
          src={active.url}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${productName} — görsel ${index + 1}`}
              aria-current={index === activeIndex}
              className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-surface border-2 transition-all hover:scale-105 ${
                index === activeIndex
                  ? "border-gold"
                  : "border-transparent hover:border-gold-light"
              }`}
            >
              <Image
                src={image.thumbnailPath ?? image.url}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
