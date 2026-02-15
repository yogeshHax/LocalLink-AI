import React from 'react';
import { User, Message } from '../types';
import { Search, MoreVertical, ArrowLeft } from 'lucide-react';

interface MessagesViewProps {
  users: User[];
  currentUser: User;
  onOpenChat: (user: User) => void;
  onBack: () => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ users, currentUser, onOpenChat, onBack }) => {
  // Mock conversations based on users list
  const conversations = users.filter(u => u.id !== currentUser.id).map(u => ({
    user: u,
    lastMessage: "Hey, are you available specifically for...",
    time: "2h ago",
    unread: Math.random() > 0.7
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 h-[calc(100vh-64px)]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex overflow-hidden">
        
        {/* Sidebar List */}
        <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
             <div className="flex items-center gap-2">
                <button onClick={onBack} className="md:hidden p-1 hover:bg-gray-200 rounded">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-gray-900">Messages</h2>
             </div>
             <button className="p-2 bg-white rounded-full shadow-sm border border-gray-200">
                <MoreVertical className="w-4 h-4 text-gray-500" />
             </button>
          </div>
          
          <div className="p-4">
             <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search chats..." className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto">
             {conversations.map((convo) => (
               <div 
                 key={convo.user.id} 
                 onClick={() => onOpenChat(convo.user)}
                 className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50"
               >
                 <div className="relative">
                    <img src={convo.user.avatar} className="w-12 h-12 rounded-full object-cover" alt="" />
                    {convo.unread && <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white"></div>}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                       <h3 className="font-semibold text-gray-900 truncate">{convo.user.name}</h3>
                       <span className="text-xs text-gray-400">{convo.time}</span>
                    </div>
                    <p className={`text-sm truncate ${convo.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {convo.lastMessage}
                    </p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Empty State for Detail (Desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 flex-col text-center p-8">
           <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">👋</span>
           </div>
           <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a conversation</h3>
           <p className="text-gray-500 max-w-sm">
             Choose a neighbor from the left to start chatting, negotiating, or planning your next skill exchange.
           </p>
        </div>

      </div>
    </div>
  );
};

export default MessagesView;