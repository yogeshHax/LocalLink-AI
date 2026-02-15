import React from 'react';
import { User, Skill } from '../types';
import { X, MapPin, Star, Shield, Clock, CheckCircle } from 'lucide-react';

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
  onBook: (user: User, skill: Skill) => void;
  onMessage: (user: User) => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose, onBook, onMessage }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

        <div className="px-8 pb-8">
          {/* Profile Header */}
          <div className="relative -mt-12 mb-6 flex flex-col sm:flex-row items-end sm:items-end gap-4">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-white"
            />
            <div className="flex-1 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {user.name} 
                {user.isVerified && <Shield className="w-5 h-5 text-green-500" fill="currentColor" fillOpacity={0.2} />}
              </h2>
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-1" /> {user.location}
              </div>
            </div>
            <div className="mb-2 flex gap-3">
               <button onClick={() => onMessage(user)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                 Message
               </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 border-b border-gray-100 pb-8">
             <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center text-yellow-500 font-bold text-xl">
                   {user.trustScore} <Star className="w-4 h-4 ml-1 fill-current" />
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Trust Score</div>
             </div>
             <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="font-bold text-xl text-indigo-600">
                   {user.skillsOffered.length}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Skills Offered</div>
             </div>
             <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="font-bold text-xl text-green-600">
                   100%
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Response Rate</div>
             </div>
          </div>

          {/* Bio */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">About</h3>
            <p className="text-gray-600 leading-relaxed">
              {user.bio || `Hi, I'm ${user.name}. I love helping my neighbors and learning new skills. Connect with me for any of the services listed below!`}
            </p>
          </div>

          {/* Skills Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Services Offered</h3>
            <div className="space-y-4">
              {user.skillsOffered.map(skill => (
                <div key={skill.id} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors bg-gray-50/50">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{skill.name}</h4>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{skill.category}</span>
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-gray-900">${skill.hourlyRate}/hr</div>
                         <div className="text-xs text-purple-600 font-medium">{skill.creditValue} Credits</div>
                      </div>
                   </div>
                   <p className="text-sm text-gray-600 mb-4">{skill.description}</p>
                   <button 
                     onClick={() => onBook(user, skill)}
                     className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                   >
                     Book Service
                   </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Needs */}
          <div className="mt-8 pt-8 border-t border-gray-100">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Looking For</h3>
             <div className="flex flex-wrap gap-2">
               {user.skillsNeeded.map((need, i) => (
                 <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                   {need}
                 </span>
               ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;