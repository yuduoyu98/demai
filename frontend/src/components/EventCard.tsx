import { Event } from '../mock/eventData';

interface EventCardProps {
  event?: Event;
  isCreateCard?: boolean;
  onCreateEvent?: () => void;
  onBuyTicket?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  isCreateCard = false,
  onCreateEvent,
  onBuyTicket
}) => {
  if (isCreateCard) {
    return (
      <div className="overflow-hidden shadow rounded-lg border-2 border-dashed border-purple-300 bg-gradient-to-br from-white to-purple-50 hover:from-purple-50 hover:to-purple-100 transition-colors">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Create New Event</h3>
          </div>
          <p className="mt-2 text-sm text-gray-500">Mint NFT tickets for your event</p>
          <div className="mt-auto pt-8">
            <div className="flex items-center justify-center">
              <button 
                onClick={onCreateEvent}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const isExpired = event.status === 'expired';
  const isResale = event.status === 'resale';

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    resale: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800'
  };

  const statusLabel = {
    available: 'Available',
    resale: 'Resale',
    expired: 'Expired'
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>{event.location}</span>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span>{event.date}</span>
        </div>
        <div className="mt-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
            {statusLabel[event.status]}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-2xl font-bold ${isExpired ? 'text-gray-400' : 'text-gray-900'}`}>
            {event.price} {event.currency}
          </span>
          <button
            onClick={() => !isExpired && onBuyTicket && onBuyTicket(event.id)}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isExpired
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            }`}
            disabled={isExpired}
          >
            Buy Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 