import React, { useState } from 'react';
import { User, Skill } from '../types';
import { Star, Shield, Zap, MapPin, Clock, MessageCircle, Eye, UserPlus, Check } from 'lucide-react';

interface UserProfileCardProps {
  user: User;
  onBook: (user: User, skill: Skill) => void;
  onMessage: (user: User) => void;
  onViewProfile?: (user: User) => void;
  highlightMatch?: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, onBook, onMessage, onViewProfile, highlightMatch }) => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConnected(!isConnected);
  };

  return (
    <div className={`bg-white rounded-3xl overflow-hidden transition-all duration-300 border flex flex-col h-full group hover:-translate-y-1 ${highlightMatch ? 'border-2 border-purple-400 shadow-[0_10px_40px_-10px_rgba(168,85,247,0.3)]' : 'border-gray-100 shadow-sm hover:shadow-xl'}`}>
      {/* Header / Cover */}
      <div className={`h-28 relative shrink-0 overflow-hidden ${highlightMatch ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-slate-100 to-slate-200'}`}>
        {/* Abstract Pattern */}
        <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>

        {highlightMatch && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm animate-pulse">
            <Zap className="w-3 h-3 mr-1 fill-current" />
            98% Match
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 relative flex-1 flex flex-col">
        <div className="flex justify-between items-end -mt-12 mb-4 relative z-10">
          <div className="relative group/avatar cursor-pointer" onClick={() => onViewProfile && onViewProfile(user)}>
            {/* Karma Ring */}
            <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur opacity-40 group-hover/avatar:opacity-75 transition-opacity duration-500"></div>
            <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-24 h-24 rounded-full border-[5px] border-white shadow-lg object-cover bg-white relative"
            />
            {user.isVerified && (
                <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-sm" title="Identity Verified">
                    <Shield className="w-4 h-4 text-green-500 fill-current" />
                </div>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center text-yellow-500 mb-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 text-sm font-bold text-gray-900">{user.trustScore}</span>
            </div>
            <button 
                onClick={handleConnect}
                className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-all border ${
                    isConnected 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
            >
                {isConnected ? <Check className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                {isConnected ? 'Connected' : 'Connect'}
            </button>
          </div>
        </div>

        <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 cursor-pointer transition-colors leading-tight" onClick={() => onViewProfile && onViewProfile(user)}>
              {user.name}
            </h3>
            <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                {user.location}
            </div>
        </div>
        
        {user.bio && (
            <div className="relative mb-5">
                <p className="text-sm text-gray-600 italic line-clamp-2 pl-3 border-l-2 border-indigo-200">
                    "{user.bio}"
                </p>
            </div>
        )}

        {/* Dual State: Skills Offered vs Needed */}
        <div className="space-y-4 mb-6 flex-1">
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-gray-200"></span>
                Available Services
                <span className="w-full h-[1px] bg-gray-200"></span>
            </h4>
            <div className="space-y-3">
              {user.skillsOffered.slice(0, 2).map(skill => (
                <div 
                    key={skill.id} 
                    className="group/skill border border-gray-100 bg-gray-50/50 rounded-xl p-3 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer relative overflow-hidden" 
                    onClick={() => onBook(user, skill)}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover/skill:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-gray-800 text-sm group-hover/skill:text-indigo-700 transition-colors line-clamp-1">{skill.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium mt-2">
                    <span className="text-gray-500">${skill.hourlyRate}/hr</span>
                    <span className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full flex items-center font-bold">
                      <Clock className="w-3 h-3 mr-1" />
                      {skill.creditValue} Credits
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 mt-auto flex gap-2">
           <button 
             onClick={() => onViewProfile && onViewProfile(user)} 
             className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
           >
             <Eye className="w-4 h-4 text-gray-400" /> View Profile
           </button>
           <button 
             onClick={() => onMessage(user)} 
             className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
           >
             <MessageCircle className="w-4 h-4" /> Chat
           </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;