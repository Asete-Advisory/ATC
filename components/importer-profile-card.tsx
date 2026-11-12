import Image from "next/image";
import { cn } from "@/lib/utils";

type ImporterProfileCardProps = {
  name: string;
  focus: string;
  image: string;
  /** Destaque (perfil em evidência na seleção do resultado). */
  active?: boolean;
  /** Atenua os demais perfis enquanto um está em destaque. */
  muted?: boolean;
  className?: string;
};

/**
 * Linha compacta (miniatura + texto) no celular; card com foto no desktop.
 */
export function ImporterProfileCard({
  name,
  focus,
  image,
  active = false,
  muted = false,
  className,
}: ImporterProfileCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 overflow-hidden rounded-xl border bg-card p-2 transition-[border-color,box-shadow,opacity,transform] duration-150 lg:block lg:rounded-2xl lg:p-0",
        active
          ? "scale-[1.02] border-accent shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_35%,transparent)]"
          : "border-border",
        muted && "opacity-45",
        className,
      )}
    >
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg lg:h-[4.5rem] lg:w-auto lg:rounded-none xl:h-20 lg:[@media(max-height:780px)]:h-12">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 220px, 48px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 lg:px-3 lg:py-2.5 lg:[@media(max-height:780px)]:py-2">
        <p className="text-sm leading-snug font-semibold text-foreground">
          {name}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
          {focus}
        </p>
      </div>
    </div>
  );
}
