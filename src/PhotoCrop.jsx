import React, { useState, useRef, useCallback, useEffect } from "react";
import { X, Camera, Circle, Square, Loader2 } from "lucide-react";
import { COLORS, Avatar } from "./App";

// Drop-in replacement for <Avatar .../> that opens a full-screen view of
// the photo on tap — for viewing anyone's photo (a doctor's, a patient's),
// not just your own. Pass allowChange + onFileSelected only for your own
// photo, to also show a "Change Photo" button in the viewer.
export function TappableAvatar({ src, name, size, allowChange = false, onFileSelected }){
  const [viewing, setViewing] = useState(false);
  return (
    <>
      <button onClick={(e)=>{ e.stopPropagation(); setViewing(true); }} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "inline-flex", borderRadius: "50%", flexShrink: 0 }}>
        <Avatar src={src} name={name} size={size} />
      </button>
      {viewing && (
        <AvatarViewerModal
          src={src} name={name}
          onClose={()=>setViewing(false)}
          onFileSelected={allowChange ? (f)=>{ setViewing(false); onFileSelected?.(f); } : undefined}
        />
      )}
    </>
  );
}

/* ============================================================================
   PROFILE PHOTO: VIEW + CROP
   - AvatarViewerModal: tapping your own photo opens a full-screen view of
     it (like WhatsApp/Instagram), with a "Change Photo" button to pick a
     new one — rather than immediately opening the file picker on tap.
   - PhotoCropModal: after picking a file, lets you pan and zoom to choose
     exactly which part of the photo is used, with a round/square guide to
     preview either look, before saving. react-easy-crop is loaded on
     demand (dynamic import) so it doesn't add to the app's main load.
   The saved file is always a plain square crop — AayuRahi displays every
   photo circularly throughout the app either way, so the guide toggle is
   about helping you compose the shot, not changing the saved file's shape.
============================================================================ */

export function AvatarViewerModal({ src, name, onClose, onFileSelected }){
  const fileRef = useRef(null);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.94)", zIndex: 2000, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={18} color="#fff" />
        </button>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        {src ? (
          <img src={src} alt={name} style={{ maxWidth: "88%", maxHeight: "65vh", borderRadius: 20, objectFit: "contain" }} />
        ) : (
          <Avatar name={name} size={200} />
        )}
      </div>
      <div style={{ padding: "20px 20px 44px", display: "flex", justifyContent: "center" }}>
        {onFileSelected && (
          <>
            <button
              onClick={() => fileRef.current?.click()}
              style={{ background: COLORS.primary, color: "#fff", border: "none", borderRadius: 14, padding: "12px 26px", display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
            >
              <Camera size={16} /> Change Photo
            </button>
            <input
              ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileSelected(f); e.target.value = ""; }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export function PhotoCropModal({ file, onCancel, onSave }){
  const [Cropper, setCropper] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [guideShape, setGuideShape] = useState("round"); // preview guide only
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
    import("react-easy-crop").then((mod) => setCropper(() => mod.default));
  }, [file]);

  const onCropComplete = useCallback((_croppedArea, pixels) => setCroppedAreaPixels(pixels), []);

  const save = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    setSaving(true);
    try {
      const blob = await cropToBlob(imageSrc, croppedAreaPixels);
      const finalFile = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      onSave(finalFile);
    } catch (e) {
      onCancel();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 2100, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Cancel</button>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Edit Photo</div>
        <button onClick={save} disabled={saving || !croppedAreaPixels} style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: 800, fontSize: 14, cursor: "pointer", opacity: saving || !croppedAreaPixels ? 0.6 : 1 }}>
          {saving ? "Saving..." : "Done"}
        </button>
      </div>

      <div style={{ flex: 1, position: "relative", background: "#111" }}>
        {imageSrc && Cropper ? (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape={guideShape === "round" ? "round" : "rect"}
            showGrid={guideShape === "square"}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Loader2 size={26} color="#fff" style={{ animation: "spin 1s linear infinite" }} />
          </div>
        )}
      </div>

      <div style={{ padding: "18px 24px 6px" }}>
        <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ width: "100%" }} />
      </div>
      <div style={{ padding: "6px 20px 34px", display: "flex", gap: 8, justifyContent: "center" }}>
        <button
          onClick={() => setGuideShape("round")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 20, border: "none", background: guideShape === "round" ? COLORS.primary : "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
        >
          <Circle size={14} /> Round
        </button>
        <button
          onClick={() => setGuideShape("square")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 20, border: "none", background: guideShape === "square" ? COLORS.primary : "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
        >
          <Square size={14} /> Square
        </button>
      </div>
    </div>
  );
}

// Draws the chosen square region onto a canvas and returns it as a JPEG blob.
function cropToBlob(imageSrc, pixelCrop){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("crop failed")), "image/jpeg", 0.92);
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
}
