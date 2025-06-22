
import { useState } from 'react';
import { Plus, X, Image as ImageIcon, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Colors, BorderRadius } from '@/theme/tokens';
import { useToast } from '@/hooks/use-toast';

interface ImagePickerRowProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  minImages?: number;
}

export const ImagePickerRow = ({ 
  images, 
  onImagesChange, 
  maxImages = 10, 
  minImages = 6 
}: ImagePickerRowProps) => {
  const { toast } = useToast();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddImage = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/jpg';
    input.multiple = true;
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      
      if (files.length === 0) return;
      
      // Check file size limit (2MB)
      const oversizedFiles = files.filter(file => file.size > 2 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast({
          title: "File too large",
          description: "Please select images smaller than 2MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check total count
      if (images.length + files.length > maxImages) {
        toast({
          title: "Too many images",
          description: `Maximum ${maxImages} images allowed`,
          variant: "destructive",
        });
        return;
      }
      
      // Convert files to URLs for preview
      const newImageUrls: string[] = [];
      let processed = 0;
      
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImageUrls.push(e.target?.result as string);
          processed++;
          
          if (processed === files.length) {
            onImagesChange([...images, ...newImageUrls]);
          }
        };
        reader.readAsDataURL(file);
      });
    };
    
    input.click();
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    onImagesChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">Property Photos</h3>
          <p className="text-gray-400 text-sm">
            Add at least {minImages} photos • Max {maxImages} • 2MB each
          </p>
        </div>
        <div className="text-orange-500 text-sm font-medium">
          {images.length}/{maxImages}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {/* Add Button */}
        {images.length < maxImages && (
          <button
            onClick={handleAddImage}
            className="flex-shrink-0 w-24 h-24 bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center hover:border-orange-500 hover:bg-gray-750 transition-colors"
          >
            <Plus className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Add</span>
          </button>
        )}

        {/* Image Previews */}
        {images.map((image, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex-shrink-0 w-24 h-24 relative rounded-xl overflow-hidden cursor-move ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
          >
            <img
              src={image}
              alt={`Property ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Remove button */}
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            {/* Index indicator */}
            <div className="absolute bottom-1 left-1 w-5 h-5 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {images.length < minImages && (
        <div className="flex items-center gap-2 text-amber-500 text-sm">
          <Camera className="w-4 h-4" />
          <span>Add {minImages - images.length} more photo{minImages - images.length !== 1 ? 's' : ''} to continue</span>
        </div>
      )}
    </div>
  );
};
