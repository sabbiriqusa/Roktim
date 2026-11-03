/**
 * Image processing utilities for profile photo uploads
 * Enforces size limits, validates formats, and optimizes dimensions
 */

export const MAX_PHOTO_SIZE_MB = 2; // 2 Megabytes limit

export async function processAndCompressImage(
  file: File,
  maxSizeMB: number = MAX_PHOTO_SIZE_MB,
  maxDimension: number = 800
): Promise<string> {
  // Validate MIME type
  if (!file.type.startsWith('image/')) {
    throw new Error('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।');
  }

  // Strict size limit validation
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(`ছবির আকার সর্বোচ্চ ${maxSizeMB} MB হতে পারবে। আপনার নির্বাচিত ছবিটির আকার ${sizeInMB} MB।`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Scale down if exceeding max dimension while preserving aspect ratio
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          // Smooth rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Return optimized JPEG base64 string
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          resolve(optimizedDataUrl);
        } catch (canvasErr) {
          // Fallback to raw data url if canvas has issue
          resolve(event.target?.result as string);
        }
      };

      img.onerror = () => {
        reject(new Error('ছবি পড়তে সমস্যা হয়েছে। অন্য ছবি নির্বাচন করুন।'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('ডিভাইস থেকে ফাইল লোড করা যায়নি।'));
    };

    reader.readAsDataURL(file);
  });
}
