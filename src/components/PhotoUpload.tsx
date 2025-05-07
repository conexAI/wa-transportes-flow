
import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  onPhotosSelected: (photos: File[]) => void;
  maxPhotos?: number;
  className?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotosSelected,
  maxPhotos = 5,
  className,
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const newPhotos: File[] = [];
    const newPreviews: string[] = [];

    // Process each selected file
    Array.from(files).forEach((file) => {
      // Check if we've reached the maximum number of photos
      if (selectedPhotos.length + newPhotos.length >= maxPhotos) return;

      // Validate file type and size
      if (!allowedTypes.includes(file.type)) {
        alert(`Tipo de arquivo não suportado: ${file.name}`);
        return;
      }

      if (file.size > maxSize) {
        alert(`Arquivo muito grande (máx 5MB): ${file.name}`);
        return;
      }

      // Add file to our arrays
      newPhotos.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (newPhotos.length > 0) {
      const updatedPhotos = [...selectedPhotos, ...newPhotos];
      const updatedPreviews = [...previews, ...newPreviews];
      
      setSelectedPhotos(updatedPhotos);
      setPreviews(updatedPreviews);
      onPhotosSelected(updatedPhotos);
    }
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...selectedPhotos];
    const updatedPreviews = [...previews];
    
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(updatedPreviews[index]);
    
    updatedPhotos.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setSelectedPhotos(updatedPhotos);
    setPreviews(updatedPreviews);
    onPhotosSelected(updatedPhotos);
  };

  const triggerFileInput = (captureMethod: '' | 'camera') => {
    if (fileInputRef.current) {
      fileInputRef.current.capture = captureMethod as any; // TypeScript doesn't fully support this attribute
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-3 mb-4">
        {selectedPhotos.length === 0 && (
          <div className="w-full p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400">
            <Image size={40} className="mb-2" />
            <p>Nenhuma foto selecionada</p>
          </div>
        )}
        
        {previews.map((preview, index) => (
          <div 
            key={index} 
            className="relative h-24 w-24 rounded-md overflow-hidden border border-gray-200"
          >
            <img 
              src={preview} 
              alt={`Preview ${index + 1}`} 
              className="h-full w-full object-cover" 
            />
            <button
              type="button"
              onClick={() => handleRemovePhoto(index)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
              aria-label="Remover foto"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => triggerFileInput('')}
          disabled={selectedPhotos.length >= maxPhotos}
        >
          <Upload className="mr-2 h-4 w-4" /> Escolher da galeria
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => triggerFileInput('camera')}
          disabled={selectedPhotos.length >= maxPhotos}
        >
          <Camera className="mr-2 h-4 w-4" /> Tirar foto
        </Button>
      </div>
      
      {selectedPhotos.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          {selectedPhotos.length}/{maxPhotos} fotos selecionadas
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
    </div>
  );
};

export default PhotoUpload;
