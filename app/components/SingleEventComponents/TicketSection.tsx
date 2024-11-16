import React from 'react';
import { Plus, Users } from 'lucide-react';

interface TicketOption {
  tier: string;
  price: number;
  registered: number;
}

const TicketSection: React.FC = () => {
  const tickets: TicketOption[] = [
    {
      tier: "Basic",
      price: 20,
      registered: 45
    },
    {
      tier: "Standard",
      price: 50,
      registered: 28
    },
    {
      tier: "Premium",
      price: 100,
      registered: 12
    },
    {
      tier: "Plus",
      price: 150,
      registered: 5
    }
  ];

  return (
    <section className='text-center mt-20 flex flex-col gap-10'>
      <h2 className='text-2xl font-bold'>Tickets</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tickets.map((ticket, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg border hover:shadow-lg transition-shadow"
          >
            <div className="text-center space-y-4">
              <h3 className="font-medium">{ticket.tier}</h3>
              <p className="text-2xl font-bold">${ticket.price}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Users size={16} />
                <span className='font-medium'>{ticket.registered} registered</span>
              </div>
              <button className="mt-4 px-4 py-2 bg-secondary/70 
              hover:bg-secondary transition-colors rounded-full
              flex items-center gap-2 mx-auto">
                <Plus size={16} />
                <span>
                  Get Ticket
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TicketSection;