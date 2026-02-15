import React, { useState, useEffect } from 'react';
import SmartSearchBar from './components/SmartSearchBar';
import UserProfileCard from './components/UserProfileCard';
import BookingFlow from './components/BookingFlow';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ProfileEditor from './components/ProfileEditor';
import ChatSystem from './components/ChatSystem';
import MessagesView from './components/MessagesView';
import UserDetailModal from './components/UserDetailModal';
import AddListingModal from './components/AddListingModal';
import { MOCK_USERS, CURRENT_USER } from './constants';
import { User, Skill, SkillCategory } from './types';
import { Layout, Map, MessageSquare, BookOpen, LogOut, Edit3, Share2, Hexagon, X, Plus } from 'lucide-react';
import { supabase } from './supabaseClient';

type ViewState = 'LANDING' | 'LOGIN' | 'DASHBOARD' | 'PROFILE' | 'MESSAGES';

// --- Custom Logo Component ---
const LocalLinkLogo = ({ className = "w-8 h-8", textClassName = "text-xl" }: { className?: string, textClassName?: string }) => (
    <div className="flex items-center gap-2.5 group cursor-pointer">
        <div className={`relative flex items-center justify-center bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 transition-transform group-hover:scale-110 ${className.replace('w-8 h-8', 'w-10 h-10')}`}>
            <Hexagon className="w-full h-full text-indigo-600 absolute opacity-0" fill="currentColor" />
            <Share2 className="w-3/5 h-3/5 text-white relative z-10" strokeWidth={2.5} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex flex-col">
            <span className={`font-black text-gray-900 tracking-tight leading-none ${textClassName}`}>LocalLink</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Community</span>
        </div>
    </div>
);

// --- Navbar Component ---
const Navbar: React.FC<{ 
  activeTab: ViewState, 
  onTabChange: (t: ViewState) => void,
  user: User | null,
  onLogout: () => void,
}> = ({ activeTab, onTabChange, user, onLogout }) => (
  <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-sm transition-all">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-20">
        <div className="flex items-center" onClick={() => onTabChange(user ? 'DASHBOARD' : 'LANDING')}>
          <LocalLinkLogo />
        </div>
        
        {user ? (
          <div className="hidden md:flex space-x-2 items-center">
            <button 
              onClick={() => onTabChange('DASHBOARD')}
              className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'DASHBOARD' ? 'text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <Map className="w-4 h-4 mr-2" />
              Explore
            </button>
            <button 
               onClick={() => onTabChange('MESSAGES')}
               className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'MESSAGES' ? 'text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </button>
            
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
               <div className="text-right hidden lg:block">
                 <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
                 <div className="flex items-center justify-end gap-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <p className="text-xs text-gray-500 font-medium">{user.credits} Credits</p>
                 </div>
               </div>
               <div className="relative group cursor-pointer">
                  <div className="p-0.5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500">
                    <img src={user.avatar} className="h-10 w-10 rounded-full border-2 border-white" alt="profile" />
                  </div>
                  <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all transform origin-top-right z-50 p-2">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-sm font-bold text-gray-900">My Account</p>
                        <p className="text-xs text-gray-400">{user.location}</p>
                    </div>
                    <button onClick={() => onTabChange('PROFILE')} className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors">
                       <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                    </button>
                    <button onClick={onLogout} className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                       <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </button>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
             <button onClick={() => onTabChange('LOGIN')} className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-all">Log In</button>
             <button onClick={() => onTabChange('LOGIN')} className="ml-2 px-5 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all">Sign Up</button>
          </div>
        )}
      </div>
    </div>
  </nav>
);

// --- Broadcast Component (Visual Feature) ---
const BroadcastFeed = ({ onClose }: { onClose: () => void }) => (
    <div className="bg-red-500 text-white px-4 py-3 rounded-xl mb-8 shadow-lg shadow-red-200 flex items-center justify-between animate-[slideDown_0.3s_ease-out]">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Share2 className="w-5 h-5" />
            </div>
            <div>
                <p className="font-bold text-sm">Broadcast Signal Sent!</p>
                <p className="text-xs text-red-100">Your request "Need car jumpstart" is now pulsating to neighbors within 2km.</p>
            </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full"><X className="w-4 h-4" /></button>
    </div>
);

// --- Hero Component ---
const Hero: React.FC = () => (
  <div className="bg-indigo-900 pt-16 pb-32 px-4 sm:px-6 relative overflow-hidden">
    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[100px] opacity-30 mix-blend-screen animate-pulse"></div>
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px] opacity-30 mix-blend-screen"></div>
    
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight drop-shadow-sm">
        Exchange Skills. <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">Build Your Village.</span>
      </h1>
      <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
        The hyper-local marketplace where neighbors trade expertise for money or time-credits. Connect, barter, and thrive together.
      </p>
    </div>
  </div>
);

// --- Main App Component ---
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('LANDING');
  
  // Data State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSmartMatch, setIsSmartMatch] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);

  // Overlay State
  const [selectedBooking, setSelectedBooking] = useState<{user: User, skill: Skill} | null>(null);
  const [chatPartner, setChatPartner] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [showAddListing, setShowAddListing] = useState(false);

  // Add AI Assistant to Users
  const aiAssistant: User = {
    id: 'ai-assistant',
    name: 'LocalLink AI Guide',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=locallink',
    location: 'Virtual',
    coordinates: { lat: 0, lng: 0 },
    trustScore: 100,
    isVerified: true,
    credits: 999,
    skillsNeeded: [],
    skillsOffered: [],
    bio: 'I am your intelligent assistant. Ask me anything about the platform!'
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        mapSupabaseUserToLocal(session.user);
      } else {
        const isGuest = localStorage.getItem('locallink_is_guest');
        if (isGuest === 'true') {
            setCurrentUser(CURRENT_USER);
            setCurrentView('DASHBOARD');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        mapSupabaseUserToLocal(session.user);
        setCurrentView('DASHBOARD');
        localStorage.removeItem('locallink_is_guest');
      } else {
        const isGuest = localStorage.getItem('locallink_is_guest');
        if (isGuest !== 'true') {
             setCurrentUser(null);
             setCurrentView('LANDING');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUserToLocal = (authUser: any) => {
    const newUser: User = {
        id: authUser.id,
        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Neighbor',
        avatar: authUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.id}`,
        location: 'Local Neighborhood',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        trustScore: 100,
        isVerified: false,
        credits: 5,
        skillsNeeded: [],
        skillsOffered: [],
        bio: 'I am new to the neighborhood! Eager to help and trade skills.'
    };
    setCurrentUser(newUser);
  };

  const handleGuestLogin = () => {
      setCurrentUser(CURRENT_USER);
      setCurrentView('DASHBOARD');
      localStorage.setItem('locallink_is_guest', 'true');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('locallink_is_guest');
    setCurrentUser(null);
    setCurrentView('LANDING');
  };

  const handleProfileUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setCurrentView('DASHBOARD');
  };

  const handleSearch = (query: string, filters: any) => {
    setSearchQuery(query);
    setSelectedCategory(filters.category || '');
  };

  const handleAddListing = (listing: any) => {
      // Mock adding a new listing by creating a temp user entry or updating current user
      if (!currentUser) return;
      
      const newListingUser: User = {
          ...currentUser,
          id: `temp-${Date.now()}`,
          name: currentUser.name + (listing.type === 'REQUEST' ? ' (Seeking)' : ''),
          skillsOffered: listing.type === 'OFFER' ? [listing.skill] : [],
          skillsNeeded: listing.type === 'REQUEST' ? [listing.skill.name] : []
      };
      
      setUsers([newListingUser, ...users]);
  };

  // Filter Logic
  const filteredUsers = users.filter(user => {
    // Hide self from results (unless it's a temp listing we just made)
    if (currentUser && user.id === currentUser.id) return false;

    // 1. Smart Match
    if (isSmartMatch && currentUser) {
       const offersWhatINeed = user.skillsOffered.some(s => currentUser.skillsNeeded.some(n => s.name.toLowerCase().includes(n.toLowerCase())));
       const needsWhatIOffer = user.skillsNeeded.some(n => currentUser.skillsOffered.some(s => s.name.toLowerCase().includes(n.toLowerCase())));
       if (!offersWhatINeed && !needsWhatIOffer) return false;
    }

    // 2. Text Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = user.name.toLowerCase().includes(q);
      const matchesSkill = user.skillsOffered.some(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
      const matchesNeed = user.skillsNeeded.some(n => n.toLowerCase().includes(q));
      if (!matchesName && !matchesSkill && !matchesNeed) return false;
    }

    // 3. Category Filter
    if (selectedCategory) {
      const hasCategory = user.skillsOffered.some(s => s.category === selectedCategory);
      if (!hasCategory) return false;
    }

    return true;
  });

  // --- Render ---
  if (currentView === 'LANDING') return <LandingPage onGetStarted={() => setCurrentView('LOGIN')} />;
  if (currentView === 'LOGIN') return <LoginPage onLogin={() => {}} onGuestLogin={handleGuestLogin} onBack={() => setCurrentView('LANDING')} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      <Navbar 
        activeTab={currentView} 
        onTabChange={setCurrentView} 
        user={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow relative">
        {currentView === 'DASHBOARD' && currentUser && (
          <>
            <Hero />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative">
              <SmartSearchBar 
                onSearch={handleSearch} 
                onSmartMatchToggle={setIsSmartMatch} 
                isSmartMatchActive={isSmartMatch}
                onBroadcastClick={() => setShowBroadcast(true)}
              />

              {/* FAB for Add Listing */}
              <button 
                onClick={() => setShowAddListing(true)}
                className="fixed bottom-8 left-8 z-40 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-110 transition-all animate-bounce-in group"
                title="Post a Service or Request"
              >
                <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
              </button>

              <div className="mt-16">
                {showBroadcast && <BroadcastFeed onClose={() => setShowBroadcast(false)} />}

                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        {isSmartMatch ? 'Smart Matches For You' : 'Your Neighborhood'}
                    </h2>
                    <p className="text-gray-500 font-medium mt-1">People within 10km offering services</p>
                  </div>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                    {filteredUsers.length} Neighbors found
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredUsers.length > 0 ? filteredUsers.map(user => {
                     const isTwoWay = isSmartMatch && currentUser && 
                       user.skillsOffered.some(s => currentUser.skillsNeeded.some(n => s.name.toLowerCase().includes(n.toLowerCase()))) &&
                       user.skillsNeeded.some(n => currentUser.skillsOffered.some(s => s.name.toLowerCase().includes(n.toLowerCase())));

                     return (
                      <div key={user.id} className="relative h-full">
                        {isTwoWay && (
                          <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg animate-bounce">
                            Perfect Swap
                          </div>
                        )}
                        <UserProfileCard 
                          user={user} 
                          onBook={(u, s) => setSelectedBooking({user: u, skill: s})} 
                          onMessage={(u) => setChatPartner(u)}
                          onViewProfile={(u) => setViewingUser(u)}
                          highlightMatch={!!isTwoWay}
                        />
                      </div>
                     )
                  }) : (
                    <div className="col-span-full text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Map className="w-10 h-10 text-gray-300" />
                        </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No neighbors found nearby</h3>
                      <p className="text-gray-500 max-w-sm mx-auto mb-6">Try adjusting your filters or search for a different skill.</p>
                      <button onClick={() => {setSearchQuery(''); setSelectedCategory(''); setIsSmartMatch(false)}} className="text-indigo-600 font-bold hover:underline">Clear all filters</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {currentView === 'PROFILE' && currentUser && (
          <ProfileEditor 
            user={currentUser} 
            onSave={handleProfileUpdate} 
            onCancel={() => setCurrentView('DASHBOARD')} 
          />
        )}

        {currentView === 'MESSAGES' && currentUser && (
          <MessagesView 
            users={[aiAssistant, ...users]} 
            currentUser={currentUser}
            onOpenChat={(u) => setChatPartner(u)}
            onBack={() => setCurrentView('DASHBOARD')}
          />
        )}
      </main>

      {/* MODALS */}
      {showAddListing && (
          <AddListingModal 
            onClose={() => setShowAddListing(false)}
            onAdd={handleAddListing}
          />
      )}

      {selectedBooking && currentUser && (
        <BookingFlow 
          provider={selectedBooking.user}
          seeker={currentUser}
          skill={selectedBooking.skill}
          onClose={() => setSelectedBooking(null)}
          onConfirm={() => setSelectedBooking(null)}
        />
      )}

      {viewingUser && currentUser && (
        <UserDetailModal 
          user={viewingUser}
          onClose={() => setViewingUser(null)}
          onBook={(u, s) => { setViewingUser(null); setSelectedBooking({user: u, skill: s}); }}
          onMessage={(u) => { setViewingUser(null); setChatPartner(u); }}
        />
      )}

      {chatPartner && currentUser && (
        <>
            {/* Invisible backdrop to catch clicks outside */}
            <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setChatPartner(null)}></div>
            <div className="relative z-50" onClick={(e) => e.stopPropagation()}>
                <ChatSystem 
                currentUser={currentUser}
                activeChatUser={chatPartner}
                onClose={() => setChatPartner(null)}
                />
            </div>
        </>
      )}

      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6 opacity-50 grayscale hover:grayscale-0 transition-all">
                <LocalLinkLogo />
            </div>
            <p className="text-gray-400 text-sm font-medium">&copy; 2024 LocalLink Inc. Built for resilient communities.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;