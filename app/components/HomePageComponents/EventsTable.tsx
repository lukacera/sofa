import { EventType } from '@/app/types/Event'
import React from 'react'
import ModalWrapper from './ModalWrapper'
import Link from 'next/link'

export const EventsTable: React.FC<{
    events: EventType[],
    title: string
}> = ({events, title}) => {
  return (
    <>
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                    {title}
                </h2>
                <ModalWrapper title="All Events" events={events} />
            </div>
            <div className="p-6">
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                        <th className="pb-3 font-medium">Event Name</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Registered</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {events.length > 0 ? (
                        events
                        .slice(0, 3)
                        .map((event) => (
                            <tr key={event._id} className="hover:bg-gray-100 cursor-pointer">
                            <td className="px-2 py-4 text-sm font-medium text-gray-900">
                              <Link href={`/events/${event._id}`}>
                                {event.title}
                              </Link>
                            </td>
                            <td className="px-2 py-4 text-sm text-gray-500">
                              <Link href={`/events/${event._id}`}>
                                {new Date(event.date).toLocaleDateString()}
                              </Link>
                            </td>
                            <td className="px-2 py-4 text-sm text-gray-500">
                              <Link href={`/events/${event._id}`}>
                                {event.attendees.length}
                              </Link>
                            </td>
                          </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan={3} className="py-6 text-center text-gray-500">
                            No upcoming events scheduled
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    </> 
  )
}
