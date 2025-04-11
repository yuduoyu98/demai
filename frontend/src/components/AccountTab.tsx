import { useState, useEffect } from 'react';
import { getWalletAddress } from '../utils/auth';

interface OwnedTicket {
  id: string;
  eventTitle: string;
  eventLocation: string;
  eventDate: string;
  status: 'active' | 'listed' | 'expired';
  ticketId: string;
  purchasePrice: number;
  listingPrice?: number;
  currency: string;
}

interface CreatedEvent {
  id: string;
  title: string;
  date: string;
  ticketsSold: number;
  totalTickets: number;
}

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'debit' | 'credit';
}

const AccountTab: React.FC = () => {
  const [activeView, setActiveView] = useState<'tickets' | 'events'>('tickets');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [ownedTickets, setOwnedTickets] = useState<OwnedTicket[]>([]);
  const [createdEvents, setCreatedEvents] = useState<CreatedEvent[]>([]);
  const [balance, setBalance] = useState<number>(1250);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 2500,
    ticketsSold: 25,
    activeEvents: 2
  });

  useEffect(() => {
    const address = getWalletAddress();
    if (address) {
      setWalletAddress(address);
    }
    
    // Mock data for owned tickets
    setOwnedTickets([
      {
        id: '1',
        eventTitle: 'Jay Chou Concert',
        eventLocation: 'Hong Kong Coliseum',
        eventDate: 'March 15, 2024',
        status: 'active',
        ticketId: '#1234',
        purchasePrice: 100,
        currency: 'HKDT'
      },
      {
        id: '2',
        eventTitle: 'Tech Conference',
        eventLocation: 'Hong Kong Convention Centre',
        eventDate: 'April 20, 2024',
        status: 'listed',
        ticketId: '#5678',
        purchasePrice: 150,
        listingPrice: 150,
        currency: 'HKDT'
      }
    ]);

    // Mock data for created events
    setCreatedEvents([
      {
        id: '1',
        title: 'Tech Meetup',
        date: 'April 30, 2024',
        ticketsSold: 15,
        totalTickets: 50
      },
      {
        id: '2',
        title: 'Startup Demo Day',
        date: 'May 15, 2024',
        ticketsSold: 10,
        totalTickets: 40
      }
    ]);

    // Mock data for transactions
    setTransactions([
      {
        id: '1',
        title: 'Tech Conference Ticket',
        date: 'Apr 5, 2024',
        amount: 150,
        type: 'debit'
      },
      {
        id: '2',
        title: 'Deposit from Bank',
        date: 'Apr 1, 2024',
        amount: 500,
        type: 'credit'
      },
      {
        id: '3',
        title: 'Jay Chou Concert Ticket',
        date: 'Mar 28, 2024',
        amount: 100,
        type: 'debit'
      }
    ]);
  }, []);

  const handleSellTicket = (ticketId: string) => {
    console.log('Sell ticket:', ticketId);
    // Implement sell ticket functionality
  };

  const handleCancelListing = (ticketId: string) => {
    console.log('Cancel listing for ticket:', ticketId);
    // Implement cancel listing functionality
  };

  const handleManageEvent = (eventId: string) => {
    console.log('Manage event:', eventId);
    // Implement event management functionality
  };

  const handleDeposit = () => {
    console.log('Deposit funds');
    // Implement deposit functionality
  };

  const handleWithdraw = () => {
    console.log('Withdraw funds');
    // Implement withdraw functionality
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'listed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Listed for Sale</span>;
      case 'expired':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expired</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Account Content */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2">
          {/* Toggle Switch */}
          <div className="bg-white p-4 shadow rounded-lg mb-6">
            <div className="flex justify-center">
              <div className="relative bg-gray-200 rounded-full p-1 flex w-64">
                <button 
                  className={`w-1/2 py-2 px-6 rounded-full ${
                    activeView === 'tickets' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                      : 'text-gray-700'
                  } text-sm font-medium focus:outline-none`}
                  onClick={() => setActiveView('tickets')}
                >
                  Tickets
                </button>
                <button 
                  className={`w-1/2 py-2 px-6 rounded-full ${
                    activeView === 'events' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                      : 'text-gray-700'
                  } text-sm font-medium focus:outline-none`}
                  onClick={() => setActiveView('events')}
                >
                  Events
                </button>
              </div>
            </div>
          </div>

          {/* My Tickets Section */}
          {activeView === 'tickets' && (
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-lg font-medium text-gray-900 mb-6">My Tickets</h2>
              
              {/* Ticket Cards */}
              <div className="space-y-6">
                {ownedTickets.map(ticket => (
                  <div key={ticket.id} className="bg-white border border-gray-200 overflow-hidden rounded-lg">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{ticket.eventTitle}</h3>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <span>{ticket.eventLocation}</span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <span>{ticket.eventDate}</span>
                          </div>
                        </div>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-500">
                            {ticket.status === 'listed' ? 'Listed for' : 'Purchased for'}
                          </span>
                          <span className="ml-2 text-base font-medium text-gray-900">
                            {ticket.status === 'listed' && ticket.listingPrice 
                              ? `${ticket.listingPrice} ${ticket.currency}`
                              : `${ticket.purchasePrice} ${ticket.currency}`
                            }
                          </span>
                        </div>
                        {ticket.status === 'active' ? (
                          <button 
                            onClick={() => handleSellTicket(ticket.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                          >
                            Resale
                          </button>
                        ) : ticket.status === 'listed' ? (
                          <button 
                            onClick={() => handleCancelListing(ticket.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600"
                          >
                            Cancel Listing
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}

                {ownedTickets.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No tickets yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Purchase tickets from the Explore or Market tabs.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Events Dashboard */}
          {activeView === 'events' && (
            <div className="bg-white border border-gray-200 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Events Dashboard</h2>
                
                {/* Sales Stats */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
                  <div className="bg-blue-50 overflow-hidden rounded-lg shadow">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-500">Total Revenue</div>
                          <div className="text-xl font-semibold text-gray-900">{stats.totalRevenue} HKDT</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 overflow-hidden rounded-lg shadow">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-500">Tickets Sold</div>
                          <div className="text-xl font-semibold text-gray-900">{stats.ticketsSold}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 overflow-hidden rounded-lg shadow">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-500">Active Events</div>
                          <div className="text-xl font-semibold text-gray-900">{stats.activeEvents}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Event List (Creator) */}
                <h3 className="text-md font-medium text-gray-700 mb-4">My Created Events</h3>
                <div className="space-y-4">
                  {createdEvents.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-500">{event.date}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{event.ticketsSold}/{event.totalTickets}</span> tickets sold
                      </div>
                      <button 
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        onClick={() => handleManageEvent(event.id)}
                      >
                        Manage
                      </button>
                    </div>
                  ))}

                  {createdEvents.length === 0 && (
                    <div className="text-center py-8 border border-gray-200 rounded-lg">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No created events</h3>
                      <p className="mt-1 text-sm text-gray-500">Create a new event to start selling tickets.</p>
                      <div className="mt-4">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                          Create Event
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1/3) - Balance */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Wallet</h2>
            
            {/* HKDT Balance */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">HKDT Balance</span>
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="bg-gray-50 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{balance.toFixed(2)} HKDT</span>
                  <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Deposit/Withdraw Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleDeposit}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Deposit
              </button>
              <button 
                onClick={handleWithdraw}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Withdraw
              </button>
            </div>
            
            {/* Transaction History */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-700">Recent Transactions</h3>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">View All</a>
              </div>
              
              <div className="space-y-3">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.title}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                    <span className={`text-sm font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{transaction.amount} HKDT
                    </span>
                  </div>
                ))}

                {transactions.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No recent transactions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTab; 