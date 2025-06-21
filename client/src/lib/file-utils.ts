export function getFileNameWithoutExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return fileName;
  return fileName.substring(0, lastDotIndex);
}

export function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return fileName.substring(lastDotIndex + 1).toLowerCase();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function isImageFile(fileName: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const extension = getFileExtension(fileName);
  return imageExtensions.includes(extension);
}

export function isVpxFile(fileName: string): boolean {
  const vpxExtensions = ['vpx', 'vpt', 'fp'];
  const extension = getFileExtension(fileName);
  return vpxExtensions.includes(extension);
}

export async function convertImageToPng(file: File, compressionLevel: 'none' | 'low' | 'high' = 'low'): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Determine quality based on compression level
        let quality = 0.9; // Default for 'low'
        switch (compressionLevel) {
          case 'none':
            quality = 1.0;
            break;
          case 'low':
            quality = 0.9;
            break;
          case 'high':
            quality = 0.6;
            break;
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            const newFileName = getFileNameWithoutExtension(file.name) + '.png';
            const newFile = new File([blob], newFileName, { type: 'image/png' });
            resolve(newFile);
          } else {
            reject(new Error('Failed to convert image'));
          }
        }, 'image/png', quality);
      } else {
        reject(new Error('Canvas context not available'));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJson(data: any, fileName: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, fileName);
}

export function readJsonFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        resolve(json);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
