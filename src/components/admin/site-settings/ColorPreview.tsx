interface ColorPreviewProps {
  primary: string;
  secondary: string;
  accent: string;
}

export default function ColorPreview({ primary, secondary, accent }: ColorPreviewProps) {
  return (
    <div className="rounded-lg border border-border/50 p-4 space-y-3 bg-muted/20">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Live preview</p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded-md text-xs font-medium shadow-sm"
          style={{ backgroundColor: primary, color: secondary }}
        >
          Primary Button
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-md text-xs font-medium shadow-sm border"
          style={{ backgroundColor: secondary, color: primary, borderColor: primary }}
        >
          Secondary Button
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-md text-xs font-medium shadow-sm"
          style={{ backgroundColor: accent, color: "#ffffff" }}
        >
          Accent Action
        </button>
      </div>

      <div
        className="rounded-md p-3"
        style={{ backgroundColor: primary, color: secondary, borderLeft: `4px solid ${accent}` }}
      >
        <p className="text-xs font-semibold mb-1">Sample card</p>
        <p className="text-[11px] opacity-80">
          Headlines and body text appear like this on a primary surface.
        </p>
        <p className="text-[11px] mt-2" style={{ color: accent }}>
          Accent links and highlights stand out.
        </p>
      </div>
    </div>
  );
}
