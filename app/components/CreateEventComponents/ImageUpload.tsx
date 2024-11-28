import { ImagePlus, Loader2, X } from 'lucide-react';
import { useState, ChangeEvent } from 'react';
import Image from 'next/image';

interface Ticket {
    name: string;
    price: number;
    benefits: string[];
    total: number;
}
interface ImageUploadProps {
    formData: {
        title: string;
        description: string;
        date: string;
        location: string;
        capacity: number;
        image: string;
        type: 'conference' | 'workshop' | 'meetup' | 'seminar' | 'other';
        tickets: Ticket[];
        organizer: string;
      }
      ;
    setFormData: React.Dispatch<React.SetStateAction<{
        title: string;
        description: string;
        date: string;
        location: string;
        capacity: number;
        image: string;
        type: 'conference' | 'workshop' | 'meetup' | 'seminar' | 'other';
        tickets: Ticket[];
        organizer: string;
      }>>;
    inputClasses: string;
}

export default function ImageUpload({ formData, setFormData, inputClasses }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            setError('');
            
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message);
            
            setFormData(prev => ({
                ...prev,
                image: data.url
            }));
        } catch (error) {
            console.error(error);
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: ''
        }));
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                Event Image
            </label>

            {formData.image ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                        src={formData.image}
                        alt="Event preview"
                        fill
                        className="object-cover"
                    />
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
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
                        disabled={uploading}
                    />
                    <label
                        htmlFor="imageUpload"
                        className={`${inputClasses} flex flex-col items-center justify-center h-48 
                            border-2 border-dashed rounded-lg cursor-pointer 
                            hover:bg-gray-50 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Uploading...</span>
                            </div>
                        ) : (
                            <>
                                <ImagePlus className="w-8 h-8 text-gray-400" />
                                <span className="mt-2 text-sm text-gray-500">
                                    Click to upload event image
                                </span>
                            </>
                        )}
                    </label>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}