"use client";

import ImageWithFallback from "@/components/ImageWithFallback";

interface ProductImageProps {
  imageUrl: string | null;
  name: string;
}

export default function ProductImage({ imageUrl, name }: ProductImageProps) {
  const fallbackElement = (
    <div className="w-full h-full flex items-center justify-center text-8xl">🌱</div>
  );

  if (!imageUrl) {
    return fallbackElement;
  }

  return (
    <ImageWithFallback
      src={imageUrl}
      alt={name}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 50vw"
      priority
      fallbackElement={fallbackElement}
    />
  );
}
