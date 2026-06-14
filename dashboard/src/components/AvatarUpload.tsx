import { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { uploadAvatar } from "@/api/client";

type Props = {
  /** Currently displayed avatar URL (may be a Google photo, an upload, or null). */
  currentUrl: string | null;
  /** Initials or text to show when no photo is set. */
  fallback: string;
  /** Pixel size of the circular avatar. */
  size?: number;
  /** Called with the new URL after a successful upload. */
  onUploaded: (url: string) => void;
  /** Optional: clear the photo. */
  onRemove?: () => void;
};

const MAX_MB = 5;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export function AvatarUpload({
  currentUrl,
  fallback,
  size = 112,
  onUploaded,
  onRemove,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const display = previewUrl || currentUrl;
  const dim = `${size}px`;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File too large (max ${MAX_MB} MB).`);
      return;
    }

    // Show a local preview immediately for snappy UX.
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setUploading(true);
    try {
      const { url } = await uploadAvatar(file);
      onUploaded(url);
      // Once the real URL is in, drop the blob preview.
      setPreviewUrl(null);
      URL.revokeObjectURL(localUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setPreviewUrl(null);
      URL.revokeObjectURL(localUrl);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label={display ? "Change profile photo" : "Add profile photo"}
        className="relative rounded-full focus:outline-none focus:ring-4 focus:ring-primary-soft/40"
        style={{ width: dim, height: dim }}
      >
        {display ? (
          <img
            src={display}
            alt=""
            width={size}
            height={size}
            className="h-full w-full rounded-full object-cover shadow-md ring-4 ring-surface"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-primary to-info font-extrabold text-white shadow-md ring-4 ring-surface"
            style={{ fontSize: size * 0.32 }}
          >
            {fallback}
          </span>
        )}

        {/* Camera badge */}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-ink-heading text-white shadow-md ring-4 ring-page"
        >
          <Camera className="h-4 w-4" />
        </span>

        {/* Uploading overlay */}
        {uploading && (
          <span
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center rounded-full bg-black/40 ring-4 ring-surface"
          >
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        capture="environment"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />

      <div className="mt-3 flex flex-col items-center gap-1">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex h-9 items-center gap-1.5 rounded-input border border-black/10 bg-surface px-3 text-sm font-semibold text-ink-heading hover:bg-card disabled:opacity-60"
          >
            <Camera className="h-3.5 w-3.5" aria-hidden="true" />
            {display ? "Change photo" : "Upload photo"}
          </button>
          {display && onRemove && (
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                onRemove();
              }}
              disabled={uploading}
              aria-label="Remove photo"
              className="grid h-9 w-9 place-items-center rounded-input border border-black/10 bg-surface text-danger hover:bg-danger/5 disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-ink-muted">
          JPG, PNG, WebP or GIF · up to {MAX_MB} MB
        </p>
        {error && (
          <p role="alert" className="text-xs font-medium text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
