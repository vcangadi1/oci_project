"use client";

import type { ReactNode } from "react";

interface HeroBannerProps {
  children: ReactNode;
}

export default function HeroBanner({ children }: HeroBannerProps) {
  return (
    <div className="hero-banner text-center mb-6">
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6">{children}</div>
    </div>
  );
}
