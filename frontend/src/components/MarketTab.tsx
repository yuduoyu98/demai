import { useState, useEffect } from 'react';
import { mockEvents, Event } from '../mock/eventData';
import EventCard from './EventCard';

interface Filter {
  status: string[];
  priceRange: { min: number; max: number } | null;
  location: string[];
}

const MarketTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allEvents] = useState(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [activeFilters, setActiveFilters] = useState<Filter>({
    status: ['available'],
    priceRange: { min: 0, max: 500 },
    location: []
  });
  const [sortBy, setSortBy] = useState<{field: string; direction: 'asc' | 'desc'}>({
    field: 'date',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 8;

  // Status options
  const statusOptions = ['available', 'resale', 'expired'];
  
  // Extract unique locations from events
  const locationOptions = [...new Set(mockEvents.map(event => event.location))];

  // Price range options
  const priceRangeOptions = [
    { min: 0, max: 100 },
    { min: 100, max: 200 },
    { min: 200, max: 300 },
    { min: 300, max: 500 }
  ];

  // Apply filters and sorting
  useEffect(() => {
    let result = [...allEvents];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.location.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (activeFilters.status.length > 0) {
      result = result.filter(event => activeFilters.status.includes(event.status));
    }
    
    // Apply location filter
    if (activeFilters.location.length > 0) {
      result = result.filter(event => activeFilters.location.includes(event.location));
    }
    
    // Apply price range filter
    if (activeFilters.priceRange) {
      result = result.filter(event => 
        event.price >= activeFilters.priceRange!.min && 
        event.price <= activeFilters.priceRange!.max
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy.field === 'date') {
        // Convert dates to timestamps for comparison
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        comparison = dateA - dateB;
      } else if (sortBy.field === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy.field === 'price') {
        comparison = a.price - b.price;
      }
      
      return sortBy.direction === 'asc' ? comparison : -comparison;
    });
    
    setFilteredEvents(result);
    // Reset to first page when filters or search change
    setCurrentPage(1);
  }, [allEvents, searchQuery, activeFilters, sortBy]);

  const handleBuyTicket = (eventId: string) => {
    console.log('Buy ticket for event:', eventId);
    // Implement buy ticket functionality
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleStatusFilter = (status: string) => {
    if (activeFilters.status.includes(status)) {
      setActiveFilters({
        ...activeFilters,
        status: activeFilters.status.filter(s => s !== status)
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        status: [...activeFilters.status, status]
      });
    }
  };

  const toggleLocationFilter = (location: string) => {
    if (activeFilters.location.includes(location)) {
      setActiveFilters({
        ...activeFilters,
        location: activeFilters.location.filter(loc => loc !== location)
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        location: [...activeFilters.location, location]
      });
    }
  };

  const setPriceRange = (range: { min: number; max: number }) => {
    setActiveFilters({
      ...activeFilters,
      priceRange: range
    });
  };

  const removeFilter = (filterType: keyof Filter, value?: string | number) => {
    if (filterType === 'status' && value) {
      setActiveFilters({
        ...activeFilters,
        status: activeFilters.status.filter(status => status !== value)
      });
    } else if (filterType === 'location' && value) {
      setActiveFilters({
        ...activeFilters,
        location: activeFilters.location.filter(loc => loc !== value)
      });
    } else if (filterType === 'priceRange') {
      setActiveFilters({
        ...activeFilters,
        priceRange: null
      });
    }
  };

  const changeSortBy = (field: string) => {
    if (sortBy.field === field) {
      // Toggle direction if same field
      setSortBy({
        field,
        direction: sortBy.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // Default to descending for new field
      setSortBy({
        field,
        direction: 'desc'
      });
    }
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filter for pagination display
  const totalResults = filteredEvents.length;
  const startResult = totalResults === 0 ? 0 : (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(startResult + resultsPerPage - 1, totalResults);
  
  // Get current page events for display
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div>
      {/* Search and Filter Toolbar */}
      <div className="bg-white shadow rounded-lg mt-6 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border border-gray-300 rounded-md py-2" 
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* Filters Dropdown */}
          <div className="flex space-x-2">
            <div className="relative inline-block text-left group">
              <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Status
                <svg className="-mr-1 ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="hidden group-hover:block absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {statusOptions.map(status => (
                    <button
                      key={status}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => toggleStatusFilter(status)}
                    >
                      <input
                        type="checkbox"
                        checked={activeFilters.status.includes(status)}
                        readOnly
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative inline-block text-left group">
              <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Location
                <svg className="-mr-1 ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="hidden group-hover:block absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1 max-h-60 overflow-y-auto" role="menu" aria-orientation="vertical">
                  {locationOptions.map(location => (
                    <button
                      key={location}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => toggleLocationFilter(location)}
                    >
                      <input
                        type="checkbox"
                        checked={activeFilters.location.includes(location)}
                        readOnly
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative inline-block text-left group">
              <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Price
                <svg className="-mr-1 ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="hidden group-hover:block absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {priceRangeOptions.map((range, index) => (
                    <button
                      key={index}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => setPriceRange(range)}
                    >
                      <input
                        type="radio"
                        checked={activeFilters.priceRange?.min === range.min && activeFilters.priceRange?.max === range.max}
                        readOnly
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                      />
                      {range.min} - {range.max} HKDT
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative inline-block text-left group">
            <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Sort by: {sortBy.field.charAt(0).toUpperCase() + sortBy.field.slice(1)} {sortBy.direction === 'asc' ? '↑' : '↓'}
              <svg className="-mr-1 ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="hidden group-hover:block absolute right-0 z-10 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => changeSortBy('title')}
                >
                  Event Title {sortBy.field === 'title' ? (sortBy.direction === 'asc' ? '↑' : '↓') : ''}
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => changeSortBy('date')}
                >
                  Event Date {sortBy.field === 'date' ? (sortBy.direction === 'asc' ? '↑' : '↓') : ''}
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => changeSortBy('price')}
                >
                  Price {sortBy.field === 'price' ? (sortBy.direction === 'asc' ? '↑' : '↓') : ''}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {activeFilters.status.map(status => (
            <span key={status} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <button 
                type="button" 
                className="ml-1.5 inline-flex flex-shrink-0 h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                onClick={() => removeFilter('status', status)}
              >
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          ))}
          {activeFilters.location.map(location => (
            <span key={location} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Location: {location}
              <button 
                type="button" 
                className="ml-1.5 inline-flex flex-shrink-0 h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                onClick={() => removeFilter('location', location)}
              >
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          ))}
          {activeFilters.priceRange && (
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Price: {activeFilters.priceRange.min}-{activeFilters.priceRange.max} HKDT
              <button 
                type="button" 
                className="ml-1.5 inline-flex flex-shrink-0 h-4 w-4 rounded-full items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                onClick={() => removeFilter('priceRange')}
              >
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Event Grid */}
      {currentEvents.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onBuyTicket={handleBuyTicket} 
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center py-12 px-4 bg-white shadow rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No matching events found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {totalResults > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button 
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startResult}</span> to <span className="font-medium">{endResult}</span> of <span className="font-medium">{totalResults}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* Generate page buttons */}
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      aria-current={currentPage === pageNumber ? "page" : undefined}
                      className={`${
                        currentPage === pageNumber
                          ? "z-10 bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500 text-white"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button 
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketTab; 