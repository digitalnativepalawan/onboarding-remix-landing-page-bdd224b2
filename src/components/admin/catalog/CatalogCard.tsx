import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, ExternalLink, Pencil, Plus, Eye, EyeOff } from "lucide-react";
import { CatalogItem, formatPHP, CATALOG_CATEGORIES } from "./types";

interface Props {
  item: CatalogItem & { id: string };
  onEdit: () => void;
  onAddToQuote: () => void;
  onToggleActive: () => void;
}

export function CatalogCard({ item, onEdit, onAddToQuote, onToggleActive }: Props) {
  const cat = CATALOG_CATEGORIES.find((c) => c.value === item.category);
  const cover = item.screenshots?.[0];

  return (
    <Card className={`overflow-hidden flex flex-col group transition-all hover:border-primary/50 ${!item.is_active ? "opacity-60" : ""}`}>
      <div className="aspect-video bg-muted/40 relative overflow-hidden border-b">
        {cover ? (
          <img src={cover} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        {cat && (
          <Badge variant="secondary" className="absolute top-2 left-2 backdrop-blur-sm bg-background/80">
            {cat.label}
          </Badge>
        )}
        {!item.is_active && (
          <Badge variant="outline" className="absolute top-2 right-2 backdrop-blur-sm bg-background/80">
            Hidden
          </Badge>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight">{item.name}</h3>
            <span className="font-mono text-sm text-primary whitespace-nowrap">{formatPHP(item.base_price_php)}</span>
          </div>
          {item.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
        </div>

        {item.features?.length > 0 && (
          <ul className="text-xs space-y-1">
            {item.features.slice(0, 3).map((f, i) => (
              <li key={i} className="flex gap-1.5 text-muted-foreground">
                <span className="text-primary">•</span>
                <span className="line-clamp-1">{f}</span>
              </li>
            ))}
            {item.features.length > 3 && (
              <li className="text-xs text-muted-foreground/70">+{item.features.length - 3} more</li>
            )}
          </ul>
        )}

        {item.tech_stack?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tech_stack.slice(0, 4).map((t, i) => (
              <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0 font-mono">{t}</Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2 border-t">
          <span>~{item.setup_days}d setup</span>
          {item.demo_url && (
            <a href={item.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
              Demo <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <div className="flex gap-1.5">
          <Button size="sm" className="flex-1" onClick={onAddToQuote}>
            <Plus className="h-3 w-3 mr-1" /> Add to Quote
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={onEdit} title="Edit">
            <Pencil className="h-3 w-3" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={onToggleActive} title={item.is_active ? "Hide" : "Show"}>
            {item.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
