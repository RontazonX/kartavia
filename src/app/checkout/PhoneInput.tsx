'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const countries = [
  { code: 'id', dial: '+62', name: 'Indonesia' },
  { code: 'sg', dial: '+65', name: 'Singapore' },
  { code: 'my', dial: '+60', name: 'Malaysia' },
  { code: 'th', dial: '+66', name: 'Thailand' },
  { code: 'us', dial: '+1', name: 'United States' },
  { code: 'gb', dial: '+44', name: 'United Kingdom' },
  { code: 'au', dial: '+61', name: 'Australia' },
  { code: 'jp', dial: '+81', name: 'Japan' },
  { code: 'kr', dial: '+82', name: 'South Korea' },
  { code: 'cn', dial: '+86', name: 'China' },
]

export default function PhoneInput() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(countries[0])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center border border-gray-200 rounded-2xl p-1 bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all relative" ref={dropdownRef}>
      {/* Hidden input to pass data to the form action */}
      <input type="hidden" name="country_code" value={selected.dial} />
      
      {/* Custom Dropdown Trigger */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-2 pl-3 pr-2 bg-transparent hover:bg-gray-50 rounded-xl transition-colors shrink-0"
      >
        <img 
          src={`https://flagcdn.com/w20/${selected.code}.png`} 
          width="20" 
          alt={selected.name}
          className="rounded-sm shadow-sm"
        />
        <span className="text-[14px] text-gray-900 font-medium font-sans">{selected.dial}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
            {countries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  setSelected(country)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${selected.code === country.code ? 'bg-primary/5 text-primary' : 'text-gray-700'}`}
              >
                <img 
                  src={`https://flagcdn.com/w20/${country.code}.png`} 
                  width="20" 
                  alt={country.name}
                  className="rounded-sm shadow-sm"
                />
                <span className="text-sm font-medium text-left flex-1">{country.name}</span>
                <span className={`text-xs font-semibold ${selected.code === country.code ? 'text-primary' : 'text-gray-400'}`}>{country.dial}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Phone Number Input */}
      <input 
        type="tel" 
        name="phone_number" 
        placeholder="812 3456" 
        required 
        className="flex-1 min-w-0 bg-transparent py-2 px-2 focus:outline-none font-sans text-[15px] font-medium text-gray-900" 
      />
      
      {/* Verification Badge */}
      <div className="mr-2 flex items-center justify-center w-5 h-5 bg-blue-500 text-white rounded-full shrink-0 shadow-sm">
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
    </div>
  )
}
