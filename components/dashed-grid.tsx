/**
 * Decorative dashed grid background.
 * Extracted from page.tsx and design/page.tsx to eliminate duplication.
 *
 * @param fadeTop — When true, applies a radial gradient mask so the grid
 *                  fades out towards the bottom (used on the landing page).
 */

interface DashedGridProps {
  fadeTop?: boolean;
}

export function DashedGrid({ fadeTop = false }: DashedGridProps) {
  const baseMask = `
    repeating-linear-gradient(
      to right,
      black 0px,
      black 3px,
      transparent 3px,
      transparent 8px
    ),
    repeating-linear-gradient(
      to bottom,
      black 0px,
      black 3px,
      transparent 3px,
      transparent 8px
    )`;

  const maskImage = fadeTop
    ? `${baseMask},
       radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)`
    : baseMask;

  return (
    <div
      className="absolute inset-0 -z-10 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, #e7e5e4 1px, transparent 1px),
          linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 0',
        maskImage,
        WebkitMaskImage: maskImage,
        maskComposite: 'intersect',
        WebkitMaskComposite: 'source-in' as string,
      }}
    />
  );
}
