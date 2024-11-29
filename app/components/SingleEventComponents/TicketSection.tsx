import React from 'react';
import { Plus, Users } from 'lucide-react';
import { Ticket } from '@/app/types/EventForm';

const TicketSection: React.FC<{
  handleClick: () => void;
  tickets: Ticket[];
}> = ({handleClick, tickets}) => {
  return (
    <section className='text-center my-20 flex flex-col gap-10'>
      <h2 className='text-2xl font-bold'>Tickets</h2>
      <div className="flex justify-center flex-wrap gap-5 w-full">
        {tickets.map((ticket, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg border 
            hover:shadow-lg transition-shadow w-72"
          >
            <div className="text-center space-y-4">
              <h3 className="font-medium">
                Ticket {index + 1}
              </h3>
              <p className="text-2xl font-bold">${ticket.price}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Users size={16} />
                <span className='font-medium'>{ticket.total} registered</span>
              </div>
              <button className="mt-4 px-4 py-2 bg-secondary/70 
              hover:bg-secondary transition-colors rounded-full
              flex items-center gap-2 mx-auto"
              onClick={handleClick}>
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