"use client"
import React, { useState } from 'react'
import { Calendar, Settings, Pencil } from 'lucide-react'
import EditProfile from '../components/MyProfileComponents/EditProfile'
import { useSession } from 'next-auth/react'
import AttendedEvents from '../components/MyProfileComponents/AttendedEvents'
import { EventList } from '../components/MyProfileComponents/ProfileEventList'

type TabType = 'personal' | 'events' | 'security';

export default function Page() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const tabs = [
    {
      id: 'personal',
      label: 'Personal Information',
      icon: <Settings size={20} />,
      component: <EditProfile />
    },
    {
      id: 'events',
      label: session?.user.role === "company" ? "Hosted Events" : "Attended Events",
      icon: <Calendar size={20} />,
      component: session?.user.role === "company" ? <EventList key="hosted" type='hosted' gridCols={2} /> : 
      <AttendedEvents />,
    },
  ];

  if (session?.user.role === "company") {
    tabs.push({
      id: 'drafts',
      label: 'My drafts',
      icon: <Pencil size={20} />,
      component: <EventList key="drafts" type='drafts' gridCols={2} />
    });
  }
  
  return (
    <main className='w-[70%] mx-auto mt-20'>
      <h1 className='font-bold text-3xl'>Profile Settings</h1>
      <div className='flex gap-20'>
        <ul className='mt-10 space-y-4 text-nowrap'>
          {tabs.map((tab) => (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 cursor-pointer transition-colors
                ${activeTab === tab.id 
                  ? 'text-gray-700 font-bold' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.icon}
              {tab.label}
            </li>
          ))}
        </ul>
        
        <div className='flex-1'>
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </main>
  )
}