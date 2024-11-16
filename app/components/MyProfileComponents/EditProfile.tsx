import React from 'react'

export default function EditProfile() {
    return (
    <div className='mt-10 space-y-6 w-full'>
        <div className='space-y-2'>
            <label htmlFor="firstName" className='block text-sm font-medium text-gray-700'>First Name</label>
            <input
            type="text"
            id="firstName"
            defaultValue='John'
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Enter your first name'
            />
        </div>

        <div className='space-y-2'>
            <label htmlFor="lastName" className='block text-sm font-medium text-gray-700'>Last Name</label>
            <input
            type="text"
            id="lastName"
            defaultValue='Doe'
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Enter your last name'
            />
        </div>

        <div className='space-y-2'>
            <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email</label>
            <input
            type="email"
            id="email"
            defaultValue={" [email protected]"}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Enter your email'
            />
        </div>
        <div className='space-y-2'>
            <label htmlFor="bio" className='block text-sm font-medium text-gray-700'>Bio</label>
            <textarea
            id="bio"
            defaultValue={"Lorem ipsum dolor sit, amet consectetur adipisicing elit. A, deleniti non, inventore laborum veritatis alias impedit accusantium, qui velit nulla temporibus provident consequatur ad voluptatum quasi expedita? Id, iure blanditiis."}
            rows={4}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Write a short bio about yourself'
            />
        </div>
        <div className='w-full flex justify-end'>
            <button className='px-4 py-2 bg-main rounded-xl'>
                Save changes
            </button>
        </div>
    </div>
  )
}
