"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ImageEditorProps {
  src: string;
  onSave: (editedUrl: string) => void;
  onCancel: () => void;
}

type Tool = "crop" | "rotate-left" | "rotate-right" | "flip-h" | "flip-v" | "zoom" | "pan" | "reset";

export default function ImageEditor({ src, onSave, onCancel }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [cropRect, setCropRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !imgRef.current) return;

    const img = imgRef.current;
    const rad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));

    const newWidth = img.width * cos + img.height * sin;
    const newHeight = img.width * sin + img.height * cos;

    canvas.width = newWidth * zoom;
    canvas.height = newHeight * zoom;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2 + pan.x, canvas.height / 2 + pan.y);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    ctx.restore();
  }, [rotation, flipH, flipV, zoom, pan]);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      draw();
    };
    img.onerror = () => {
      setError("Failed to load image for editing");
    };
    img.src = src;
  }, [src, draw]);

  useEffect(() => {
    draw();
  }, [rotation, flipH, flipV, zoom, pan, draw]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isCropping) {
      setCropStart({ x, y });
      setCropRect({ x, y, w: 0, h: 0 });
    } else {
      setIsPanning(true);
      setPanStart({ x: x - pan.x, y: y - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isPanning) {
      setPan({ x: x - panStart.x, y: y - panStart.y });
    }
    if (isCropping && cropStart) {
      setCropRect({
        x: Math.min(cropStart.x, x),
        y: Math.min(cropStart.y, y),
        w: Math.abs(x - cropStart.x),
        h: Math.abs(y - cropStart.y),
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(Math.max(z + delta, 0.1), 5));
  };

  const applyTool = (tool: Tool) => {
    switch (tool) {
      case "rotate-left":
        setRotation((r) => (r - 90) % 360);
        break;
      case "rotate-right":
        setRotation((r) => (r + 90) % 360);
        break;
      case "flip-h":
        setFlipH((f) => !f);
        break;
      case "flip-v":
        setFlipV((f) => !f);
        break;
      case "reset":
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setCropRect(null);
        setIsCropping(false);
        break;
    }
  };

  const handleCrop = () => {
    if (!cropRect || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cropped = document.createElement("canvas");
    cropped.width = cropRect.w;
    cropped.height = cropRect.h;
    const cctx = cropped.getContext("2d");
    if (!cctx) return;

    cctx.drawImage(canvas, cropRect.x, cropRect.y, cropRect.w, cropRect.h, 0, 0, cropRect.w, cropRect.h);

    const newSrc = cropped.toDataURL("image/png");
    const newImg = new window.Image();
    newImg.onload = () => {
      imgRef.current = newImg;
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setCropRect(null);
      setIsCropping(false);
    };
    newImg.src = newSrc;
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas not ready");

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setError("Failed to export image");
          setSaving(false);
          return;
        }

        const file = new File([blob], "edited.png", { type: "image/png" });
        const formData = new FormData();
        formData.append("image", file);

        try {
          const res = await fetch("/api/admin/portfolio/upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: `edited-${Date.now()}.png`, contentType: "image/png" }),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Failed to get upload URL");
          }

          const { signedUrl, publicUrl } = await res.json();

          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", signedUrl);
            xhr.setRequestHeader("Content-Type", "image/png");
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) resolve();
              else reject(new Error(`Upload failed (${xhr.status})`));
            };
            xhr.onerror = () => reject(new Error("Network error during upload"));
            xhr.send(blob);
          });

          onSave(publicUrl);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed");
          setSaving(false);
        }
      }, "image/png");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  };

  const tools: { key: Tool; label: string; icon: string }[] = [
    { key: "crop", label: "Crop", icon: "C" },
    { key: "rotate-left", label: "Rotate Left", icon: "↺" },
    { key: "rotate-right", label: "Rotate Right", icon: "↻" },
    { key: "flip-h", label: "Flip H", icon: "⇿" },
    { key: "flip-v", label: "Flip V", icon: "⇅" },
    { key: "zoom", label: "Zoom", icon: "⊕" },
    { key: "reset", label: "Reset", icon: "⟲" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white font-display">Image Editor</h3>
          <div className="flex gap-2">
            {isCropping && cropRect && (
              <button onClick={handleCrop} className="rounded-lg bg-brand-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-purple-500 transition-colors">Apply Crop</button>
            )}
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-brand-purple-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-purple-500 disabled:opacity-50 transition-colors">
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={onCancel} className="rounded-lg border border-white/10 px-4 py-1.5 text-xs font-medium text-gray-300 hover:text-white transition-colors">Cancel</button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-4 flex items-center justify-center bg-black/40">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className={`max-w-full max-h-[60vh] object-contain border border-white/10 rounded-lg ${isCropping ? "cursor-crosshair" : isPanning ? "cursor-grab" : "cursor-default"}`}
          />
        </div>

        <div className="p-4 border-t border-white/5 flex items-center gap-2 flex-wrap">
          {tools.map((tool) => (
            <button
              key={tool.key}
              onClick={() => {
                if (tool.key === "crop") {
                  setIsCropping(!isCropping);
                } else if (tool.key === "zoom") {
                  setZoom((z) => Math.min(z + 0.2, 5));
                } else {
                  applyTool(tool.key);
                }
              }}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                (tool.key === "crop" && isCropping) ? "bg-brand-purple-500/20 border-brand-purple-500/50 text-brand-purple-300" : "border-white/10 text-gray-300 hover:text-white hover:border-white/20"
              }`}
            >
              {tool.label}
            </button>
          ))}
          <div className="ml-auto text-xs text-gray-500">
            Zoom: {(zoom * 100).toFixed(0)}% | Rotation: {rotation}°
          </div>
        </div>

        {error && (
          <div className="px-4 pb-4">
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
