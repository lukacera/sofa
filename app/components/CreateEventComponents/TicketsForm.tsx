import { PlusCircle, Trash } from 'lucide-react';
import React from 'react'
import { EventFormData, Ticket } from '@/app/types/EventForm';

export const TicketsForm: React.FC<{
    formData: EventFormData;
    setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
    inputClasses: string;
    RequiredStar: () => JSX.Element;
}> = ({RequiredStar, formData, inputClasses, setFormData}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-black text-center">Tickets</h2>
      
      {formData.tickets.map((ticket, ticketIndex) => (
        <div key={ticketIndex} className="p-4 border-2 rounded-lg space-y-4 shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Ticket Type {ticketIndex + 1}</h3>
            {ticketIndex > 0 && (
              <button
                type="button"
                onClick={() => {
                  const newTickets = formData.tickets.filter((_, index) => index !== ticketIndex);
                  setFormData({ ...formData, tickets: newTickets });
                }}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
    
          {/* Ticket type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ticket Type<RequiredStar />
            </label>
            <select
              value={ticket.type}
              onChange={(e) => {
                const newTickets = [...formData.tickets];
                newTickets[ticketIndex].type = e.target.value as Ticket['type'];
                // Reset price to 0 when switching to free ticket
                if (e.target.value === 'free') {
                  newTickets[ticketIndex].price = 0;
                }
                setFormData({ ...formData, tickets: newTickets });
              }}
              className={`${inputClasses} !important border w-full rounded-lg`}
              required
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
    
          {/* Ticket Price and Total */}
          <div className="grid grid-cols-2 gap-4">
            {ticket.type === 'paid' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ticket price in $<RequiredStar />
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={ticket.price}
                  onChange={(e) => {
                    const newTickets = [...formData.tickets];
                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    newTickets[ticketIndex].price = isNaN(value) ? 0 : value;
                    setFormData({ ...formData, tickets: newTickets });
                  }}
                  className={`${inputClasses} !important border w-full rounded-lg`}
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of tickets<RequiredStar />
              </label>
              <input
                type="number"
                min="1"
                value={ticket.total}
                onChange={(e) => {
                  const newTickets = [...formData.tickets];
                  const value = parseInt(e.target.value);
                  newTickets[ticketIndex].total = value < 1 ? 1 : value;
                  setFormData({ ...formData, tickets: newTickets });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && e.currentTarget.value.length === 1) {
                    e.preventDefault();
                  }
                }}
                className={`${inputClasses} !important border w-full rounded-lg`}
                required
              />
            </div>
          </div>
    
          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Benefits
            </label>
            <div className="space-y-2">
              {ticket.benefits.map((benefit, benefitIndex) => (
                <div key={benefitIndex} className="flex gap-2 w-full items-center">
                  <span className="text-gray-500 text-sm mt-2 font-semibold">
                    {benefitIndex + 1}.
                  </span>
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => {
                      const newTickets = [...formData.tickets];
                      newTickets[ticketIndex].benefits[benefitIndex] = e.target.value;
                      setFormData({ ...formData, tickets: newTickets });
                    }}
                    required
                    className={`${inputClasses} w-full`}
                    placeholder={`Benefit ${benefitIndex + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newTickets = [...formData.tickets];
                      newTickets[ticketIndex].benefits = ticket.benefits.filter(
                        (_, index) => index !== benefitIndex
                      );
                      setFormData({ ...formData, tickets: newTickets });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={16} className='mt-5'/>
                  </button>
                </div>            
              ))}
              <button
                type="button"
                onClick={() => {
                  const newTickets = [...formData.tickets];
                  newTickets[ticketIndex].benefits.push('');
                  setFormData({ ...formData, tickets: newTickets });
                }}
                className="text-sm text-primaryDarker hover:text-primary
                flex items-center gap-2 pt-5"
              >
                <PlusCircle /> Add Benefit
              </button>
            </div>
          </div>
        </div>
      ))}
    
      {/* Add Ticket Type Button */}
      <button
        type="button"
        onClick={() => {
          setFormData({
            ...formData,
            tickets: [
              ...formData.tickets,
              {
                type: 'free',
                price: 0,
                benefits: [''],
                total: 1
              }
            ]
          });
        }}
        className="mt-4 w-full p-4 border flex justify-center items-center gap-4 
        rounded-md text-sm font-medium text-gray-600 hover:border-gray-400 
        border-dashed border-gray-300 hover:bg-gray-50"
      >
        <PlusCircle /> Add Another Ticket Type
      </button>
    </div>
  )
}