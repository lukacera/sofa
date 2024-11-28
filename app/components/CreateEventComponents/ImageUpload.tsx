import { ImagePlus, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface Ticket {
  name: string;
  price: number;
  benefits: string[];
  total: number;
}
interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  image: File | null;
  type: 'conference' | 'workshop' | 'meetup' | 'seminar' | 'other';
  tickets: Ticket[];
  organizer: string;
}


interface ImageUploadProps {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  inputClasses: string;
}

export default function ImageUpload({ setFormData, inputClasses }: ImageUploadProps) {
  const [error, setError] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Store file in form data
    setFormData(prev => ({
      ...prev,
      image: file
    }));

    setError('');

    // Cleanup preview URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };

  const removeImage = () => {
    setPreviewUrl('');
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  return (
    <>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Event Image
        </label>

        {previewUrl ? (
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={previewUrl}
              alt="Event preview"
              fill
              className="object-cover cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 
              rounded-full text-white hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className={`${inputClasses} flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50`}
            >
              <ImagePlus className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">
                Click to upload event image
              </span>
            </label>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div 
          className="bg-black/60 z-50 flex fixed inset-0 
          items-center justify-center p-4"
          style={{margin: 0}}
          onClick={() => setIsModalOpen(false)}
        >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 
              rounded-full text-white z-10"
            >
              <X size={24} />
            </button>
          <div className="relative w-[70%] h-[70%] rounded-lg overflow-hidden">
            <Image
              src={previewUrl}
              alt="Event preview large"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}