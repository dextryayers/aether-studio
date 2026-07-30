import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (base64: string) => void;
  accept?: string;
}

const ACCEPT = "image/svg+xml,image/png,image/jpeg,image/webp";

export default function ImageUpload({ value, onChange, accept = ACCEPT }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState("");

  const handleFile = (file: File | undefined) => {
    setError("");
    if (!file) return;

    if (!ACCEPT.split(",").includes(file.type)) {
      setError("SVG, PNG, JPG, WebP only");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Max 20MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      setPreview(data);
      onChange(data);
    };
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setPreview("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1 lg:space-y-1.5">
      <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-zinc-500">Image</label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-10 px-4 border border-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-2 shrink-0"
        >
          <Upload className="h-3.5 w-3.5" /> Choose
        </button>
        {preview && (
          <button type="button" onClick={clear} className="p-2 text-zinc-600 hover:text-red-400 transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />
      {preview && (
        <div className="relative w-24 h-24 border border-zinc-800 overflow-hidden mt-2">
          <img src={preview} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {error && <p className="text-[9px] text-red-400 font-medium">{error}</p>}
    </div>
  );
}
