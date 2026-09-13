import Image from "next/image";
import { brandAssets } from "@/lib/brand";

type BrandLogoProps = {
  variant?: "black" | "white";
  alt?: string;
  className?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  sizes?: string;
  unoptimized?: boolean;
};

export function BrandLogo({
  variant = "white",
  alt = brandAssets.logo.alt,
  className,
  priority,
  loading,
  sizes = "160px",
  unoptimized,
}: BrandLogoProps) {
  return (
    <Image
      src={brandAssets.logo[variant]}
      alt={alt}
      width={brandAssets.logo.width}
      height={brandAssets.logo.height}
      className={className}
      priority={priority}
      loading={loading}
      sizes={sizes}
      unoptimized={unoptimized}
      aria-hidden={alt === "" ? true : undefined}
    />
  );
}
