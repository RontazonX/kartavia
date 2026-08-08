'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, ChevronDown } from 'lucide-react';

const popularDestinations = [
  "Malioboro",
  "Prambanan",
  "Borobudur",
  "Gunung Kidul",
  "Bantul",
  "Sleman",
  "Kulon Progo"
];

export default function HeroSearchBar() {
  const router = useRouter();
  
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(1);
  
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  
  const guestRef = useRef<HTMLDivElement>(null);

  // Auto-complete suggestion logic
  const suggestion = query 
    ? popularDestinations.find(d => d.toLowerCase().startsWith(query.toLowerCase())) 
    : '';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestion && suggestion.toLowerCase() !== query.toLowerCase()) {
      e.preventDefault();
      setQuery(suggestion);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
        setShowGuestDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (date) params.set('date', date);
    if (guests > 1) params.set('guests', guests.toString());
    
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-2 rounded-3xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center max-w-4xl mx-auto w-full transition-all hover:shadow-primary/20 relative z-30">
      
      {/* Where To Input */}
      <div className="flex-1 flex items-center px-6 py-4 md:py-3 w-full border-b md:border-b-0 md:border-r border-gray-200 relative">
        <MapPin className="h-5 w-5 text-gray-400 mr-3 shrink-0 z-10" />
        
        {/* Ghost Suggestion Text */}
        <div className="absolute left-14 right-6 top-0 bottom-0 flex items-center pointer-events-none z-0">
          <span className="text-transparent font-medium">{query}</span>
          {suggestion && suggestion.toLowerCase().startsWith(query.toLowerCase()) && query.length > 0 && (
            <span className="text-gray-300 font-medium">{suggestion.slice(query.length)}</span>
          )}
        </div>

        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Where to?" 
          className="w-full focus:outline-none text-gray-800 bg-transparent placeholder-gray-500 font-medium cursor-text relative z-10" 
        />
      </div>

      {/* Date Input */}
      <div className="flex-1 flex items-center px-6 py-4 md:py-3 w-full border-b md:border-b-0 md:border-r border-gray-200">
        <Calendar className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
        <input 
          type="text" 
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => { if (!e.target.value) e.target.type = "text" }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Select dates" 
          className="w-full focus:outline-none text-gray-800 bg-transparent placeholder-gray-500 font-medium cursor-pointer" 
        />
      </div>

      {/* Guests Input */}
      <div className="flex-1 flex items-center px-6 py-4 md:py-3 w-full relative" ref={guestRef}>
        <Users className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
        <div 
          className="w-full cursor-pointer flex justify-between items-center text-gray-800 font-medium"
          onClick={() => setShowGuestDropdown(!showGuestDropdown)}
        >
          <span>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showGuestDropdown ? 'rotate-180' : ''}`} />
        </div>
        
        {/* Guest Dropdown */}
        {showGuestDropdown && (
          <div className="absolute top-full left-0 md:right-0 md:left-auto mt-4 w-full md:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-800">Guests</p>
                <p className="text-xs text-gray-500">Ages 2 or above</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors"
                >-</button>
                <span className="font-medium w-4 text-center">{guests}</span>
                <button 
                  type="button"
                  onClick={() => setGuests(guests + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors"
                >+</button>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setShowGuestDropdown(false)}
              className="w-full py-2 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button 
        type="submit"
        className="w-full md:w-auto m-2 bg-primary text-white rounded-full px-8 py-4 font-bold hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-lg cursor-pointer shrink-0"
      >
        Search
      </button>
    </form>
  );
}
