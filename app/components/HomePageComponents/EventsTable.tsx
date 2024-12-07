import { EventType } from '@/app/types/Event'
import React from 'react'
import ModalWrapper from './ModalWrapper'

export const EventsTable: React.FC<{
    events: EventType[]
}> = ({events}) => {
  return (
    <>
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
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
                        <tr key={event._id} className="group hover:bg-gray-50">
                            <td className="py-4 text-sm font-medium text-gray-900">{event.title}</td>
                            <td className="py-4 text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()}
                            </td>
                            <td className="py-4 text-sm text-gray-500">{event.attendees.length}</td>
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
