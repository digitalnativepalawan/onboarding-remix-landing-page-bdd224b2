import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 rounded-md border border-border bg-transparent cursor-pointer shrink-0"
          aria-label={`${label} color`}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="font-mono text-xs uppercase"
          maxLength={7}
        />
      </div>
    </div>
  );
}
