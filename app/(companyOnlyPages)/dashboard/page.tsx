import React from 'react';
import { Calendar, Users, FileEdit, BarChart2, TrendingUp, AlertCircle } from 'lucide-react';
import Header from "../../components/Header";

export default function CompanyDashboard() {
  // Dummy data
  const stats = {
    totalEvents: 24,
    pastEvents: 18,
    draftEvents: 3,
    totalAttendees: 1240,
    averageAttendance: 86,
    upcomingEvents: 3
  };

  const recentEvents = [
    { id: 1, name: "Tech Conference 2024", date: "2024-03-15", attendees: 150, revenue: 4500 },
    { id: 2, name: "Developer Workshop", date: "2024-03-10", attendees: 45, revenue: 1800 },
    { id: 3, name: "Startup Meetup", date: "2024-03-05", attendees: 80, revenue: 0 }
  ];

  const aiInsights = [
    "Attendance rates are 23% higher for morning events",
    "Technical workshops have shown better engagement rates",
    "Consider adding networking sessions to increase attendance"
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="pt-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Past Events</p>
                  <h3 className="text-3xl font-semibold mt-1">{stats.pastEvents}</h3>
                </div>
                <Calendar className="text-blue-600" />
              </div>
            </div>

            <div className="border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Draft Events</p>
                  <h3 className="text-3xl font-semibold mt-1">{stats.draftEvents}</h3>
                </div>
                <FileEdit className="text-gray-600" />
              </div>
            </div>

            <div className="border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Attendees</p>
                  <h3 className="text-3xl font-semibold mt-1">{stats.totalAttendees}</h3>
                </div>
                <Users className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Events */}
            <div className="lg:col-span-2 border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold">Recent Events</h2>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600">
                      <th className="pb-3">Event Name</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Attendees</th>
                      <th className="pb-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentEvents.map(event => (
                      <tr key={event.id} className="border-t border-gray-100">
                        <td className="py-3">{event.name}</td>
                        <td>{new Date(event.date).toLocaleDateString()}</td>
                        <td>{event.attendees}</td>
                        <td>${event.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Insights */}
            <div className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">AI Insights</h2>
                  <TrendingUp className="text-blue-600 w-5 h-5" />
                </div>
              </div>
              <div className="p-4">
                <ul className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}