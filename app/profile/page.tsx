"use client"
import React, { useState, useEffect, Suspense } from 'react'
import { Calendar, Settings, Pencil } from 'lucide-react'
import EditProfile from '../components/MyProfileComponents/EditProfile'
import { useSession } from 'next-auth/react'
import { EventList } from '../components/MyProfileComponents/ProfileEventList'
import { useSearchParams } from 'next/navigation'

type TabType = 'personal' | 'events' | 'drafts';

function ProfilePageContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('personal');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    
    switch(tabParam) {
      case 'created-events':
        setActiveTab('events');
        break;
      case 'personal':
        setActiveTab('personal');
        break; 
      case 'drafts':
        if(session?.user.role === "company") {
          setActiveTab('drafts');
        }
        break;
      default:
        setActiveTab('personal');
    }
   }, [searchParams, session?.user.role]);

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Information',
      icon: <Settings size={20} />,
      component: <EditProfile />
    },
    {
      id: 'events',
      label: session?.user.role === "company" ? "Created Events" : "My Events",
      icon: <Calendar size={20} />,
      component: session?.user.role === "company" ? <EventList key="hosted" type='hosted' gridCols={2} /> : 
      <EventList key="attended" type='attended' gridCols={2} />
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
    <main className='w-[90%] lg:w-[70%] mx-auto mt-20'>
      <h1 className='font-bold text-3xl'>Profile Settings</h1>
      <div className='flex flex-col lg:flex-row gap-10 lg:gap-20'>
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

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>}>
      <ProfilePageContent />
    </Suspense>
  );
}