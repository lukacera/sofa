"use client"
import React, { useState } from 'react'
import Header from '../components/Header'
import { Calendar, ShieldAlert, Settings } from 'lucide-react'
import EditProfile from '../components/MyProfileComponents/EditProfile'
import { useSession } from 'next-auth/react'
import AttendedEvents from '../components/MyProfileComponents/AttendedEvents'

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
      component: <AttendedEvents />
    },
    {
      id: 'security',
      label: 'Account Security',
      icon: <ShieldAlert size={20} />,
      component: <div>Security Component</div> // Replace with your security component
    }
  ];

  return (
    <div>
      <Header />
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
          
          {/* Render active tab content */}
          <div className='flex-1'>
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        </div>
      </main>
    </div>
  )
}