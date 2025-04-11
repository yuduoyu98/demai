export interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  status: 'available' | 'resale' | 'expired';
  price: number;
  currency: string;
}

export interface Activity {
  id: string;
  type: 'purchase' | 'create' | 'list' | 'transfer';
  eventTitle: string;
  eventDate: string;
  timestamp: string;
  timeAgo: string;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Jay Chou Concert',
    location: 'Hong Kong Coliseum',
    date: 'March 15, 2024',
    status: 'available',
    price: 100,
    currency: 'HKDT'
  },
  {
    id: '2',
    title: 'Tech Conference',
    location: 'Hong Kong Convention Centre',
    date: 'April 20, 2024',
    status: 'resale',
    price: 150,
    currency: 'HKDT'
  },
  {
    id: '3',
    title: 'Music Festival',
    location: 'Central Harbourfront',
    date: 'February 10, 2024',
    status: 'expired',
    price: 100,
    currency: 'HKDT'
  },
  {
    id: '4',
    title: 'Art Exhibition',
    location: 'Hong Kong Museum of Art',
    date: 'May 5, 2024',
    status: 'available',
    price: 80,
    currency: 'HKDT'
  },
  {
    id: '5',
    title: 'Food Festival',
    location: 'Victoria Park',
    date: 'June 12, 2024',
    status: 'available',
    price: 120,
    currency: 'HKDT'
  },
  {
    id: '6',
    title: 'Football Match',
    location: 'Hong Kong Stadium',
    date: 'June 12, 2024',
    status: 'resale',
    price: 200,
    currency: 'HKDT'
  },
  {
    id: '7',
    title: 'Basketball Tournament',
    location: 'Southorn Stadium',
    date: 'July 8, 2024',
    status: 'available',
    price: 90,
    currency: 'HKDT'
  },
  {
    id: '8',
    title: 'Ballet Performance',
    location: 'Hong Kong Cultural Centre',
    date: 'August 15, 2024',
    status: 'resale',
    price: 180,
    currency: 'HKDT'
  },
  {
    id: '9',
    title: 'Business Forum',
    location: 'Hong Kong Convention Centre',
    date: 'September 5, 2024',
    status: 'available',
    price: 250,
    currency: 'HKDT'
  },
  {
    id: '10',
    title: 'Film Festival',
    location: 'The Grand Cinema',
    date: 'October 10, 2024',
    status: 'resale',
    price: 120,
    currency: 'HKDT'
  },
  {
    id: '11',
    title: 'Comic Convention',
    location: 'AsiaWorld-Expo',
    date: 'November 20, 2024',
    status: 'available',
    price: 150,
    currency: 'HKDT'
  },
  {
    id: '12',
    title: 'New Year Countdown',
    location: 'Victoria Harbour',
    date: 'December 31, 2024',
    status: 'available',
    price: 300,
    currency: 'HKDT'
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'purchase',
    eventTitle: 'Jay Chou Concert',
    eventDate: 'March 15, 2024',
    timestamp: '2024-03-01T14:30:00Z',
    timeAgo: '2 hours ago'
  },
  {
    id: '2',
    type: 'create',
    eventTitle: 'Tech Conference',
    eventDate: 'April 20, 2024',
    timestamp: '2024-02-28T10:15:00Z',
    timeAgo: '1 day ago'
  },
  {
    id: '3',
    type: 'list',
    eventTitle: 'Music Festival',
    eventDate: 'February 10, 2024',
    timestamp: '2024-02-25T16:45:00Z',
    timeAgo: '3 days ago'
  },
  {
    id: '4',
    type: 'transfer',
    eventTitle: 'Art Exhibition',
    eventDate: 'May 5, 2024',
    timestamp: '2024-02-20T09:00:00Z',
    timeAgo: '1 week ago'
  }
]; 