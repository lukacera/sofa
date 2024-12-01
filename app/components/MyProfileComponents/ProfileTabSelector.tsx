import { auth } from '@/auth'
import { Calendar, Settings, ShieldAlert } from 'lucide-react'
import React from 'react'

export default async function ProfileTabSelector() {

    const session = await auth();
    
    return (
        <ul className='mt-10 space-y-4 text-nowrap'>
            <li className='flex items-center gap-2 text-gray-700 font-bold cursor-pointer'>
                <Settings size={20} />
                Personal Information
            </li>
            <li className='flex items-center gap-2 text-gray-700 cursor-pointer'>
                <Calendar size={20} />
                {session?.user.role === "company" ? "Hosted Events" : "Attended Events"}
            </li>
            <li className='flex items-center gap-2 text-gray-700 cursor-pointer'>
                <ShieldAlert size={20} />
                Account Security
            </li>
        </ul>
    )
}
