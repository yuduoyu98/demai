import { useState } from 'react';
import EventCard from './EventCard';
import ActivityTimeline from './ActivityTimeline';
import { mockEvents, mockActivities } from '../mock/eventData';

const ExploreTab: React.FC = () => {
  // Limit to 7 events max
  const [events] = useState(mockEvents.slice(0, 7));
  const [activities] = useState(mockActivities);

  const handleBuyTicket = (eventId: string) => {
    console.log('Buy ticket for event:', eventId);
    // Implement buy ticket functionality
  };

  const handleCreateEvent = () => {
    console.log('Create new event');
    // Implement create event functionality
  };

  return (
    <div>
      {/* Events Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            onBuyTicket={handleBuyTicket} 
          />
        ))}
        <EventCard isCreateCard onCreateEvent={handleCreateEvent} />
      </div>

      {/* Activity Timeline */}
      <ActivityTimeline activities={activities} />
    </div>
  );
};

export default ExploreTab; 