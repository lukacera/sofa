"use client"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function EditProfile() {
    const { data: session, update } = useSession();
    console.log(session);
    const [formData, setFormData] = useState({
        name: session?.user?.name,
        email: session?.user?.email,
        bio: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. A, deleniti non, inventore laborum veritatis alias impedit accusantium, qui velit nulla temporibus provident consequatur ad voluptatum quasi expedita? Id, iure blanditiis."
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (session?.user) {
          setFormData(prev => ({
            ...prev,
            name: session.user.name || prev.name,
            email: session.user.email || prev.email,
          }));
        }
    }, [session?.user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async () => {
        if (!session?.user?.email) return;
        
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/users/${session.user.email}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            console.log("session is:")
            console.log(session)
            await update({
                ...session,
                user: {
                  ...session.user,
                  name: formData.name
                }
              });
            
            // Could add a success notification here
            console.log('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            // Could add an error notification here
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='mt-10 space-y-6 w-full'>
            <div className='space-y-2'>
                <label htmlFor="name" 
                className='block text-sm font-medium text-gray-700'>
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name ?? ''}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter your name'
                />
            </div>

            <div className='space-y-2'>
                <label htmlFor="email" className='block text-sm font-medium text-gray-700'>
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    disabled
                    value={formData.email ?? ''}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50'
                    placeholder='Enter your email'
                />
            </div>
            
            {session?.user?.role === 'company' && (
                <div className='space-y-2'>
                    <label htmlFor="bio" className='block text-sm font-medium text-gray-700'>
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='Write a short bio about yourself'
                    />
                </div>
            )}
            
            <div className='w-full flex justify-end'>
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-secondary text-mainWhite rounded-xl transition-colors
                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-secondary/80'}`}
                >
                    {isSubmitting ? 'Saving...' : 'Save changes'}
                </button>
            </div>
        </div>
    );
}