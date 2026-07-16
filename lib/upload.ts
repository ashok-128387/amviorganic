// Compress image before upload. Defaults are tuned for small thumbnails/icons.
// For full-width banners use maxPx=1920 (or higher) and quality >= 0.9 to avoid blur.
export async function compressImage(
  file: File,
  maxPx = 800,
  quality = 0.75,
  format: 'image/webp' | 'image/jpeg' = 'image/webp'
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width > height) { height = Math.round((height / width) * maxPx); width = maxPx; }
        else { width = Math.round((width / height) * maxPx); height = maxPx; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => resolve(blob!), format, quality);
    };
    img.src = url;
  });
}

export async function uploadImage(
  file: File,
  maxPx = 800,
  quality = 0.75,
  format: 'image/webp' | 'image/jpeg' = 'image/webp'
): Promise<string> {
  const compressed = await compressImage(file, maxPx, quality, format);
  const fd = new FormData();
  fd.append('file', compressed, `image.${format.split('/')[1]}`);
  const res = await fetch('/api/upload-image', { method: 'POST', body: fd });
  const { url } = await res.json();
  return url;
}
