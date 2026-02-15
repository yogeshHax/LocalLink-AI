import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Sparkles, Radio } from 'lucide-react';
import { SkillCategory } from '../types';

interface SmartSearchBarProps {
  onSearch: (query: string, filters: any) => void;
  onSmartMatchToggle: (enabled: boolean) => void;
  isSmartMatchActive: boolean;
  onBroadcastClick?: () => void;
}

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({ onSearch, onSmartMatchToggle, isSmartMatchActive, onBroadcastClick }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('');
  const [distance, setDistance] = useState<string>('10');

  // Trigger search on any change
  useEffect(() => {
    onSearch(query, { category, distance });
  }, [query, category, distance, onSearch]);

  return (
    <div className="w-full max-w-5xl mx-auto -mt-10 relative z-20 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-2 md:p-3 flex flex-col gap-2">
        
        <div className="flex flex-col md:flex-row gap-2">
            {/* Main Search Input */}
            <div className="flex-grow bg-gray-50 rounded-2xl flex items-center px-4 py-3 border border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                type="text"
                placeholder="What skill or help do you need?"
                className="bg-transparent w-full focus:outline-none text-gray-900 placeholder-gray-500 font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Location Dropdown */}
            <div className="md:w-48 bg-gray-50 rounded-2xl flex items-center px-4 py-3 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all relative">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <select 
                className="bg-transparent w-full focus:outline-none text-gray-900 font-medium appearance-none cursor-pointer z-10"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                >
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
                <option value="50">Within 50 km</option>
                </select>
            </div>

            {/* Broadcast Button (The "Pulse" Feature) */}
            <button 
                onClick={onBroadcastClick}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-red-200 transition-all hover:scale-105 active:scale-95 whitespace-nowrap group"
            >
                <Radio className="w-5 h-5 group-hover:animate-ping" />
                <span className="hidden md:inline">Signal Need</span>
                <span className="md:hidden">Signal</span>
            </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 pb-1 pt-1 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            <span className="text-xs font-bold text-gray-400 mr-2 uppercase tracking-wide">Filters:</span>
            {Object.values(SkillCategory).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? '' : cat)}
                className={`text-xs px-4 py-2 rounded-full font-bold border transition-all whitespace-nowrap ${
                  category === cat 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
            <label className="flex items-center cursor-pointer gap-3">
              <span className={`text-xs font-bold uppercase tracking-wide transition-colors ${isSmartMatchActive ? 'text-indigo-700' : 'text-gray-400'}`}>
                Smart Match
              </span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isSmartMatchActive}
                  onChange={(e) => onSmartMatchToggle(e.target.checked)}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors duration-300 ${isSmartMatchActive ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 transform ${isSmartMatchActive ? 'translate-x-4' : 'translate-x-0'} shadow-sm flex items-center justify-center`}>
                    {isSmartMatchActive && <Sparkles className="w-2.5 h-2.5 text-indigo-600" />}
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSearchBar;