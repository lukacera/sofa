import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { EventType } from '@/app/types/Event';
import { useSession } from 'next-auth/react';

interface ConfirmationModalProps {
  event: EventType;
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  event, 
  isOpen, 
  onClose,
}) => {
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const {data: session, status} = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      console.log(session.user.id);
      setUserId(session.user.id);
    }
  }, [status, session]);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event._id,
          userId: userId, 
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/my-calendar');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold">Confirm Registration</h3>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-gray-600">
            Are you sure you want to register for &quot;{event.title}&quot;?
          </p>
          <p className="text-gray-600">
            After confirmation, you will be redirected to your calendar.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;